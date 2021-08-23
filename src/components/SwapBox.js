import { useMoralis } from "react-moralis";
import { makeStyles } from "@material-ui/core/styles";

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

const useStyles = makeStyles((theme) => ({
    rootBox: {
        marginTop: theme.spacing(5),
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
    const { authenticate, isAuthenticated } = useMoralis();
    const classes = useStyles();

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} className={classes.rootBox}>
                <Typography variant="h5" className={classes.title}>
                    Keitykla
                </Typography>
                <Divider />

                <div className={classes.actionPart}>
                    <TradeItem side="from" />
                    <div className={classes.switchButtonContainer}>
                        <IconButton
                            color="primary"
                            className={classes.switchButton}
                        >
                            <SwapVertIcon className={classes.switchIcon} />
                        </IconButton>
                    </div>
                    <TradeItem side="to" />

                    {isAuthenticated ? (
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
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
    );
};

export default SwapBox;
