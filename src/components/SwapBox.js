import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    rootBox: {
        marginTop: theme.spacing(5),
    },
}));
const SwapBox = () => {
    const classes = useStyles();

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} className={classes.rootBox}>
                <Typography>Keitykla</Typography>
            </Paper>
        </Container>
    );
};

export default SwapBox;
