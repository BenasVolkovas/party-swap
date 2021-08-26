import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        width: "100%",
        height: "80vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
    },
    topContainer: {
        position: "sticky",
        top: 0,
        left: 0,
        flex: "0, 0, auto",
    },
    titleAndClose: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        padding: theme.spacing(2),
    },
    closeButton: {
        margin: theme.spacing(0, 1),
    },
    closeIcon: {
        fontSize: theme.spacing(3),
    },
    search: {
        padding: theme.spacing(1, 1.5),
    },
    tokensListContainer: {
        flex: "1, 1, auto",
        width: "100%",
        height: "100%",
        overflowY: "auto",
    },
}));

const TokenSelect = ({ open, tokens, handleTokenSelectClose }) => {
    const [searchTokens, setSearchTokens] = useState(tokens);
    const [search, setSearch] = useState("");
    const classes = useStyles();

    useEffect(() => {
        // temp
        setSearchTokens(tokens.slice(0, 10));
        console.log(tokens);

        // testing
        tokens = tokens.filter((token) => token.symbol.length === 5);
        console.log(tokens);
    }, [search]);

    const updateSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <Modal
            open={open}
            onClose={() => handleTokenSelectClose()}
            className={classes.root}
        >
            <Container maxWidth="sm">
                <Paper className={classes.paper}>
                    <div className={classes.topContainer}>
                        <div className={classes.titleAndClose}>
                            <Typography variant="h5" className={classes.title}>
                                Pasirinkite kriptovaliutą
                            </Typography>
                            <IconButton
                                color="primary"
                                onClick={() => handleTokenSelectClose()}
                                className={classes.closeButton}
                            >
                                <CloseIcon className={classes.closeIcon} />
                            </IconButton>
                        </div>
                        <Divider />
                        <div className={classes.search}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Paieška…"
                                margin="dense"
                                value={search}
                                onChange={(e) => updateSearch(e)}
                                className={classes.margin}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                    <div className={classes.tokensListContainer}>
                        <List>
                            {searchTokens.map((token) => {
                                return (
                                    <ListItem key={token.address} button>
                                        <ListItemAvatar>
                                            <Avatar variant="circular">
                                                <img
                                                    src={token.logoURI}
                                                    alt={token.name}
                                                />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={token.name}
                                            secondary={token.symbol}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                </Paper>
            </Container>
        </Modal>
    );
};

export default TokenSelect;
