import React from "react";
import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

import useAddEditCouponHook from "./hook/useAddEditCoupon.hook";

const AddEditCoupon = ({tag}) => {
    const {
        control,
        onSubmit,
        handleSubmit,
        cancelHandler,
    } = useAddEditCouponHook(tag);
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="name"
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
                                                label="Coupon Name"
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
                                        required: "Coupon name field required",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="code"
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
                                                label="Code"
                                                size="small"
                                                name="path"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.replace(/\s/g, '').toUpperCase())}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Code field required",
                                        // pattern: {
                                        //     value: /^\d*(\.\d{0,2})?$/i,
                                        //     message: "please enter digit only.",
                                        // },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="value"
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
                                                label="Value"
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
                                        required: "Values field required",
                                        pattern: {
                                            value: /^\d*(\.\d{0,2})?$/i,
                                            message: "please enter digit only.",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="maxPrice"
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
                                                label="Max Price"
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
                                        required: "Max Price field required",
                                        pattern: {
                                            value: /^\d*(\.\d{0,2})?$/i,
                                            message: "please enter digit only.",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <>
                                            <FormControl fullWidth>
                                                <Typography variant="subtitle1" fontWeight={500} fontSize={16}>Discount Type:</Typography>
                                                <RadioGroup
                                                    sx={{ display: 'block'}}
                                                    name="radio-buttons-group"
                                                    value={value}
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                    error={!!error}
                                                >
                                                    <FormControlLabel
                                                        value={"Flat"}
                                                        control={<Radio checked={value === "Flat"}/>}
                                                        label={"Flat"}
                                                    />
                                                    <FormControlLabel
                                                        value={"Percentage"}
                                                        control={<Radio checked={value === "Percentage"}/>}
                                                        label={"Percentage"}
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                            {error && error.message && (
                                                <FormHelperText error>{error.message}</FormHelperText>
                                            )}
                                        </>
                                    )}
                                    rules={{
                                        required: "Please Select Discount Type",
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
}

export default AddEditCoupon;