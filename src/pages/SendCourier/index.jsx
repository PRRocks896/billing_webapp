import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import UseSendCourier from "./hooks/useSendCourier.hook";

const SendCourier = () => {
    const {
        barcode,
        isAdmin,
        branchList,
        selectedBranch,
        onSubmit,
        setBarcode,
        setSelectedBranch,
    } = UseSendCourier();
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
                        {isAdmin && (
                            <Grid item xs={12} sm={4}>
                                <FormControl size="small" fullWidth>
                                    <Autocomplete
                                        options={branchList}
                                        getOptionLabel={(option) => option.branchName || ""}
                                        value={selectedBranch}
                                        onChange={(event, newValue) => {
                                            setSelectedBranch(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Branch" variant="outlined" required />
                                        )}
                                    />
                                    {/* <FormHelpText>Select the branch to send the courier</FormHelpText> */}
                                </FormControl>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
                <CardActions>
                    {/* <Button className="btn btn-tertiary" variant="contained" type="button" onClick={cancelHandler}>Back</Button> */}
                    <Button className="btn btn-tertiary" variant="contained" type="submit">Save</Button>
                </CardActions>
            </Card>
        </form>
    )
}

export default SendCourier;