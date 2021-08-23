import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";

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
    },
    amountInput: {
        fontSize: theme.spacing(1.6),
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
}));

const TradeItem = ({ side }) => {
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
            </div>
        </Paper>
    );
};

export default TradeItem;
