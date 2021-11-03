import { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

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
import Pagination from "@material-ui/lab/Pagination";

import CloseIcon from "@material-ui/icons/Close";

import TokensSearch from "./TokensSearch";

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
    tokenLogo: {
        width: "100%",
        height: "100%",
    },
    backdrop: {
        zIndex: theme.zIndex.modal + 1,
        color: "#fff",
    },
    bottomPagination: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(1),
    },
}));

const TokenSelect = ({
    open,
    side,
    selected,
    tokens,
    handleTokenSelectClose,
    selectToken,
}) => {
    const [searchTokens, setSearchTokens] = useState(tokens);
    const [displayTokens, setDisplayTokens] = useState(searchTokens);
    const [totalPages, setTotalPages] = useState(1);
    const [listPage, setListPage] = useState(1);
    const listRef = useRef();
    const classes = useStyles();

    // Update searching tokens if tokens fron 1inch changes
    useEffect(() => {
        setSearchTokens(tokens);
    }, [tokens]);

    // When page changes, display other tokens by page number
    useEffect(() => {
        const tokensPerPage = 50;

        setDisplayTokens(
            searchTokens.slice(
                listPage * tokensPerPage - tokensPerPage,
                listPage * tokensPerPage
            )
        );

        if (listRef.current) {
            listRef.current.scrollTop = 0;
        }
    }, [listPage, searchTokens]);

    // When searched tokens changes, display other tokens, update total pages number and current page
    useEffect(() => {
        const tokensPerPage = 50;

        setTotalPages(Math.ceil(searchTokens.length / tokensPerPage));
        setListPage(1);
    }, [searchTokens]);

    // Search for tokens by given input
    const searchForTokens = (search) => {
        const lowerSearch = search.toLowerCase();
        setSearchTokens(
            tokens.filter((token) => {
                return token.symbol.toLowerCase().includes(lowerSearch) ||
                    token.name.toLowerCase().includes(lowerSearch) ||
                    token.address.toLowerCase().includes(lowerSearch)
                    ? token
                    : null;
            })
        );
    };

    // Change page
    const handleListPageChange = (e, value) => {
        setListPage(value);
    };

    // Select the token and close the window
    const updateSelectedTokenValue = (token) => {
        selectToken(side, token);
        closeWindow();
    };

    // Close the window
    const closeWindow = () => {
        handleTokenSelectClose();
        searchForTokens("");
    };

    return (
        <>
            <Modal
                open={open}
                onClose={() => closeWindow()}
                className={classes.root}
            >
                <Container maxWidth="sm">
                    <Paper className={classes.paper}>
                        <div className={classes.topContainer}>
                            <div className={classes.titleAndClose}>
                                <Typography
                                    variant="h5"
                                    className={classes.title}
                                >
                                    Pasirinkite kriptovaliutą
                                </Typography>
                                <IconButton
                                    color="primary"
                                    onClick={() => closeWindow()}
                                    className={classes.closeButton}
                                >
                                    <CloseIcon className={classes.closeIcon} />
                                </IconButton>
                            </div>
                            <Divider />
                            <div className={classes.search}>
                                <TokensSearch
                                    searchForTokens={(search) =>
                                        searchForTokens(search)
                                    }
                                />
                            </div>
                        </div>
                        <div
                            ref={listRef}
                            className={classes.tokensListContainer}
                        >
                            <List>
                                {displayTokens.map((token) => {
                                    return (
                                        <ListItem
                                            button
                                            key={token.address}
                                            selected={
                                                token === selected
                                                    ? true
                                                    : false
                                            }
                                            onClick={() =>
                                                updateSelectedTokenValue(token)
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    variant="circular"
                                                    src={token.logoURI}
                                                    alt={token.name}
                                                />
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
                        <div className={classes.bottomPagination}>
                            <Pagination
                                count={totalPages}
                                color="primary"
                                siblingCount={0}
                                page={listPage}
                                onChange={(e, value) =>
                                    handleListPageChange(e, value)
                                }
                            />
                        </div>
                    </Paper>
                </Container>
            </Modal>
        </>
    );
};

export default TokenSelect;
