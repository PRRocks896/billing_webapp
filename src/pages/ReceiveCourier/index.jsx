import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import UseReceiveCourierHook from "./hook/useReceiveCourier.hook.jsx";

const ReceiveCourier = () => {
    const {
        barcode,
        setBarcode,
        onSubmit,
    } = UseReceiveCourierHook();
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
        }}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    fullWidth
                                    label="Barcode"
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value.trim())}
                                    variant="outlined"
                                    required
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    {/* <Button className="btn btn-tertiary" variant="contained" type="button" onClick={cancelHandler}>Back</Button> */}
                    <Button className="btn btn-tertiary" variant="contained" type="submit">Save</Button>
                </CardActions>
            </Card>
        </form>
    );
}

export default ReceiveCourier;