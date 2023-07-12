import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    Checkbox,
    TableContainer,
    FormControl,
    FormGroup,
    Grid,
    TextField,
    Autocomplete,
} from "@mui/material";

const Rights = () => {
    return (
        <>
            <Box className="card">
                <FormGroup className="form-field">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl size="small" fullWidth>
                                <Autocomplete
                                    freeSolo
                                    size="small"
                                    options={[{id: 1, name: 'admin'}, {id: 2, name: 'Manager'}]}
                                    id="role"
                                    // isOptionEqualToValue={(option, value) =>
                                    //     option === value
                                    // }
                                    // value={value}
                                    // onChange={(event, newValue) => onChange(newValue)}
                                    // onBlur={onBlur}
                                    label="role"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Role"
                                            // error={!!error}
                                            // helperText={error?.message ? error.message : ""}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </FormGroup>
            </Box>
            <br/>
            <Box className="card">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Module Name</th>
                                        <th>View</th>
                                        <th>Add</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ textAlign: 'center'}}>
                                        <td>Role</td>
                                        <td>
                                            <Checkbox/>
                                        </td>
                                        <td>
                                            <Checkbox/>
                                        </td>
                                        <td>
                                            <Checkbox/>
                                        </td>
                                        <td>
                                            <Checkbox/>
                                        </td>

                                    </tr>
                                </tbody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Box>
            <br/>
            <Box className="card">
                <Button variant="contained">Save</Button>
            </Box>
        </>
    )
}

export default Rights;