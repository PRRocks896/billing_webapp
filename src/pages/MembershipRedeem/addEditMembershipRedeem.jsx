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
import Typography from "@mui/material/Typography";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import React from "react";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

import VerifyOtp from "../../components/VerifyOTPModel";

import { useAddEditMembershipRedeem } from "./hook/useAddEditMembershipRedeem.hook";

const AddEditMembershipRedeem = ({ tag }) => {
    const navigate = useNavigate();
    const {
        room,
        staff,
        control,
        verifiedOtp,
        loggedInUser,
        isSubmitting,
        filterService,
        filterMembershipList,
        isSelectedMembership,
        membershipRedeemList,
        openVerifyMembershipModal,
        onSubmit,
        setValue,
        getValues,
        handleSubmit,
        cancelHandler,
        searchCustomer,
        handleVerifyMembership,
        fetchMembershipRedeemHistory,
        setOpenVerifyMembershipModal,
        handleSendOtpFormMembershipRedeem,
    } = useAddEditMembershipRedeem(tag);
    
    return (
        <>
            <form onSubmit={handleSubmit(verifiedOtp ? onSubmit : handleSendOtpFormMembershipRedeem)}>
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container spacing={2}>
                            {/* <Grid item xs={12} md={2} sm={6}>
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
                            </Grid> */}
                            <Grid item xs={12} md={2} sm={6}>
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
                            <Grid item xs={12} md={2} sm={6}>
                                <Button className="btn btn-tertiary" variant="contained" type="button" onClick={searchCustomer}>
                                    <Typography variant="subtitle2">
                                        Find Membership
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </FormGroup>
                    <br/>
                    {filterMembershipList && filterMembershipList.length > 0 &&
                        <FormGroup className="form-field">
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Branch Name</TableCell>
                                            <TableCell>Customer</TableCell>
                                            <TableCell>Bill No</TableCell>
                                            <TableCell>Plan Name</TableCell>
                                            <TableCell>Extra Hours</TableCell>
                                            <TableCell>Remaining Minutes</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(typeof getValues('membershipID') === 'object') ? 
                                            <>
                                            {/* item.id === getValues('membershipID')?.id === item.id */}
                                                {filterMembershipList?.map((item, index) => {
                                                    if(item.id === getValues('membershipID')?.id) {
                                                        return (
                                                            <TableRow key={`membership_${index}`}>
                                                                <TableCell>{moment(item?.createdAt).format('DD/MM/yyyy hh:mm A')}</TableCell>
                                                                <TableCell>{item?.px_user?.branchName}</TableCell>
                                                                <TableCell>{item?.px_customer?.name}</TableCell>
                                                                <TableCell>{item?.billNo}</TableCell>
                                                                <TableCell>{item?.px_membership_plan?.planName} ({item?.px_membership_plan?.hours})</TableCell>
                                                                <TableCell>{item?.extraHours}</TableCell>
                                                                <TableCell>{item?.minutes}</TableCell>
                                                                <TableCell>
                                                                    {/* {item.minutes === 0 ? */}
                                                                    {(item.userID === loggedInUser.id) ?
                                                                        <Button className="btn btn-primary" onClick={() => navigate(`/renew-plan/${item.id}/${item.customerID}`)}>
                                                                            Renew Plan
                                                                        </Button>
                                                                    : null}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </>
                                        :
                                            <>
                                                {filterMembershipList?.map((item, index) => (
                                                    <TableRow key={`membership_${index}`}>
                                                        <TableCell>{moment(item?.createdAt).format('DD/MM/yyyy hh:mm A')}</TableCell>
                                                        <TableCell>{item?.px_user?.branchName}</TableCell>
                                                        <TableCell>{item?.px_customer?.name}</TableCell>
                                                        <TableCell>{item?.billNo}</TableCell>
                                                        <TableCell>{item?.px_membership_plan?.planName} ({item?.px_membership_plan?.hours})</TableCell>
                                                        <TableCell>{item?.extraHours}</TableCell>
                                                        <TableCell>{item?.minutes}</TableCell>
                                                        <TableCell>
                                                            
                                                            <Button className="btn btn-tertiary" sx={{ marginRight: 4 }} variant="contained" type="button" onClick={() => [setValue('membershipID', item), fetchMembershipRedeemHistory()]}>Redeem</Button> 
                                                            {/* {item.minutes === 0 &&
                                                                <Button sx={{ marginTop: 2}} className="btn btn-primary" onClick={() => navigate(`/renew-plan/${item.id}/${item.customerID}`)}>
                                                                    Renew Plan
                                                                </Button>
                                                            } */}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </FormGroup>
                    }
                </Box>
                <br/>
                {membershipRedeemList && membershipRedeemList.length > 0 &&
                    <>
                        <Box className="card">
                            <FormGroup className="form-field">
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                                        Redeem History
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Branch Name</TableCell>
                                                        <TableCell>Bill No</TableCell>
                                                        <TableCell>Service Name</TableCell>
                                                        <TableCell>Total Minutes</TableCell>
                                                        <TableCell>Therapist Name</TableCell>
                                                        <TableCell>Manager Name</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {membershipRedeemList?.map((item, index) => (
                                                        <TableRow key={`redeem_history_${index}`}>
                                                            <TableCell>{moment(item?.createdAt).format('DD/MM/yyyy hh:mm A')}</TableCell>
                                                            <TableCell>{item?.px_user?.branchName}</TableCell>
                                                            <TableCell>{item?.billNo}</TableCell>
                                                            <TableCell>{item?.px_service?.name}</TableCell>
                                                            <TableCell>{item?.minutes}</TableCell>
                                                            <TableCell>{item?.px_staff?.nickName}</TableCell>
                                                            <TableCell>{item?.managerName}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>
                            </FormGroup>
                        </Box>
                        <br/>
                    </>
                }
                {isSelectedMembership &&
                <>
                    <Box className="card">
                        <FormGroup className="form-field">
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
                                                <InputLabel id="minutes">Minutes*</InputLabel>
                                                <Select 
                                                    labelId="minutes"
                                                    label="Minutes*"
                                                    value={value || ""} 
                                                    onChange={(e) => {
                                                        onChange(e.target.value);
                                                        setValue('serviceID', "");
                                                    }} 
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
                                            required: 'Minutes Required'
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <br/>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Controller
                                        name="serviceID"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error },
                                        }) => (
                                            <Autocomplete
                                                size="small"
                                                freeSolo
                                                id="serviceID"
                                                isOptionEqualToValue={(option, value) =>
                                                    option?.id === value?.id
                                                }
                                                getOptionLabel={(option) => option?.name ?? ''}
                                                options={filterService || []}
                                                value={filterService?.find((option) => option.id === value) ?? ''}
                                                onBlur={onBlur}
                                                onChange={(_event, newValue) => onChange(newValue?.id)}
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
                                                        label="Service*"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
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
                                        name="roomID"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error },
                                        }) => (
                                            <Autocomplete
                                                size="small"
                                                freeSolo
                                                id="roomID"
                                                isOptionEqualToValue={(option, value) =>
                                                    option?.id === value?.id
                                                }
                                                getOptionLabel={(option) => option?.name ?? ''}
                                                options={room || []}
                                                value={room?.find((option) => option.id === value) ?? ''}
                                                onBlur={onBlur}
                                                onChange={(_event, newValue) => onChange(newValue?.id)}
                                                renderOption={(props, option) => {
                                                    return (
                                                        <li {...props} key={option.id}>
                                                            {option.roomName}
                                                        </li>
                                                    );
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Room*"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                            // <FormControl
                                            //     size="small"
                                            //     variant="standard"
                                            //     className="form-control"
                                            // >
                                            //     <TextField
                                            //         label="Room No*"
                                            //         size="small"
                                            //         name="roomNo"
                                            //         value={value}
                                            //         onChange={(e) => onChange(e.target.value.toUpperCase())}
                                            //         onBlur={onBlur}
                                            //         error={!!error}
                                            //         helperText={error?.message}
                                            //     />
                                            // </FormControl>
                                        )}
                                        rules={{
                                            required: "Please enter Room No",
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <br/>
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
                                                getOptionLabel={(option) => option?.nickName ?? ''}
                                                options={staff || []}
                                                value={staff?.find((option) => option.id === value) ?? ''}
                                                onBlur={onBlur}
                                                onChange={(event, newValue) => onChange(newValue?.id)}
                                                renderOption={(props, option) => {
                                                    return (
                                                        <li {...props} key={option.id}>
                                                            {option.nickName}
                                                        </li>
                                                    );
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Staff Person*"
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
                                                    label="Manager name*"
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
                </>
                }
            </form>
            <VerifyOtp
                title="Verify Customer Redeem OTP"
                isOpen={openVerifyMembershipModal}
                setOpen={setOpenVerifyMembershipModal}
                handleEnterOtp={handleVerifyMembership}
                resendOtp={() => {}}
            />
        </>
    )
};

export default AddEditMembershipRedeem;