import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import TokenSelect from "./TokenSelect";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.lightGrayColor.color,
    },
    topDetails: {
        padding: theme.spacing(1.2, 1.6, 0, 1.6),
    },
    sideTitle: {},
    bottomDetails: {
        padding: theme.spacing(1.2, 1.6),
        display: "flex",
        flexDirection: "row",
    },
    amountInput: {
        fontSize: theme.spacing(1.6),
        flexGrow: 1,
        "& > ::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& > ::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& > [type=number]": {
            "-moz-appearance": "textfield",
        },
    },
    selectedTokenButton: {
        flexShrink: 0,
        display: "flex",
        flexDirection: "row",
        backgroundColor: theme.whiteColor.color,
        height: theme.spacing(3.6),
        padding: theme.spacing(0),
    },
    tokenLogo: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
        marginLeft: theme.spacing(0.6),
    },
    tokenSymbol: {
        marginLeft: theme.spacing(0.6),
    },
    downArrowIcon: {
        marginRight: theme.spacing(1),
    },
    noTokenButton: {
        flexShrink: 0,
        display: "flex",
        flexDirection: "row",
        height: theme.spacing(3.6),
        backgroundColor: theme.whiteColor.color,
    },
}));

const TradeItem = ({ side, activeToken, handleTokenSelectOpen }) => {
    const classes = useStyles();

    return (
        <Paper elevation={0} variant="outlined" className={classes.root}>
            <div className={classes.topDetails}>
                <Typography variant="body2" className={classes.sideTitle}>
                    {side === "from" ? "Iš" : side === "to" ? "Į" : null}
                </Typography>
            </div>
            <div className={classes.bottomDetails}>
                <Input
                    required
                    disableUnderline
                    type="number"
                    placeholder="0.0"
                    className={classes.amountInput}
                />
                {activeToken ? (
                    <Button
                        variant="outlined"
                        endIcon={
                            <ExpandMoreIcon className={classes.downArrowIcon} />
                        }
                        className={classes.selectedTokenButton}
                        onClick={() => handleTokenSelectOpen(side)}
                    >
                        <Avatar
                            variant="circle"
                            src={activeToken.logoURI}
                            alt={activeToken.name}
                            className={classes.tokenLogo}
                        />
                        <Typography
                            variant="body1"
                            className={classes.tokenSymbol}
                        >
                            {activeToken.symbol}
                        </Typography>
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        className={classes.noTokenButton}
                        onClick={() => handleTokenSelectOpen(side)}
                    >
                        Pasirinkite…
                    </Button>
                )}
            </div>
        </Paper>
    );
};

export default TradeItem;
