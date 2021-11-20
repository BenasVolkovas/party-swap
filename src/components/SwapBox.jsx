import { useState, useEffect, useContext } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { ChainContext, MessageContext } from "../helpers/Contexts";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SwapVertIcon from "@material-ui/icons/SwapVert";

import TradeItem from "./TradeItem";
import TokenSelect from "./TokenSelect";
import {
    convertChainToSymbol,
    convertChainToUrl,
    fromDecimalStringToIntegerString,
    fromIntegerStringToDecimalString,
} from "../helpers/functions";

const useStyles = makeStyles((theme) => ({
    rootBox: {
        margin: theme.spacing(6, 0),
        position: "relative",
    },
    wrongNetworkError: {
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "absolute",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(5),
    },
    wronkNetworkMessage: {
        padding: theme.spacing(2),
    },
    actionPart: {
        padding: theme.spacing(1.5),
    },
    title: {
        padding: theme.spacing(2),
    },
    switchButtonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(0.5, 0),
    },
    switchButton: {
        minWidth: 0,
        margin: 0,
        padding: theme.spacing(0.5),
    },
    switchIcon: {
        fontSize: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(3),
        width: "100%",
    },
}));

const SwapBox = () => {
    const Web3Api = useMoralisWeb3Api();
    const {
        user,
        web3,
        isWeb3Enabled,
        authenticate,
        isAuthenticated,
        Moralis,
    } = useMoralis();
    const {
        currentChain,
        setCurrentChain,
        availableChain,
        setAvailableChain,
        setShowNetworkMessage,
    } = useContext(ChainContext);
    const { setCustomMessage, setShowCustomMessage } =
        useContext(MessageContext);
    const [tokens, setTokens] = useState({});
    const [balances, setBalances] = useState({});
    const [chainUrlNumber, setChainUrlNumber] = useState("1"); // 1 is ehtereum mainnet network api for 1inch
    const [dex, setDex] = useState("");
    const [enoughAllowance, setEnoughAllowance] = useState(false);
    const [enoughBalance, setEnoughBalance] = useState(true);
    const [openSelect, setOpenSelect] = useState(false);
    const [enoughLiquidity, setEnoughLiquidity] = useState(true);
    const [openedSide, setOpenedSide] = useState("");
    const [selectedTokens, setSelectedTokens] = useState({
        from: { info: {}, amount: "" },
        to: { info: {}, amount: "" },
    });
    const classes = useStyles();

    useEffect(() => {
        initializePlugin();

        Moralis.onChainChanged(async (chainId) => {
            setCurrentChain(chainId);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getQuote();
        checkBalance();
    }, [selectedTokens.from, selectedTokens.to.info]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (
            selectedTokens.from.amount === "" &&
            selectedTokens.to.amount !== ""
        ) {
            setSelectedTokens((currentTokens) => ({
                ...currentTokens,
                to: {
                    info: currentTokens.to.info,
                    amount: "",
                },
            }));
        }
    }, [selectedTokens.to.amount]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isWeb3Enabled) {
            if (isAuthenticated) {
                const chainId = web3.currentProvider.chainId;
                setCurrentChain(chainId);
            } else {
                setCurrentChain("eth");
            }
        }
    }, [isWeb3Enabled, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getSupportedTokens();
    }, [chainUrlNumber]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isAuthenticated && isWeb3Enabled) {
            const curentChainStatus = convertChainToSymbol(currentChain);
            if (curentChainStatus.change) {
                setCurrentChain(curentChainStatus.symbol);
            } else if (curentChainStatus.available) {
                const metamaskChain = convertChainToSymbol(
                    web3.currentProvider.chainId
                );

                if (currentChain === metamaskChain.symbol) {
                    setSelectedTokens({
                        from: { info: {}, amount: "" },
                        to: { info: {}, amount: "" },
                    });

                    setAvailableChain(true);
                    setChainUrlNumber(convertChainToUrl(currentChain));
                    setShowNetworkMessage(false);
                } else {
                    setShowNetworkMessage(true);
                }
            } else {
                setAvailableChain(false);
            }
        } else {
            // else current chain will always be one from select list
            setAvailableChain(true);
            setChainUrlNumber(convertChainToUrl(currentChain));
            setSelectedTokens({
                from: { info: {}, amount: "" },
                to: { info: {}, amount: "" },
            });
        }
    }, [currentChain]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchBalance();
    }, [tokens]); // eslint-disable-line react-hooks/exhaustive-deps

    const initializePlugin = async () => {
        await Moralis.initPlugins();
        setDex(Moralis.Plugins.oneInch);
    };

    const getSupportedTokens = async () => {
        if (chainUrlNumber) {
            axios({
                method: "get",
                url: `https://api.1inch.exchange/v3.0/${chainUrlNumber}/tokens`,
                headers: {
                    "Content-Type": "application/json",
                },
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN",
            }).then((response) => {
                const data = response.data;
                setTokens(data.tokens);
            });
        }
    };

    const fetchBalance = async () => {
        if (isAuthenticated) {
            const balance = await Web3Api.account.getTokenBalances({
                chain: currentChain,
            });

            const balancesObject = balance.reduce(
                (previousObject, currentItem) => {
                    previousObject[currentItem.token_address] =
                        fromIntegerStringToDecimalString(
                            currentItem.balance,
                            currentItem.decimals
                        );

                    return previousObject;
                },
                {}
            );

            const nativeBalance = await Web3Api.account.getNativeBalance({
                chain: currentChain,
            });

            if (nativeBalance.balance > 0) {
                balancesObject["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"] =
                    fromIntegerStringToDecimalString(
                        nativeBalance.balance,
                        tokens["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"]
                            .decimals
                    );
            }

            setBalances(balancesObject);
        }
    };

    const getQuote = async () => {
        if (
            chainUrlNumber &&
            selectedTokens.from.info.address &&
            selectedTokens.to.info.address
        ) {
            const amountToSell = getAmountToSell();
            if (amountToSell > 0) {
                axios({
                    method: "get",
                    url: `https://api.1inch.exchange/v3.0/${chainUrlNumber}/quote?fromTokenAddress=${selectedTokens.from.info.address}&toTokenAddress=${selectedTokens.to.info.address}&amount=${amountToSell}&fee=1`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    xsrfCookieName: "XSRF-TOKEN",
                    xsrfHeaderName: "X-XSRF-TOKEN",
                })
                    .then((response) => {
                        const data = response.data;

                        setSelectedTokens((currentTokens) => ({
                            ...currentTokens,
                            to: {
                                info: currentTokens.to.info,
                                amount: fromIntegerStringToDecimalString(
                                    data.toTokenAmount,
                                    data.toToken.decimals
                                ),
                            },
                        }));
                        setEnoughLiquidity(true);
                    })
                    .catch((error) => {
                        if (
                            error.response.data.statusCode === 400 &&
                            error.response.data.description ===
                                "insufficient liquidity"
                        ) {
                            setEnoughLiquidity(false);
                            setSelectedTokens((currentTokens) => ({
                                ...currentTokens,
                                to: {
                                    info: currentTokens.to.info,
                                    amount: "",
                                },
                            }));
                        }
                    });
            } else {
                setSelectedTokens((currentTokens) => ({
                    ...currentTokens,
                    to: {
                        info: currentTokens.to.info,
                        amount: "",
                    },
                }));
            }
        }
    };

    const checkAllowance = async () => {
        if (isAuthenticated) {
            if (
                selectedTokens.from.info.address &&
                selectedTokens.to.info.address
            ) {
                if (
                    selectedTokens.from.info.address ===
                    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                ) {
                    setEnoughAllowance(true);
                } else {
                    const amountToSell = getAmountToSell();
                    if (amountToSell > 0) {
                        const response = await dex.hasAllowance({
                            chain: currentChain,
                            fromTokenAddress: selectedTokens.from.info.address, // The token user wants to swap
                            fromAddress: user.attributes.ethAddress, // User wallet address
                            amount: amountToSell,
                        });

                        if (
                            response.success &&
                            typeof response.result === "boolean"
                        ) {
                            setEnoughAllowance(response.result);
                        } else {
                            setEnoughAllowance(false);
                        }
                    }
                }
            }
        }
    };

    const checkBalance = () => {
        if (isAuthenticated) {
            const inputAmount = parseInt(
                fromDecimalStringToIntegerString(
                    selectedTokens.from.amount,
                    selectedTokens.from.info.decimals
                )
            );
            const balanceAmount = parseInt(
                fromDecimalStringToIntegerString(
                    selectedTokens.from.info.address
                        ? balances[selectedTokens.from.info.address]
                        : 0,
                    selectedTokens.from.info.decimals
                )
            );

            if (inputAmount <= balanceAmount && inputAmount !== 0) {
                setEnoughBalance(true);
                checkAllowance();
            } else {
                setEnoughBalance(false);
            }
        }
    };

    const approveSwap = async () => {
        const approve = await dex.approve({
            chain: currentChain,
            tokenAddress: selectedTokens.from.info.address,
            fromAddress: user.attributes.ethAddress,
        });

        try {
            const approveTransaction = await web3.eth.sendTransaction(
                approve.result.data
            );

            if (approveTransaction) {
                setCustomMessage({
                    message:
                        "Leidimas sėkmingai suteiktas. Palaukite, kol šis veiksmas bus patvirtinas tinkle.",
                    severity: "success",
                });
                setShowCustomMessage(true);
            }
        } catch (error) {
            setCustomMessage({
                message:
                    "Įvyko klaida, bandant suteikti leidimą. Pabandykite dar kartą.",
                severity: "error",
            });
            setShowCustomMessage(true);
        }
    };

    const swapTransaction = async () => {
        if (
            chainUrlNumber &&
            selectedTokens.from.info.address &&
            selectedTokens.to.info.address
        ) {
            const amountToSell = getAmountToSell();
            if (amountToSell > 0) {
                axios({
                    method: "get",
                    url: `https://api.1inch.exchange/v3.0/${chainUrlNumber}/swap?fromTokenAddress=${selectedTokens.from.info.address}&toTokenAddress=${selectedTokens.to.info.address}&amount=${amountToSell}&fromAddress=${user.attributes.ethAddress}&slippage=0.5&referrerAddress=${process.env.REACT_APP_MY_WALLET_ADDRESS}&fee=1`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    xsrfCookieName: "XSRF-TOKEN",
                    xsrfHeaderName: "X-XSRF-TOKEN",
                }).then(async (response) => {
                    const data = response.data;

                    if (data) {
                        try {
                            const transaction = await web3.eth.sendTransaction(
                                data.tx
                            );

                            if (transaction) {
                                setCustomMessage({
                                    message:
                                        "Valiutos sėkmingai iškeistos. Palaukite, kol šis veiksmas bus patvirtinas tinkle.",
                                    severity: "success",
                                });
                                setShowCustomMessage(true);

                                setSelectedTokens({
                                    from: { info: {}, amount: "" },
                                    to: { info: {}, amount: "" },
                                });
                            }
                        } catch (error) {
                            setCustomMessage({
                                message:
                                    "Įvyko klaida, bandant keisti valiutas. Pabandykite dar kartą.",
                                severity: "error",
                            });
                            setShowCustomMessage(true);
                        }
                    }
                });
            }
        }
    };

    const handleTokenSelectOpen = (side) => {
        setOpenSelect(true);
        setOpenedSide(side);
    };

    const handleTokenSelectClose = () => {
        setOpenSelect(false);
        setOpenedSide("");
    };

    const updateSelectedToken = (side, token) => {
        const oppositeSide =
            side === "from" ? "to" : side === "to" ? "from" : null;

        setSelectedTokens((currentTokens) => ({
            ...currentTokens,
            [side]:
                token !== currentTokens[oppositeSide].info
                    ? { ...currentTokens[side], info: token }
                    : currentTokens[side],
        }));
    };

    const updateSelectedTokenAmount = (amount) => {
        const tokenDecimals = selectedTokens.from.info.decimals;
        const dotPlace = amount.indexOf(".");
        const decimalsFound = amount.length - (dotPlace + 1);

        if (decimalsFound > tokenDecimals) {
            amount = amount
                .split("")
                .slice(0, dotPlace + tokenDecimals + 1)
                .join("");
        }

        setSelectedTokens((currentTokens) => ({
            ...currentTokens,
            from: { ...currentTokens.from, amount: amount },
        }));
    };

    const switchTokensSides = () => {
        setSelectedTokens((currentTokens) => ({
            from: currentTokens.to,
            to: currentTokens.from,
        }));
    };

    const getAmountToSell = () => {
        const integerAmount = fromDecimalStringToIntegerString(
            selectedTokens.from.amount,
            selectedTokens.from.info.decimals
        );
        return parseInt(integerAmount);
    };

    return (
        <>
            <Container maxWidth="sm">
                <Paper elevation={3} className={classes.rootBox}>
                    {!availableChain && (
                        <div className={classes.wrongNetworkError}>
                            <Paper className={classes.wronkNetworkMessage}>
                                <Typography variant="body1">
                                    Netinkamas tinklas.
                                </Typography>
                                <Typography variant="body2">
                                    Norėdami tęsti MetaMask piniginėje
                                    pasirinkite tinklą tarp „Ethereum“, „Binance
                                    Smart Chain“ ir „Polygon (Matic)“.
                                </Typography>
                            </Paper>
                        </div>
                    )}

                    <Typography variant="h5" className={classes.title}>
                        Keitykla
                    </Typography>
                    <Divider />

                    <div className={classes.actionPart}>
                        <TradeItem
                            side="from"
                            isAuthenticated={isAuthenticated}
                            activeToken={selectedTokens.from}
                            balance={
                                balances[selectedTokens.from.info.address] || 0
                            }
                            handleTokenSelectOpen={(side) =>
                                handleTokenSelectOpen(side)
                            }
                            updateSelectedTokenAmount={(amount) =>
                                updateSelectedTokenAmount(amount)
                            }
                        />
                        <div className={classes.switchButtonContainer}>
                            <IconButton
                                color="primary"
                                className={classes.switchButton}
                                onClick={() => switchTokensSides()}
                            >
                                <SwapVertIcon className={classes.switchIcon} />
                            </IconButton>
                        </div>
                        <TradeItem
                            side="to"
                            isAuthenticated={isAuthenticated}
                            activeToken={selectedTokens.to}
                            balance={
                                balances[selectedTokens.to.info.address] || 0
                            }
                            handleTokenSelectOpen={(side) =>
                                handleTokenSelectOpen(side)
                            }
                        />

                        {!isAuthenticated ? (
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => authenticate()}
                            >
                                Prisijungti su pinigine
                            </Button>
                        ) : !enoughBalance ? (
                            <Button
                                disabled
                                variant="contained"
                                color="primary"
                                className={classes.button}
                            >
                                Nepakankamas valiutos balansas
                            </Button>
                        ) : !selectedTokens.to.info.address ? (
                            <Button
                                disabled
                                variant="contained"
                                color="primary"
                                className={classes.button}
                            >
                                Pasirinkite valiutą
                            </Button>
                        ) : !enoughLiquidity ? (
                            <Button
                                disabled
                                variant="contained"
                                color="primary"
                                className={classes.button}
                            >
                                Nepakankamas likvidumas
                            </Button>
                        ) : !enoughAllowance ? (
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => approveSwap()}
                            >
                                Duoti teisę keisti
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => swapTransaction()}
                            >
                                Keisti
                            </Button>
                        )}
                    </div>
                </Paper>
            </Container>
            <TokenSelect
                open={openSelect}
                side={openedSide}
                selected={selectedTokens[openedSide]}
                tokens={Object.values(tokens)}
                handleTokenSelectClose={() => handleTokenSelectClose()}
                selectToken={(side, token) => updateSelectedToken(side, token)}
            />
        </>
    );
};

export default SwapBox;
