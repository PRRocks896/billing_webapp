import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import useAddEditCompany from "./hook/useAddEditCompany";

const AddEditCompany = ({ tag }) => {
    const { control, handleSubmit, onSubmit, cancelHandler } = useAddEditCompany(tag);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="companyName"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl
                                            size="small"
                                            variant="standard"
                                            className="form-control"
                                        >
                                            <TextField
                                                label="Company Name"
                                                size="small"
                                                name="name"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Company Name field required",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="displayName"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl
                                            size="small"
                                            variant="standard"
                                            className="form-control"
                                        >
                                            <TextField
                                                label="Display Name"
                                                size="small"
                                                name="name"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Display Name field required",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="billCode"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl
                                            size="small"
                                            variant="standard"
                                            className="form-control"
                                        >
                                            <TextField
                                                label="Bill Code"
                                                size="small"
                                                name="name"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Bill Code field required",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="cashBillCode"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl
                                            size="small"
                                            variant="standard"
                                            className="form-control"
                                        >
                                            <TextField
                                                label="Cash Bill Code"
                                                size="small"
                                                name="name"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Cash Bill Code field required",
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>
                </Box>
                <Grid container spacing={3} sx={{ marginTop: "6px" }}>
                    <Grid item md={1.5}>
                        <Button type="submit" className="btn btn-tertiary">
                            {tag === "add" ? "Save" : "Update"}
                        </Button>
                    </Grid>
                    <Grid item md={1.5}>
                        <Button className="btn btn-cancel" onClick={cancelHandler}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    );
};

export default AddEditCompany;