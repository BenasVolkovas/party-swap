import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

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
    selectedToken: {
        display: "flex",
        flexDirection: "row",
    },
}));

const TradeItem = ({ side, handleTokenSelectOpen }) => {
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
                <Button
                    variant="outlined"
                    className={classes.selectedToken}
                    onClick={() => handleTokenSelectOpen(side)}
                >
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                </Button>
            </div>
        </Paper>
    );
};

export default TradeItem;
