import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";

const theme = createTheme({
    spacing: (factor) => `${1 * factor}rem`,
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div>PartySwap</div>
        </ThemeProvider>
    );
}

export default App;
