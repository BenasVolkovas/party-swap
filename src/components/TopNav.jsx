import { useState, useEffect, useContext } from "react";
import { useMoralis } from "react-moralis";
import { ChainContext } from "../helpers/Contexts";
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
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/Close";

import { availableChainOptions } from "../helpers/availableOptions";
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
        marginLeft: theme.spacing(1.5),
        color: theme.blackColor.color,
        display: "none",
        flexGrow: 1,
        [theme.breakpoints.up("sm")]: {
            display: "block",
        },
    },
    logoContainer: {
        flexGrow: 1,
        [theme.breakpoints.up("sm")]: {
            flexGrow: 0,
        },
    },
    logo: {
        height: theme.spacing(4),
        width: theme.spacing(4),
    },
    alert: {
        margin: theme.spacing(1, 1, 0, 1),
    },
    chainChangeInput: {
        margin: theme.spacing(0, 1),
    },
    icon: {
        color: theme.blackColor.color,
    },
    actionArea: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
}));

const TopNav = () => {
    const { currentChain, setCurrentChain } = useContext(ChainContext);
    const [openAuthError, setOpenAuthError] = useState(false);
    const [openWeb3Error, setOpenWeb3Error] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [shortAddress, setShortAddress] = useState("");
    const {
        web3,
        enableWeb3,
        web3EnableError,
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
            enableWeb3();

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
            setOpenAuthError(true);
        }
    }, [authError]);

    useEffect(() => {
        if (web3EnableError) {
            setOpenWeb3Error(true);
        }
    }, [web3EnableError]);

    const updateChain = (e) => {
        setCurrentChain(e.target.value);
    };

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
                    <div className={classes.logoContainer}>
                        <img src={Logo} alt="logo" className={classes.logo} />
                    </div>
                    <Typography variant="h4" className={classes.title}>
                        PartySwap
                    </Typography>

                    {/* Login or logout button, depending on the authentication state */}

                    <div className={classes.actionArea}>
                        <Select
                            margin="dense"
                            variant="outlined"
                            color="primary"
                            name="chain"
                            IconComponent={ExpandMoreIcon}
                            MenuProps={{
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "right",
                                },
                                transformOrigin: {
                                    vertical: "top",
                                    horizontal: "right",
                                },
                                getContentAnchorEl: null,
                            }}
                            inputProps={{
                                classes: {
                                    icon: classes.icon,
                                },
                            }}
                            value={currentChain}
                            classes={{ root: classes.input }}
                            className={classes.chainChangeInput}
                            onChange={(e) => updateChain(e)}
                        >
                            {Object.keys(availableChainOptions).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {availableChainOptions[key]}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    {isAuthenticated ? (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.actionButton}
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
                            disabled={isAuthenticating}
                            className={classes.actionButton}
                            onClick={() => authenticate()}
                        >
                            Prisijungti su pinigine
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            {/* Authentication errors occur when user does not provide sinature to the request  */}
            {authError && (
                <Collapse in={openAuthError}>
                    <Alert
                        severity="error"
                        className={classes.alert}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpenAuthError(false);
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

            {web3EnableError && (
                <Collapse in={openWeb3Error}>
                    <Alert
                        severity="error"
                        className={classes.alert}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpenWeb3Error(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        <AlertTitle>Klaida bandant įgalinti WEB3</AlertTitle>
                        {web3EnableError.message}
                    </Alert>
                </Collapse>
            )}
        </>
    );
};

export default TopNav;
