import { useState, useEffect, useContext } from "react";
import {
    useMoralis,
    useMoralisWeb3Api,
    useMoralisWeb3ApiCall,
} from "react-moralis";
import { ChainContext } from "../helpers/Contexts";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import Backdrop from "@material-ui/core/Backdrop";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Input from "@material-ui/core/Input";
import SwapVertIcon from "@material-ui/icons/SwapVert";

import TradeItem from "./TradeItem";
import TokenSelect from "./TokenSelect";
import { convertChainToSymbol, convertChainToUrl } from "../helpers/functions";

const useStyles = makeStyles((theme) => ({
    rootBox: {
        marginTop: theme.spacing(6),
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

const fromDecimalStringToIntegerString = (number, decimal) => {
    const arr = Number(number).toFixed(decimal).toString().split(".");
    return arr.join("");
};

const fromIntegerStringToDecimalString = (number, decimal) => {
    const decimalNumber = (Number(number) / Math.pow(10, decimal)).toFixed(
        decimal
    );

    let zeros = 0;
    for (const char of decimalNumber.split("").reverse()) {
        if (char === "0") {
            zeros += 1;
        } else if (char === ".") {
            zeros += 1;
            break;
        } else {
            break;
        }
    }

    let decimalWithoutZeros = decimalNumber;
    if (zeros > 0) {
        decimalWithoutZeros = decimalNumber.slice(0, -zeros);
    }
    return decimalWithoutZeros;
};

const SwapBox = () => {
    const Web3Api = useMoralisWeb3Api();
    const {
        user,
        web3,
        enableWeb3,
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
    const [tokens, setTokens] = useState({});
    const [balances, setBalances] = useState({});
    const [chainUrlNumber, setChainUrlNumber] = useState("1"); // 1 is ehtereum mainnet network api for 1inch
    const [dex, setDex] = useState("");
    const [amountToSell, setAmountToSell] = useState(0);
    const [enoughAllowance, setEnoughAllowance] = useState(true);
    const [enoughBalance, setEnoughBalance] = useState(true);
    const [openSelect, setOpenSelect] = useState(false);
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
    }, []);

    useEffect(() => {
        getQuote();
        checkBalance();
        checkAllowance();
    }, [selectedTokens.from, selectedTokens.to.info]);

    useEffect(() => {
        if (isWeb3Enabled) {
            if (isAuthenticated) {
                const chainId = web3.currentProvider.chainId;
                setCurrentChain(chainId);
            } else {
                setCurrentChain("eth");
            }
        }
    }, [isWeb3Enabled, isAuthenticated]);

    useEffect(() => {
        getSupportedTokens();
    }, [chainUrlNumber]);

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
                    setAmountToSell(0);

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
        }
    }, [currentChain]);

    useEffect(() => {
        fetchBalance();
    }, [tokens]);

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

        console.log(web3);
    };

    const fetchBalance = async () => {
        const balance = await Web3Api.account.getTokenBalances({
            chain: currentChain,
        });

        const balancesObject = balance.reduce((previousObject, currentItem) => {
            previousObject[currentItem.token_address] =
                fromIntegerStringToDecimalString(
                    currentItem.balance,
                    currentItem.decimals
                );

            return previousObject;
        }, {});

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
    };

    // TODO change the gas price (test in swagger)/ test swap and get response
    const getQuote = async () => {
        if (
            chainUrlNumber &&
            selectedTokens.from.info.address &&
            selectedTokens.to.info.address
        ) {
            if (amountToSell > 0) {
                axios({
                    method: "get",
                    url: `https://api.1inch.exchange/v3.0/${chainUrlNumber}/quote?fromTokenAddress=${selectedTokens.from.info.address}&toTokenAddress=${selectedTokens.to.info.address}&amount=${amountToSell}&fee=1`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    xsrfCookieName: "XSRF-TOKEN",
                    xsrfHeaderName: "X-XSRF-TOKEN",
                }).then((response) => {
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
        if (selectedTokens.from.info.address) {
            if (
                selectedTokens.from.info.address ===
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            ) {
                setEnoughAllowance(true);
            } else {
                if (amountToSell > 0) {
                    const response = await dex.hasAllowance({
                        chain: currentChain,
                        fromTokenAddress: selectedTokens.from.info.address, // The token user wants to swap
                        fromAddress: user.attributes.ethAddress, // User wallet address
                        amount: amountToSell,
                    });
                    // TODO handle error
                    console.log(response);
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
    };

    const checkBalance = () => {
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
        } else {
            setEnoughBalance(false);
        }
    };

    const approveSwap = async () => {
        console.log(`approve`);
        await dex.approve({
            chain: currentChain,
            tokenAddress: selectedTokens.from.info.address,
            fromAddress: user.attributes.ethAddress,
        });
    };

    const swapTransaction = () => {
        if (
            chainUrlNumber &&
            selectedTokens.from.info.address &&
            selectedTokens.to.info.address
        ) {
            if (amountToSell > 0) {
                axios({
                    method: "get",
                    url: `https://api.1inch.exchange/v3.0/${chainUrlNumber}/swap?fromTokenAddress=${selectedTokens.from.info.address}&toTokenAddress=${selectedTokens.to.info.address}&amount=${amountToSell}&fromAddress=${user.attributes.ethAddress}&slippage=0.5&referrerAddress=${process.env.REACT_APP_MY_WALLET_ADDRESS}&fee=1`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    xsrfCookieName: "XSRF-TOKEN",
                    xsrfHeaderName: "X-XSRF-TOKEN",
                }).then((response) => {
                    const data = response.data;

                    console.log("Swap data: ", data);
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

    const updateSelectedTokenAmount = (side, amount) => {
        const tokenDecimals = selectedTokens[side].info.decimals;
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
            [side]: { ...currentTokens[side], amount: amount },
        }));

        if (side === "from") {
            const nonDecimalAmount = fromDecimalStringToIntegerString(
                amount,
                selectedTokens.from.info.decimals
            );
            setAmountToSell(parseInt(nonDecimalAmount));
        }
    };

    const switchTokensSides = () => {
        setSelectedTokens((currentTokens) => ({
            from: currentTokens.to,
            to: currentTokens.from,
        }));
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
                            updateSelectedTokenAmount={(side, amount) =>
                                updateSelectedTokenAmount(side, amount)
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
                            updateSelectedTokenAmount={(side, amount) =>
                                updateSelectedTokenAmount(side, amount)
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
                        ) : !enoughAllowance ? (
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => approveSwap()}
                            >
                                Įgalinti puslapį
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
