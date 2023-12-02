import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
// import { ByMoralis } from "react-moralis";
import TopNav from "../components/TopNav";
import SwapBox from "../components/SwapBox";
import Alert from "@material-ui/lab/Alert";
import inchLogo from "../assets/images/1inch.svg";

const useStyles = makeStyles((theme) => ({
    alert: {
        margin: theme.spacing(1, 1, 0, 1),
    },
    bottomLogos: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        margin: theme.spacing(2),
        height: theme.spacing(5),
    },
}));

const SwapView = () => {
    const [apiAvailable, setApiAvailable] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        axios({
            method: "get",
            url: "https://api.1inch.exchange/v3.0/56/healthcheck",
            headers: {
                "Content-Type": "application/json",
            },
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN",
        }).then((response) => {
            const data = response.data;
            if (data.status === "OK") {
                setApiAvailable(true);
            } else {
                setApiAvailable(false);
            }
        });
    }, []);

    return (
        <>
            <TopNav />
            {true ? (
                <SwapBox />
            ) : (
                <Alert severity="error" className={classes.alert}>
                    Kriptovaliutų keitykla laikinai neveikia.
                </Alert>
            )}
            <div className={classes.bottomLogos}>
                {/* <ByMoralis variant="dark" width={150} /> */}
                <img src={inchLogo} alt="Moralis logo" height="100%" />
            </div>
        </>
    );
};

export default SwapView;
