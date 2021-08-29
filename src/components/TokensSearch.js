import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
    searchButton: {
        width: "auto",
        height: "100%",
    },
}));

const TokensSearch = ({ searchForTokens }) => {
    const [search, setSearch] = useState("");
    const classes = useStyles();

    const updateSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Ieškokite pagal pavadinimą ar adresą"
            margin="dense"
            value={search}
            onChange={(e) => updateSearch(e)}
            InputProps={{
                endAdornment: (
                    <InputAdornment
                        position="end"
                        className={classes.searchButton}
                        onClick={() => searchForTokens(search)}
                    >
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default TokensSearch;
