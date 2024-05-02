import React from "react";
import { Controller } from "react-hook-form";

import { FiPlusCircle, FiMinusCircle} from "react-icons/fi";

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

// import Typography from "@mui/material/Typography";

import { useAddEditMembership } from "./hook/useAddEditMembership.hook";
import AddCustomer from "../Bill/AddCustomer";
import VerifyOtp from "../../components/VerifyOTPModel";
import VerifyOtpMerchant from "../../components/VerifyOTPMerchantModel";

const AddEditMembership = ({tag}) => {
    const {

        // otp,
        
        control,
        customer,
        isOtpSend,
        paymentType,
        currentDate,
        verifiedOtp,
        disabledButton,
        isCardSelected,
        membershipPlan,
        isCustomerModalOpen,
        verifyCustomerMembership,
        openVerifyMembershipModal,
        openVerifyMembershipByMerchantModal,
        setOtp,
        getOtp,
        onSubmit,
        verifyOtp,
        setIsOtpSend,
        cancelHandler,
        handleSubmit,
        setVerifiedOtp,
        searchCustomer,
        handleVerifyMembership,
        setIsCustomerModalOpen,
        setCustomerSelectedHandler,
        handleSendOtpForMembership,
        handleCancelVerifyPermission,
        setOpenVerifyMembershipModal,

        // setOpenVerifyMembershipByMerchantModal
        
    } = useAddEditMembership(tag);
    return (
        <>
            <form onSubmit={handleSubmit(!isOtpSend ? getOtp : verifyCustomerMembership ? onSubmit : handleSendOtpForMembership)}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            control={control}
                                            name='billNo'
                                            render={({ field: { value}}) => (
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                >
                                                    <TextField
                                                        disabled
                                                        variant="outlined"
                                                        label="Bill No"
                                                        size="small"
                                                        name="billNo"
                                                        value={value}
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl
                                            size="small"
                                            fullWidth
                                        >
                                            <TextField
                                                disabled
                                                variant="outlined"
                                                label="Date"
                                                size="small"
                                                name="date"
                                                value={currentDate}
                                                />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="customerID"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <Box sx={{ display: "grid", gridTemplateColumns: "4fr 0.5fr" }}>
                                                    <Autocomplete
                                                        freeSolo
                                                        size="small"
                                                        id="customerID"
                                                        disabled={disabledButton}
                                                        options={customer || []}
                                                        getOptionLabel={(option) => option.name ? `${option.name}-(${option.phoneNumber})` : ''}
                                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                        value={customer?.find((option) => option.id === value) ?? ''}
                                                        // onBlur={onBlur}
                                                        onChange={(_event, value) => {
                                                            if(value) {
                                                                onChange(value?.id)
                                                            } else {
                                                                onChange(null);
                                                            }
                                                        }}
                                                        onInputChange={(_event, value) => searchCustomer(value)}
                                                        renderOption={(props, option) => (
                                                            <li {...props} key={option.value}>
                                                              {option.name}-{`(${option?.phoneNumber})`}
                                                            </li>
                                                        )}
                                                        renderInput={(params) => (
                                                            <TextField
                                                              {...params}
                                                              label="Customer Ph No."
                                                              error={!!error}
                                                              helperText={error?.message}
                                                            />
                                                        )}
                                                    />
                                                    <Button
                                                        sx={{ padding: "0px" }}
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => setIsCustomerModalOpen(true)}
                                                    >
                                                        <FiPlusCircle />
                                                    </Button>
                                                </Box>
                                            )}
                                            rules={{
                                                required: "Please Select Customer",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="membershipPlanID"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id="membership">Membership Plan</InputLabel>
                                                    <Select
                                                        labelId="membership"
                                                        id="membership-select"
                                                        value={value || ""}
                                                        label="Membership Plan"
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                    >
                                                        {membershipPlan?.map((res, ind) => (
                                                            <MenuItem style={{ textTransform: "capitalize" }} key={`membership_${ind}`} value={res.id}>
                                                                {res.planName} ({res.price}/-) ({res.hours} Hours)
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {error && error.message &&
                                                        <FormHelpText error={true}>{error.message}</FormHelpText>
                                                    }
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Select Memership Plan'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="managerName"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                >
                                                    <TextField
                                                        label="Manager Name"
                                                        variant="outlined"
                                                        size="small"
                                                        name="managerName"
                                                        value={value || ''}
                                                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Enter Manager Name'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="validity"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id="validity">Validity</InputLabel>
                                                    <Select
                                                        labelId="validity"
                                                        id="validity-select"
                                                        value={value || 6}
                                                        label="Validity"
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                    >
                                                        <MenuItem style={{ textTransform: "capitalize" }} value={'6'}>
                                                            6 Months
                                                        </MenuItem>
                                                        <MenuItem style={{ textTransform: "capitalize" }} value={'12'}>
                                                            1 Year
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Select Memership Plan'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            control={control}
                                            name="paymentID"
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
                                                        {paymentType?.map((res, ind) => (
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
                                    {isCardSelected &&
                                        <Grid item xs={12} sm={12}>
                                            <Controller
                                                control={control}
                                                name="cardNo"
                                                render={({
                                                    field: { onBlur, onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <FormControl
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        <TextField
                                                            label="Last 4 Digit Card No"
                                                            variant="outlined"
                                                            size="small"
                                                            name="cardNo"
                                                            value={value || ''}
                                                            onChange={(e) => {
                                                                if(e.target.value.length < 5) {
                                                                    onChange(e.target.value)
                                                                }
                                                            }}
                                                            onBlur={onBlur}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    </FormControl>
                                                )}
                                                rules={{
                                                    required: 'Please Enter Last 4 Digit Of Card Number'
                                                }}
                                            />
                                        </Grid>
                                    }
                                    <Grid item xs={12} sm={8}>
                                        <Controller
                                            control={control}
                                            name="extraHours"
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr 1fr 4fr',  alignItems: 'center'}}>
                                                    <span
                                                        style={{ marginRight: '14px', fontSize: '24px', cursor: 'pointer'}}
                                                        onClick={() =>  {
                                                            if(!isOtpSend) {
                                                                if(verifiedOtp) {
                                                                    setOtp(null);
                                                                    setIsOtpSend(false);
                                                                    setVerifiedOtp(false);
                                                                }
                                                                onChange(parseInt(value) + 1)
                                                            }
                                                        }}
                                                    >
                                                        <FiPlusCircle/>
                                                    </span>
                                                    <FormControl
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        <TextField
                                                            label="Extra Hours"
                                                            variant="outlined"
                                                            size="small"
                                                            name="extrahours"
                                                            value={value || ''}
                                                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                            onBlur={onBlur}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            disabled={isOtpSend}
                                                        />
                                                    </FormControl>
                                                    <span
                                                        style={{ marginLeft: '14px', fontSize: '24px', cursor: 'pointer'}}
                                                        onClick={() => {
                                                            if(!isOtpSend && parseInt(value) > 0) {
                                                                if(verifiedOtp) {
                                                                    setOtp(null);
                                                                    setIsOtpSend(false);
                                                                    setVerifiedOtp(false);
                                                                }
                                                                onChange(parseInt(value) - 1)
                                                            }
                                                        }}
                                                    >
                                                        <FiMinusCircle/>
                                                    </span>
                                                    {/* {parseInt(value) > 0 && !verifiedOtp &&
                                                        <>
                                                            {isOtpSend ?
                                                                <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 3fr',  alignItems: 'center'}}>
                                                                    <FormControl sx={{ marginRight: '12px' }} size="small" fullWidth>
                                                                        <TextField
                                                                            label="Enter OTP"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            name="otp"
                                                                            value={otp || ''}
                                                                            onChange={(e) => {
                                                                                if(e.target.value.length < 7) {
                                                                                    setOtp(e.target.value)}
                                                                                }
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                    <Button className="btn btn-tertiary" variant="contained" onClick={verifyOtp}>Verify OTP</Button>
                                                                </Box>
                                                            :
                                                                <Box>
                                                                    <Button className="btn btn-tertiary" variant="contained" onClick={getOtp}>Get OTP</Button>
                                                                </Box>
                                                            }
                                                        </>
                                                    }
                                                    {parseInt(value) > 0 && verifiedOtp &&
                                                        <>
                                                            <Typography variant="subtitle1" sx={{ color: theme => theme.palette.success.main}}>Verified</Typography>
                                                        </>
                                                    } */}
                                                </Box>
                                            )}
                                            rules={{
                                                required: 'Please Enter Remaining Minutes',
                                                pattern: {
                                                    value: /^\d*(\.\d{0,2})?$/i,
                                                    message: "please enter digit only.",
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4}></Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button className="btn btn-tertiary" variant="contained" type="button" onClick={cancelHandler}>Back</Button>
                        <Button disabled={disabledButton} className="btn btn-tertiary" variant="contained" type="submit">
                            {verifyCustomerMembership ? 'Save' : 'Verify'}
                        </Button>
                    </CardActions>
                </Card>
            </form>
            <AddCustomer
                isCustomerModalOpen={isCustomerModalOpen}
                setIsCustomerModalOpen={setIsCustomerModalOpen}
                setCustomerSelectedHandler={setCustomerSelectedHandler}
            />
            <VerifyOtpMerchant
                title="Verify Extra Hour Permission OTP"
                isOpen={openVerifyMembershipByMerchantModal}
                handleCancelVerifyPermission={handleCancelVerifyPermission/*setOpenVerifyMembershipByMerchantModal*/}
                handleEnterOtp={verifyOtp}
                resendOtp={getOtp}
            />
            <VerifyOtp
                title="Verify Customer OTP"
                isOpen={openVerifyMembershipModal}
                setOpen={setOpenVerifyMembershipModal}
                handleEnterOtp={handleVerifyMembership}
                resendOtp={() => {}}
            />
        </>
    )
};

export default AddEditMembership;