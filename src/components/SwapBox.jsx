import { useState, useEffect } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
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
        web3,
        enableWeb3,
        isWeb3Enabled,
        authenticate,
        isAuthenticated,
        Moralis,
    } = useMoralis();
    const [tokens, setTokens] = useState({});
    const [balances, setBalances] = useState({});
    const [currentChain, setCurrentChain] = useState("");
    const [availableChain, setAvailableChain] = useState(true);
    const [openSelect, setOpenSelect] = useState(false);
    const [openedSide, setOpenedSide] = useState("");
    const [selectedTokens, setSelectedTokens] = useState({
        from: { info: {}, amount: "" },
        to: { info: {}, amount: "" },
    });
    const classes = useStyles();

    //
    //

    //
    //

    useEffect(() => {
        axios({
            method: "get",
            url: "https://api.1inch.exchange/v3.0/1/tokens",
            headers: {
                "Content-Type": "application/json",
            },
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN",
        }).then((response) => {
            const data = response.data;
            setTokens(data.tokens);
        });
    }, []);

    useEffect(() => {
        getQuote();
    }, [selectedTokens.from, selectedTokens.to.info]);

    useEffect(() => {
        console.log("Enabled: ", isWeb3Enabled);
        if (isWeb3Enabled) {
            const chainId = web3.currentProvider.chainId;
            setCurrentChain(chainId);
        }
    }, [isWeb3Enabled]);

    useEffect(() => {
        if (isWeb3Enabled) {
            fetchBalance(currentChain);
        }
    }, [currentChain]);

    Moralis.onChainChanged(async (chainId) => {
        setCurrentChain(chainId);
    });

    const fetchBalance = async (chainId) => {
        if (chainId === "eth" || chainId === "mainnet" || chainId === "0x1") {
            let balance = await Web3Api.account.getTokenBalances({
                chain: chainId,
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

            setAvailableChain(true);
            setBalances(balancesObject);
        } else {
            setAvailableChain(false);
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
        setSelectedTokens((currentTokens) => ({
            ...currentTokens,
            [side]: { ...currentTokens[side], amount: amount },
        }));
    };

    const switchTokensSides = () => {
        setSelectedTokens((currentTokens) => ({
            from: currentTokens.to,
            to: currentTokens.from,
        }));
    };

    const getQuote = () => {
        if (
            selectedTokens.from.info.address &&
            selectedTokens.to.info.address
        ) {
            const amountToSell = fromDecimalStringToIntegerString(
                selectedTokens.from.amount,
                selectedTokens.from.info.decimals
            );

            if (Number(amountToSell) > 0) {
                axios({
                    method: "get",
                    url: `https://api.1inch.exchange/v3.0/1/quote?fromTokenAddress=${selectedTokens.from.info.address}&toTokenAddress=${selectedTokens.to.info.address}&amount=${amountToSell}&fee=1`,
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
                    })
                    .catch((error) => {
                        console.log(error.response);
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

    const approveSpender = () => {
        axios({
            method: "get",
            url: `https://api.1inch.exchange/v3.0/1/approve/spender`,
            headers: {
                "Content-Type": "application/json",
            },
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN",
        })
            .then((response) => {
                const data = response.data;

                console.log("data: ", data);
            })
            .catch((error) => {
                console.log(error.response);
            });
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
                                    Norėdami tęsti pasirinkite „Ethereum
                                    mainnet“ tinklą.
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
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => getQuote()}
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
