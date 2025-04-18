import React from "react";
import { Controller } from "react-hook-form";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import FormHelpText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import useAddEditAdvance from "./hook/useAddEditAdvance";

const AddEditAdvance = ({ tag }) => {
    const {
        control,
        staffOption,
        isSubmitting,
        paymentOption,
        managerOption,
        onSubmit,
        handleSubmit,
        cancelHandler
    } = useAddEditAdvance(tag);
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                type="date"
                                                variant="outlined"
                                                label="Date"
                                                size="small"
                                                name="date"
                                                value={value || new Date()}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: 'Please Select Date'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="staffID"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <Autocomplete
                                            freeSolo
                                            size="small"
                                            id="staffID"
                                            options={staffOption || []}
                                            getOptionLabel={(option) => option.nickName || ''}
                                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                            value={staffOption?.find((option) => option.id === value) ?? ''}
                                            // onBlur={onBlur}
                                            onChange={(_event, value) => {
                                                if (value) {
                                                    onChange(value?.id)
                                                } else {
                                                    onChange(null);
                                                }
                                            }}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                    {option.nickName}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Staff"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    )}
                                    rules={{
                                        required: "Please Select Staff",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="paymentID"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl fullWidth size="small">
                                            <InputLabel id="paidBy">Paid By</InputLabel>
                                            <Select
                                                labelId="paidBy"
                                                id="paidBy-select"
                                                value={value}
                                                label="Paid By"
                                                onChange={onChange}
                                                onBlur={onBlur}
                                            >
                                                {paymentOption?.map((res, ind) => (
                                                    <MenuItem style={{ textTransform: "capitalize" }} key={`paidBy_${ind}`} value={res.id}>
                                                        {res.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {error && error.message &&
                                                <FormHelpText error={true}>{error.message}</FormHelpText>
                                            }
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: 'Please Select Paid By'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="amount"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth >
                                            <TextField
                                                type="number"
                                                label="Amount"
                                                size="small"
                                                name="amount"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Amount field required.",
                                        pattern: {
                                            value: /^\d*(\.\d{0,2})?$/i,
                                            message: "please enter digit only.",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="managerID"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <Autocomplete
                                            freeSolo
                                            size="small"
                                            id="managerID"
                                            options={managerOption || []}
                                            getOptionLabel={(option) => option.nickName || ''}
                                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                            value={managerOption?.find((option) => option.id === value) ?? ''}
                                            // onBlur={onBlur}
                                            onChange={(_event, value) => {
                                                if (value) {
                                                    onChange(value?.id)
                                                } else {
                                                    onChange(null);
                                                }
                                            }}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                    {option.nickName}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Manager"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    )}
                                    rules={{
                                        required: "Please Select Maanger",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="permissionName"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                label="Permission Name"
                                                variant="outlined"
                                                size="small"
                                                name="permissionName"
                                                value={value || ""}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Please Enter Permission Name",
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button className="btn btn-tertiary" variant="contained" type="button" onClick={cancelHandler}>Back</Button>
                        <Button disabled={isSubmitting} className="btn btn-tertiary" variant="contained" type="submit">
                            Save
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </>
    );
};

export default AddEditAdvance;
