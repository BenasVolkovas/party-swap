import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import Paper from "@material-ui/core/Paper";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles((theme) => ({}));

const TokenSelect = ({ open, tokens, handleTokenSelectClose }) => {
    const classes = useStyles();

    console.log(tokens);

    return (
        <Dialog open={open} onClose={() => handleTokenSelectClose()}>
            <DialogTitle>Pasirinkite kriptovaliutą</DialogTitle>
        </Dialog>
    );
};

export default TokenSelect;
