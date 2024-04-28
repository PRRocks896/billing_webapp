import React from "react";
import { Controller } from "react-hook-form";
import moment from "moment";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {
    useAddEditSalary
} from "./hooks/useAddEditSalary.hook";

const AddEditSalary = ({ tag }) => {
    const {
        control,
        staffList,
        totalLeave,
        totalLeaveAmount,
        totalpayableAmount,
        setValue,
        onSubmit,
        getValues,
        handleSubmit, 
        cancelHandler
    } = useAddEditSalary(tag);
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container spacing={2}> 
                            <Grid item xs={12} sm={3}>
                                <Controller
                                    name="month"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl fullWidth size="small">
                                            <InputLabel id="month">Select Month</InputLabel>
                                            <Select 
                                                disabled
                                                size="small"
                                                label="Select Month"
                                                labelId="month"
                                                value={value || ''}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                            >
                                                <MenuItem value={1}>Jan</MenuItem>
                                                <MenuItem value={2}>Feb</MenuItem>
                                                <MenuItem value={3}>March</MenuItem>
                                                <MenuItem value={4}>Apr</MenuItem>
                                                <MenuItem value={5}>May</MenuItem>
                                                <MenuItem value={6}>June</MenuItem>
                                                <MenuItem value={7}>July</MenuItem>
                                                <MenuItem value={8}>Aug</MenuItem>
                                                <MenuItem value={9}>Sept</MenuItem>
                                                <MenuItem value={10}>Oct</MenuItem>
                                                <MenuItem value={11}>Nov</MenuItem>
                                                <MenuItem value={12}>Dec</MenuItem>
                                            </Select>
                                            {error && error.message &&
                                                <FormHelperText error={true}>{error.message}</FormHelperText>
                                            }
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: 'Please Select Month'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Controller
                                    name="year"
                                    control={control}
                                    render={({
                                        field: { value }
                                    }) => (
                                        <FormControl
                                            size="small"
                                            fullWidth
                                        >
                                            <TextField
                                                disabled
                                                variant="outlined"
                                                label="Year"
                                                size="small"
                                                name="year"
                                                value={value}
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                    <TextField
                                        variant="outlined"
                                        label="Total Days"
                                        size="small"
                                        value={moment(new Date()).subtract(1, 'M').daysInMonth()}
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}> 
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="staffStatus"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <>
                                            <FormControl>
                                                <Typography variant="subtitle1" fontWeight={500} fontSize={16}>Staff Status:</Typography>
                                                <RadioGroup
                                                    sx={{ display: 'block'}}
                                                    name="radio-buttons-group"
                                                    value={value}
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                    error={!!error}
                                                >
                                                    <FormControlLabel
                                                        value="Working"
                                                        control={<Radio/>}
                                                        label="Working"
                                                    />
                                                    <FormControlLabel
                                                        value="Long Holiday"
                                                        control={<Radio/>}
                                                        label="Long Holiday"
                                                    />
                                                    <FormControlLabel
                                                        value="Left"
                                                        control={<Radio/>}
                                                        label="Left"
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                            { error && error.message &&
                                                <FormHelperText error={true} >{error.message}</FormHelperText>
                                            }
                                        </>
                                    )}
                                    rules={{
                                        required: "Staff Status required",
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}> 
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="staffID"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <Autocomplete
                                            size="small"
                                            disablePortal
                                            id="staffID"
                                            options={staffList || []}
                                            getOptionLabel={(option) => `${option.nickName} (${option?.px_employee_type?.name}) (${option?.salary}/-)` || ""}
                                            isOptionEqualToValue={(option, value) => option?.id === value}
                                            value={staffList.find((item) => item.id === value) || null}
                                            onBlur={onBlur}
                                            onChange={(_event, newValue) => {
                                                setValue('ifscCode', newValue?.ifscCode);
                                                setValue('accountNumber', newValue?.accountNumber);
                                                setValue('reEnterAccountNumber', newValue?.accountNumber);
                                                setValue('accountHolderName', newValue?.accountHolderName);
                                                onChange(newValue?.id)
                                            }}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                  {option.nickName} ({option?.px_employee_type?.name}) ({option?.salary}/-)
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
                                        required: "Please Select Staff Person",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Controller
                                    name="workingDays"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                variant="outlined"
                                                label="Working Days"
                                                size="small"
                                                name="workingDays"
                                                type="number"
                                                value={value}
                                                onChange={(e) => {
                                                    if(e.target.value.length < 3 && e.target.value < (moment(new Date()).subtract(1, 'M').daysInMonth())) {
                                                        onChange(e);
                                                    }
                                                }}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message || ''}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: 'Enter Working Days'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Controller
                                    name="weekOff"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                variant="outlined"
                                                label="Week Off"
                                                size="small"
                                                name="weekOff"
                                                type="number"
                                                value={value}
                                                onChange={(e) => {
                                                    if(e.target.value < 5) {
                                                        onChange(e);
                                                    }
                                                }}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message || ''}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: 'Enter Week Off'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <FormControl fullWidth size="small">
                                    <TextField
                                        variant="outlined"
                                        label="Total Leave"
                                        size="small"
                                        value={totalLeave}
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container spacing={2}> 
                            <Grid item xs={12} sm={3}>
                                <Controller
                                    name="advance"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                variant="outlined"
                                                label="Advance"
                                                size="small"
                                                name="advance"
                                                type="number"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message || ''}
                                            />
                                        </FormControl>
                                    )}
                                    // rules={{
                                    //     required: 'Enter Advance'
                                    // }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Controller
                                    name="expenseCut"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                variant="outlined"
                                                label="Expense Cut"
                                                size="small"
                                                name="expenseCut"
                                                type="number"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message || ''}
                                            />
                                        </FormControl>
                                    )}
                                    // rules={{
                                    //     required: 'Enter Expense Cut'
                                    // }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                    <TextField
                                        variant="outlined"
                                        label="Leave Cut"
                                        size="small"
                                        value={totalLeaveAmount}
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                    <TextField
                                        variant="outlined"
                                        label="Total Payable"
                                        size="small"
                                        value={totalpayableAmount}
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container spacing={2}> 
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="accountNumber"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                        <TextField
                                            type="password"
                                            label="Account Number"
                                            size="small"
                                            name="accountNumber"
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                        </FormControl>
                                    )}
                                    // rules={{
                                    //     required: "Account Number field required",
                                    // }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="ifscCode"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                        <TextField
                                            label="IFSC Code"
                                            size="small"
                                            name="ifscCode"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                                            onBlur={onBlur}
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                        </FormControl>
                                    )}
                                    // rules={{
                                    //     required: "IFSC Code field required",
                                    //     pattern: {
                                    //     value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                    //     message: 'Please Enter Valid IFSC Code'
                                    //     }
                                    // }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="reEnterAccountNumber"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                type="number"
                                                label="Re Enter Account Number"
                                                size="small"
                                                name="name"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        // required: "Re Enter Account Number field required",
                                        validate: (value) => {
                                            if(value !== getValues('accountNumber')) {
                                                return "Please Enter Correct Account Number"
                                            }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="accountHolderName"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                        <TextField
                                            label="Account Holder Name"
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
                                    // rules={{
                                    //     required: "Account Holder Name field required",
                                    // }}
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>
                </Box>
                <Grid container spacing={2} sx={{ marginTop: "6px" }}>
                    <Grid item md={1.5}>
                        <Button type="sumit" className="btn btn-tertiary">
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
    )
}

export default AddEditSalary;