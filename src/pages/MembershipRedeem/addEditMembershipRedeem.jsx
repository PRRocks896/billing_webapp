import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
import React from "react";
import { Controller } from "react-hook-form";
import moment from 'moment';

import VerifyOtp from "../../components/VerifyOTPModel";

import { useAddEditMembershipRedeem } from "./hook/useAddEditMembershipRedeem.hook";

const StyledTableCell = styled(TableCell)({
    padding: 0,
    margin: 0,
});

const AddEditMembershipRedeem = ({ tag }) => {
    const {
        otp,
        staff,
        control,
        customer,
        isOtpSend,
        membership,
        verifiedOtp,
        isSubmitting,
        openVerifyMembershipModal,
        setOtp,
        onSubmit,
        handleSubmit,
        cancelHandler,
        searchCustomer,
        handleVerifyMembership,
        setOpenVerifyMembershipModal,
        handleSendOtpFormMembershipRedeem,
    } = useAddEditMembershipRedeem(tag);

    return (
        <>
            <form onSubmit={handleSubmit(verifiedOtp ? onSubmit : handleSendOtpFormMembershipRedeem)}>
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3} sm={6}>
                                <Controller
                                    name="billNo"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value }, fieldState: { error } }) => (
                                        <FormControl
                                            size="small"
                                            variant="standard"
                                            className="form-control"
                                        >
                                            <TextField
                                                disabled
                                                label="Bill No*"
                                                size="small"
                                                name="billNo"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} sm={6}>
                                <FormControl size="small" fullWidth>
                                    <TextField
                                        disabled
                                        label="Date"
                                        size="small"
                                        name="date"
                                        value={moment(new Date()).format('DD/MM/yyyy')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3} sm={6}>
                                <Controller
                                    control={control}
                                    name={`customerID`}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                label="Customer Phone Number*"
                                                size="small"
                                                name="customerID"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Please Select Customer Ph No.",
                                        maxLength: {
                                            value: 10,
                                            message: "Customer Phone number must be 10 digit",
                                        },
                                        minLength: {
                                            value: 10,
                                            message: "Customer Phone number must be 10 digit",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} sm={6}>
                                <Button className="btn btn-tertiary" variant="contained" type="button" onClick={searchCustomer}>Find Membership</Button>
                            </Grid>
                        </Grid>
                    </FormGroup>
                    <br/>
                    {membership &&
                        <FormGroup className="form-field">
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Branch Name</TableCell>
                                            <TableCell>Bill No</TableCell>
                                            <TableCell>Plan Name</TableCell>
                                            <TableCell>Extra Hours</TableCell>
                                            <TableCell>Total Minutes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{moment(membership?.createdAt).format('DD/MM/yyyy hh:mm A')}</TableCell>
                                            <TableCell>{membership?.px_user?.branchName}</TableCell>
                                            <TableCell>{membership?.billNo}</TableCell>
                                            <TableCell>{membership?.px_membership_plan?.planName}</TableCell>
                                            <TableCell>{membership?.extraHours}</TableCell>
                                            <TableCell>{membership?.minutes}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </FormGroup>
                    }
                </Box>
                <br/>
                {/* {membership &&
                    <Box className="card">
                        <FormGroup className="form-field">
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Branch Name</TableCell>
                                            <TableCell>Bill No</TableCell>
                                            <TableCell>Plan Name</TableCell>
                                            <TableCell>Extra Hours</TableCell>
                                            <TableCell>Total Minutes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{moment(membership?.createdAt).format('DD/MM/yyyy hh:mm A')}</TableCell>
                                            <TableCell>{membership?.px_user?.branchName}</TableCell>
                                            <TableCell>{membership?.billNo}</TableCell>
                                            <TableCell>{membership?.px_membership_plan?.planName}</TableCell>
                                            <TableCell>{membership?.extraHours}</TableCell>
                                            <TableCell>{membership?.minutes}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </FormGroup>
                    </Box>
                } */}
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="serviceName"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                label="Service name"
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
                                        required: 'Service Name Required'
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="minutes"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="minutes">Minutes</InputLabel>
                                            <Select 
                                                labelId="minutes"
                                                label="Minutes"
                                                value={value || ""} 
                                                onChange={onChange} 
                                                onBlur={onBlur}
                                            >
                                                <MenuItem value={'60'}>60 Minutes</MenuItem>
                                                <MenuItem value={'120'}>120 Minutes</MenuItem>
                                            </Select>
                                            {error && error.message &&
                                                <FormHelperText error={true}>{error.message}</FormHelperText>
                                            }
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: 'Service Name Required'
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="roomNo"
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
                                                label="Room No*"
                                                size="small"
                                                name="roomNo"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Please enter Room No",
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    control={control}
                                    name={`staffID`}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <Autocomplete
                                            size="small"
                                            freeSolo
                                            id="staffID"
                                            isOptionEqualToValue={(option, value) =>
                                                option?.id === value?.id
                                            }
                                            getOptionLabel={(option) => option?.name ?? ''}
                                            options={staff || []}
                                            value={staff?.find((option) => option.id === value) ?? ''}
                                            onBlur={onBlur}
                                            onChange={(event, newValue) => onChange(newValue)}
                                            renderOption={(props, option) => {
                                                return (
                                                    <li {...props} key={option.id}>
                                                        {option.name}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Staff Person"
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
                        </Grid>
                        <br/>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="managerName"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                label="Manager name"
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
                                        required: 'Manager Name Required'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>
                </Box>
                <Box className="card">
                    <Button className="btn btn-tertiary" sx={{ marginRight: 4}} variant="contained" type="button" onClick={cancelHandler}>Back</Button>
                    <Button disabled={isSubmitting} className="btn btn-tertiary" variant="contained" type="submit">
                        {verifiedOtp ? 'Redeem' : 'Verify'}
                    </Button>
                </Box>
            </form>
            <VerifyOtp
                isOpen={openVerifyMembershipModal}
                setOpen={setOpenVerifyMembershipModal}
                handleEnterOtp={handleVerifyMembership}
            />
        </>
    )
};

export default AddEditMembershipRedeem;