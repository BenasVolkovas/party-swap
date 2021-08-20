import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { makeStyles } from "@material-ui/core/styles";

import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";

import CloseIcon from "@material-ui/icons/Close";

import Logo from "../assets/images/logo.svg";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.whiteColor.color,
        position: "sticky",
        top: 0,
        left: 0,
    },
    title: {
        fontFamily: ["Kodchasan", "sans-serif"].join(","),
        flex: 1,
        marginLeft: theme.spacing(1.5),
    },
    logo: {
        width: theme.spacing(4),
    },
}));

const TopNav = () => {
    const [openError, setOpenError] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [shortAddress, setShortAddress] = useState("");
    const {
        authenticate,
        isAuthenticated,
        isAuthenticating,
        authError,
        logout,
        user,
    } = useMoralis();
    const classes = useStyles();

    useEffect(() => {
        if (isAuthenticated) {
            const address = user.attributes.ethAddress;
            setShortAddress(
                address.substr(0, 6) +
                    "…" +
                    address.substr(address.length - 4, address.length)
            );
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (authError) {
            setOpenError(true);
        }
    }, [authError]);

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const disconnectWallet = () => {
        closeMenu();
        logout();
    };

    return (
        <>
            <AppBar className={classes.root}>
                <Toolbar>
                    {/* Brand name */}
                    <img src={Logo} alt="logo" className={classes.logo} />
                    <Typography variant="h4" className={classes.title}>
                        PartySwap
                    </Typography>

                    {/* Login or logout button, depending on the authentication state */}
                    {isAuthenticated ? (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => openMenu(e)}
                            >
                                {shortAddress}
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => closeMenu()}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                <MenuItem onClick={() => disconnectWallet()}>
                                    Atsijungti
                                </MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => authenticate()}
                        >
                            Prisijungti su pinigine
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            {/* Authentication errors occur when user does not provide sinature to the request  */}
            {authError && (
                <Collapse in={openError}>
                    <Alert
                        severity="error"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpenError(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        <AlertTitle>Prisijungimo klaida</AlertTitle>
                        {authError.message}
                    </Alert>
                </Collapse>
            )}
        </>
    );
};

export default TopNav;
