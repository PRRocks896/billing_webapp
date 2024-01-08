import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

import { useAddEditMembershipPlan } from "./hook/useAddEditMembershipPlan.hooks";

const AddEditMembershipPlan = ({ tag }) => {
    const { control, onSubmit, handleSubmit, cancelHandler } =
        useAddEditMembershipPlan(tag);
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="planName"
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
                                                label="Plan name"
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
                                        required: "Plan name field required",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}/>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="price"
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
                                                label="Price"
                                                size="small"
                                                name="path"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Price field required",
                                        pattern: {
                                            value: /^\d*(\.\d{0,2})?$/i,
                                            message: "please enter digit only.",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}/>
                        {/* </Grid> */}
                        {/* <Grid container spacing={2}> */}
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="hours"
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
                                                label="Hours"
                                                size="small"
                                                name="icon"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Hours field required",
                                        pattern: {
                                            value: /^\d*(\.\d{0,2})?$/i,
                                            message: "please enter digit only.",
                                        },
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

export default AddEditMembershipPlan;
