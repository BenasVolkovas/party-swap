import { makeStyles } from "@material-ui/core/styles";

import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.lightGrayColor.color,
    },
    topDetails: {
        padding: theme.spacing(1.2, 1.6, 0, 1.6),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sideTitle: {},
    bottomDetails: {
        padding: theme.spacing(1.2, 1.6),
        display: "flex",
        flexDirection: "row",
    },
    amountInput: {
        fontSize: theme.spacing(1.6),
        marginRight: theme.spacing(1),
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
    balance: {
        display: "flex",
        flexDirection: "row",

        alignItems: "center",
        justifyContent: "flex-end",
    },
    maxBalanceButton: {
        color: theme.themeColor.color,
        fontFamily: ["Kodchasan", "sans-serif"].join(","),
        paddingLeft: theme.spacing(0.5),
    },
}));

const TradeItem = ({
    side,
    isAuthenticated,
    activeToken,
    balance,
    handleTokenSelectOpen,
    updateSelectedTokenAmount,
}) => {
    const classes = useStyles();

    return (
        <Paper elevation={0} variant="outlined" className={classes.root}>
            <div className={classes.topDetails}>
                <Typography variant="body2" className={classes.sideTitle}>
                    {side === "from" ? "Iš" : side === "to" ? "Į" : null}
                </Typography>
                {isAuthenticated && Object.keys(activeToken.info).length > 0 ? (
                    <Typography variant="body2" className={classes.balance}>
                        <span>Balansas: {balance}</span>
                        {balance > 0 && side === "from" ? (
                            <Link
                                component="button"
                                variant="body2"
                                className={classes.maxBalanceButton}
                                onClick={() =>
                                    updateSelectedTokenAmount(
                                        balance.toString()
                                    )
                                }
                            >
                                (MAX)
                            </Link>
                        ) : null}
                    </Typography>
                ) : null}
            </div>
            <div className={classes.bottomDetails}>
                <Input
                    readOnly={side === "to"}
                    required
                    disableUnderline
                    type="number"
                    placeholder="0.0"
                    value={activeToken.amount}
                    onChange={(e) => updateSelectedTokenAmount(e.target.value)}
                    className={classes.amountInput}
                />
                {Object.entries(activeToken.info).length !== 0 ? (
                    <Button
                        variant="outlined"
                        endIcon={
                            <ExpandMoreIcon className={classes.downArrowIcon} />
                        }
                        className={classes.selectedTokenButton}
                        onClick={() => handleTokenSelectOpen(side)}
                    >
                        <Avatar
                            variant="circular"
                            src={activeToken.info.logoURI}
                            alt={activeToken.info.name}
                            className={classes.tokenLogo}
                        />
                        <Typography
                            variant="body1"
                            className={classes.tokenSymbol}
                        >
                            {activeToken.info.symbol}
                        </Typography>
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        endIcon={<ExpandMoreIcon />}
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
