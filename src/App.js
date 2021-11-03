import { useChainNetwork } from "./hooks/useChainNetwork";
import { useCustomMessage } from "./hooks/useCustomMessage";
import { ChainContext, MessageContext } from "./helpers/Contexts";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import SwapView from "./views/SwapView";

const theme = createTheme({
    typography: {
        fontSize: 14,
        htmlFontSize: 10,
        fontFamily: ["Nunito", "sans-serif"].join(","),
        h1: {
            fontSize: "4rem",
            fontWeight: 400,
        },
        h2: {
            fontSize: "3.2rem",
            fontWeight: 400,
        },
        h3: {
            fontSize: "2.6rem",
            fontWeight: 400,
        },
        h4: {
            fontSize: "2.2rem",
            fontWeight: 400,
        },
        h5: {
            fontSize: "2rem",
            fontWeight: 400,
        },
        h6: {
            fontSize: "1.8rem",
            fontWeight: 400,
        },
        body1: {
            fontSize: "1.6rem",
            fontWeight: 400,
        },
        body2: {
            fontSize: "1.4rem",
            fontWeight: 400,
        },
        button: {
            textTransform: "none",
        },
    },
    palette: {
        primary: {
            light: "#fa98c2",
            main: "#f765a3",
            dark: "#dc5a91",
            contrastText: "#ffffff",
        },
        background: {
            default: "#fafafa",
        },
    },
    shape: {
        borderRadius: 20,
    },
    spacing: (factor) => `${1 * factor}rem`,

    blackColor: {
        color: "#323232",
    },
    darkGrayColor: {
        color: "#757575",
    },
    grayColor: {
        color: "#dcdcdc",
    },
    lightGrayColor: {
        color: "#fafafa",
    },
    themeColor: {
        color: "#f765a3",
    },
    whiteColor: {
        color: "#ffffff",
    },
});

function App() {
    const chain = useChainNetwork();
    const message = useCustomMessage();
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <ChainContext.Provider value={chain}>
                <MessageContext.Provider value={message}>
                    <SwapView />
                </MessageContext.Provider>
            </ChainContext.Provider>
        </ThemeProvider>
    );
}

export default App;
