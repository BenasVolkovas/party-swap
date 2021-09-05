import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
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
        marginTop: theme.spacing(10),
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
    return (Number(number) / Math.pow(10, decimal)).toFixed(decimal);
};

const SwapBox = () => {
    const { authenticate, isAuthenticated } = useMoralis();
    const [tokens, setTokens] = useState({});
    const [openSelect, setOpenSelect] = useState(false);
    const [openedSide, setOpenedSide] = useState("");
    const [selectedTokens, setSelectedTokens] = useState({
        from: { info: {}, amount: "" },
        to: { info: {}, amount: "" },
    });
    const classes = useStyles();

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

            console.log("SELL: ", amountToSell);

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
                        console.log(data);

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

    return (
        <>
            <Container maxWidth="sm">
                <Paper elevation={3} className={classes.rootBox}>
                    <Typography variant="h5" className={classes.title}>
                        Keitykla
                    </Typography>
                    <Divider />

                    <div className={classes.actionPart}>
                        <TradeItem
                            side="from"
                            activeToken={selectedTokens.from}
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
                            activeToken={selectedTokens.to}
                            handleTokenSelectOpen={(side) =>
                                handleTokenSelectOpen(side)
                            }
                            updateSelectedTokenAmount={(side, amount) =>
                                updateSelectedTokenAmount(side, amount)
                            }
                        />

                        {isAuthenticated ? (
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => getQuote()}
                            >
                                Keisti
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => authenticate()}
                            >
                                Prisijungti su pinigine
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
