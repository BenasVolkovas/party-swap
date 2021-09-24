export const convertChainToSymbol = (chain) => {
    let symbol;
    let change;
    let available;

    if (chain === "mainnet" || chain === "0x1") {
        symbol = "eth";
        change = true;
        available = true;
    } else if (
        chain === "binance" ||
        chain === "binance smart chain" ||
        chain === "0x38"
    ) {
        symbol = "bsc";
        change = true;
        available = true;
    } else if (chain === "matic" || chain === "0x89") {
        symbol = "polygon";
        change = true;
        available = true;
    } else if (chain === "eth" || chain === "bsc" || chain === "polygon") {
        symbol = chain;
        change = false;
        available = true;
    } else {
        symbol = null;
        change = null;
        available = false;
    }

    return { symbol, change, available };
};

export const convertChainToUrl = (chain) => {
    let urlParam;

    if (chain === "eth") {
        urlParam = "1";
    } else if (chain === "bsc") {
        urlParam = "56";
    } else if (chain === "polygon") {
        urlParam = "137";
    } else {
        urlParam = "";
    }

    return urlParam;
};