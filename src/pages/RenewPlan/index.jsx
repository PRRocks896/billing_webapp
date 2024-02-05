import React from "react";
import { Controller } from "react-hook-form";

import { FiPlusCircle, FiMinusCircle} from "react-icons/fi";

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
import Typography from "@mui/material/Typography";

import VerifyOtp from "../../components/VerifyOTPModel";

import { useRenewPlan } from "./hook/useRenewPlan.hook";

const RenewPlan = () => {
    const {
        otp,
        control,
        isOtpSend,
        paymentType,
        currentDate,
        verifiedOtp,
        disabledButton,
        isCardSelected,
        membershipPlan,
        membershipDetail,
        verifyCustomerMembership,
        openVerifyMembershipModal,
        setOtp,
        getOtp,
        onSubmit,
        verifyOtp,
        setIsOtpSend,
        cancelHandler,
        handleSubmit,
        setVerifiedOtp,
        handleVerifyMembership,
        handleSendOtpForMembership,
        setOpenVerifyMembershipModal,
    } = useRenewPlan();
    return (
        <>
            <form onSubmit={handleSubmit(verifyCustomerMembership ? onSubmit : handleSendOtpForMembership)}>
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
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                >
                                                    <TextField
                                                        disabled
                                                        variant="outlined"
                                                        label="Customer"
                                                        size="small"
                                                        name="customer"
                                                        value={membershipDetail && membershipDetail?.px_customer ? `${membershipDetail?.px_customer?.name} (${membershipDetail?.px_customer?.phoneNumber})` : ''}
                                                    />
                                                </FormControl>
                                            )}
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
                                                    {parseInt(value) > 0 && !verifiedOtp &&
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
                                                    }
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
            <VerifyOtp
                title="Verify Customer OTP"
                isOpen={openVerifyMembershipModal}
                setOpen={setOpenVerifyMembershipModal}
                handleEnterOtp={handleVerifyMembership}
            />
        </>
    )
}

export default RenewPlan;