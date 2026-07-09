import { useState } from "react";
import Grid from "@mui/material/Grid";
import UseMembership from "./hooks/useMembership";
import Stack from "@mui/material/Stack";
import MainCard from "components/MainCard";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import { alpha, useTheme } from "@mui/material/styles";
import { AddCircle, ArrowDown2, ArrowUp2, Clock, Minus, Star1, UserTag } from "iconsax-reactjs";
import PaymentModal from "pages/bill/modal/paymentModal";
import OtpModal from "components/OtpModal";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import AddCustomerModal from "pages/customer/component/AddCustomerModal";
import EditMembershipModal from "./modal/editMembership";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import moment from "moment";

const Membership = () => {
    const theme = useTheme();
    const [isRedeemHistoryOpen, setIsRedeemHistoryOpen] = useState<boolean>(false);
    const {
        isAdmin,
        isOtpSend,
        isPayment,
        BasicForm,
        roomList,
        isMembershipEdit,
        selectedMembershipIDForEdit,
        serviceList,
        customerList,
        therapistList,
        membershipList,
        MembershipForm,
        serviceDropDown,
        isAddCustomerOpen,
        isPaymentModalOpen,
        membershipPlanList,
        RenewMembershipForm,
        MembershipRedeemForm,
        selectedMembershipID,
        isCustomerSearching,
        isAddMembershipShow,
        isRenewMembershipShow,
        isMembershipRedeemShow,
        membershipRedeemHistory,
        verifyCustomerMembership,
        openVerifyMembershipModal,
        isMembershipRedeemOtpSend,
        openVerifyMembershipByMerchantModal,
        getOtp,
        verifyOtp,
        setIsOtpSend,
        handleEditMembership,
        setSelectedMembershipIDForEdit,
        toggleMembershipEdit,
        togglePaymentModal,
        handlePaymentDetail,
        handleFindMembership,
        handleSaveMembership,
        setIsPaymentModalOpen,
        handleRenewMembership,
        toggleAddCustomerModal,
        searchCustomerViaPhone,
        handleVerifyMembership,
        toggleAddMembershipShow,
        setSelectedMembershipID,
        setIsAddMembershipShow,
        handleDetchRedeemHistory,
        toggleRenewMembershipShow,
        setIsMembershipRedeemShow,
        toggleMembershipRedeemShow,
        handleSendOtpForMembership,
        handleSaveMembershipRedeem,
        fetchMembershipPlanDropDown,
        setIsMembershipRedeemOtpSend,
        setOpenVerifyMembershipModal,
        handleCancelVerifyPermission,
        handleSendOtpMembershipRedeem,
        toggleMembershipRedeemOtpSend,
        handleVerifyMembershipRedeemOtp,
        setOpenVerifyMembershipByMerchantModal
    } = UseMembership();
    return (
        <>
            <form onSubmit={BasicForm.handleSubmit(handleFindMembership)}>
                <MainCard
                    content={false}
                    sx={{
                        overflow: 'visible',
                        border: (t) => `1px solid ${t.palette.divider}`,
                    }}
                >
                    {/* ── Hero Header ──────────────────────────────────────── */}
                    <Box
                        sx={(t) => ({
                            px: 3,
                            py: 3,
                            background: `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.07)} 0%, ${alpha(t.palette.secondary.main, 0.04)} 100%)`,
                            borderBottom: `1px solid ${t.palette.divider}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                        })}
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                                sx={(t) => ({
                                    width: 44,
                                    height: 44,
                                    borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.38)}`,
                                })}
                            >
                                <Star1 size={20} color="#fff" variant="Bold" />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                                    Membership Lookup
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Search by customer phone number to view or create a membership
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Today's date badge */}
                        <Controller
                            name="date"
                            control={BasicForm.control}
                            render={({ field: { value } }) => (
                                <Box
                                    sx={(t) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        px: 1.75,
                                        py: 0.75,
                                        borderRadius: 10,
                                        border: `1px solid ${alpha(t.palette.primary.main, 0.22)}`,
                                        background: alpha(t.palette.primary.main, 0.06),
                                    })}
                                >
                                    <Clock size={14} color={theme.palette.primary.main} />
                                    <Typography variant="caption" fontWeight={700} color="primary.main">
                                        {value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                    </Typography>
                                </Box>
                            )}
                        />
                    </Box>

                    {/* ── Search Row ───────────────────────────────────────── */}
                    <Box sx={{ p: 3 }}>
                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1.5 }}>
                            Find Customer
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                            {/* Phone number autocomplete */}
                            <Box sx={{ flex: 1 }}>
                                <Controller
                                    name="customerID"
                                    control={BasicForm.control}
                                    rules={{ required: "Please select a customer" }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <Autocomplete
                                            id="customerID"
                                            disablePortal
                                            loading={isCustomerSearching}
                                            options={customerList}
                                            filterOptions={(x) => x}
                                            getOptionLabel={(option) => option.phoneNumber || ''}
                                            isOptionEqualToValue={(option, val) => option?.id === val?.id}
                                            value={customerList.find((option) => option.id === value) || null}
                                            onChange={(_, selected) => {
                                                onChange(selected?.id ?? '');
                                            }}
                                            onInputChange={(_, inputValue, reason) => {
                                                if (reason === 'input') searchCustomerViaPhone(inputValue);
                                                if (reason === 'clear') {
                                                    setSelectedMembershipID(null);
                                                    setIsMembershipRedeemShow(false);
                                                    setIsAddMembershipShow(false);
                                                    BasicForm.reset();
                                                }
                                            }}
                                            noOptionsText={
                                                isCustomerSearching
                                                    ? 'Searching...'
                                                    : 'Enter 10-digit phone number to search'
                                            }
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 0.25 }}>
                                                        <Box
                                                            sx={(t) => ({
                                                                width: 34,
                                                                height: 34,
                                                                borderRadius: '50%',
                                                                background: `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.15)}, ${alpha(t.palette.primary.light, 0.08)})`,
                                                                border: `1px solid ${alpha(t.palette.primary.main, 0.18)}`,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0,
                                                            })}
                                                        >
                                                            <UserTag size={15} color={theme.palette.primary.main} variant="Bold" />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={700} lineHeight={1.2}>{option.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                                                {option.phoneNumber}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Customer Phone Number"
                                                    placeholder="Enter 10-digit mobile number"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message || 'Search by the customer\'s registered mobile number'}
                                                    onKeyDown={(e) => {
                                                        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
                                                        if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) e.preventDefault();
                                                    }}
                                                    inputProps={{ ...params.inputProps, maxLength: 10, inputMode: 'numeric' }}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <Box sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
                                                                <UserTag size={18} color={theme.palette.text.disabled} />
                                                            </Box>
                                                        ),
                                                        endAdornment: (
                                                            <>
                                                                {isCustomerSearching ? <CircularProgress color="inherit" size={16} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    sx={(t) => ({
                                        minWidth: 160,
                                        height: 56,
                                        mt: { xs: 0, sm: 0 },
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        flexShrink: 0,
                                        boxShadow: `0 4px 14px ${alpha(t.palette.primary.main, 0.38)}`,
                                        '&:hover': {
                                            boxShadow: `0 6px 20px ${alpha(t.palette.primary.main, 0.5)}`,
                                            transform: 'translateY(-1px)',
                                        },
                                        transition: 'all 0.18s ease',
                                    })}
                                >
                                    Find Membership
                                </Button>
                                <Button
                                    size="large"
                                    variant="contained"
                                    type="button"
                                    onClick={toggleAddCustomerModal}
                                    sx={(t) => ({
                                        minWidth: 160,
                                        height: 56,
                                        mt: { xs: 0, sm: 0 },
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        flexShrink: 0,
                                        boxShadow: `0 4px 14px ${alpha(t.palette.primary.main, 0.38)}`,
                                        '&:hover': {
                                            boxShadow: `0 6px 20px ${alpha(t.palette.primary.main, 0.5)}`,
                                            transform: 'translateY(-1px)',
                                        },
                                        transition: 'all 0.18s ease',
                                    })}
                                >
                                    Add New Customer
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </MainCard>
            </form>
            <br />
            {isAddCustomerOpen && (
                <AddCustomerModal
                    open={isAddCustomerOpen}
                    onClose={toggleAddCustomerModal}
                    onSuccess={(customer) => {
                        if (customer) {
                            searchCustomerViaPhone(customer.phoneNumber);
                            BasicForm.setValue('customerID', customer.id);
                            handleFindMembership(BasicForm.getValues());
                        }
                    }}
                />
            )}
            {/* =========================================================================
              * 2. ADD NEW MEMBERSHIP SECTION
              * =========================================================================
              * Form to create a new membership package for the selected customer.
              * Follows the flow: Payment -> Merchant OTP (if extra hours) -> Customer OTP -> Save.
              * ========================================================================= */}
            {isAddMembershipShow && (
                <>
                    <form onSubmit={MembershipForm.handleSubmit(isPayment ? !isOtpSend ? getOtp : verifyCustomerMembership ? handleSaveMembership : handleSendOtpForMembership : togglePaymentModal)}>

                        <MainCard
                            content={false}
                            sx={{
                                overflow: 'visible',
                                border: (t) => `1px solid ${t.palette.divider}`,
                            }}
                        >
                            {/* ── Card Header ─────────────────────────────────── */}
                            <Box
                                sx={(t) => ({
                                    px: 3,
                                    py: 2.5,
                                    background: `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.08)} 0%, ${alpha(t.palette.primary.light, 0.04)} 100%)`,
                                    borderBottom: `1px solid ${t.palette.divider}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                })}
                            >
                                <Box
                                    sx={(t) => ({
                                        width: 38,
                                        height: 38,
                                        borderRadius: '10px',
                                        background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
                                    })}
                                >
                                    <Star1 size={18} color="#fff" variant="Bold" />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                                        New Membership
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Fill in the details below to create a membership
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>

                                    {/* ── Membership Plan ───────────────────────── */}
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1 }}>
                                            Membership Plan
                                        </Typography>
                                        <Controller
                                            name="membershipPlanID"
                                            control={MembershipForm.control}
                                            rules={{ required: 'Membership plan is required' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <>
                                                    {/* Plan cards grid */}
                                                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                                        {membershipPlanList.map((plan) => {
                                                            const selected = plan.id === value;
                                                            return (
                                                                <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                                                    <Box
                                                                        onClick={() => onChange(plan.id)}
                                                                        sx={(t) => ({
                                                                            position: 'relative',
                                                                            p: 2.5,
                                                                            borderRadius: 2,
                                                                            cursor: 'pointer',
                                                                            border: `2px solid ${selected ? t.palette.primary.main : t.palette.divider}`,
                                                                            background: selected
                                                                                ? `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.07)} 0%, ${alpha(t.palette.primary.light, 0.03)} 100%)`
                                                                                : t.palette.background.paper,
                                                                            transition: 'all 0.2s ease',
                                                                            '&:hover': {
                                                                                borderColor: t.palette.primary.main,
                                                                                transform: 'translateY(-2px)',
                                                                                boxShadow: `0 8px 24px ${alpha(t.palette.primary.main, 0.15)}`,
                                                                            },
                                                                        })}
                                                                    >
                                                                        {selected && (
                                                                            <Box
                                                                                sx={(t) => ({
                                                                                    position: 'absolute',
                                                                                    top: 10,
                                                                                    right: 10,
                                                                                    width: 20,
                                                                                    height: 20,
                                                                                    borderRadius: '50%',
                                                                                    background: t.palette.primary.main,
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                })}
                                                                            >
                                                                                <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</Typography>
                                                                            </Box>
                                                                        )}
                                                                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                                                            {plan.planName}
                                                                        </Typography>
                                                                        <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 1 }}>
                                                                            <Typography variant="h4" fontWeight={800} color="primary">
                                                                                ₹{plan.price}
                                                                            </Typography>
                                                                            <Typography variant="caption" color="text.secondary">/-</Typography>
                                                                        </Stack>
                                                                        <Stack spacing={0.5}>
                                                                            <Stack direction="row" spacing={0.75} alignItems="center">
                                                                                <Clock size={13} color={theme.palette.text.secondary} />
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {plan.hours} Hours included
                                                                                </Typography>
                                                                            </Stack>
                                                                            {plan.hsnCode && (
                                                                                <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                                                                                    HSN: {plan.hsnCode}
                                                                                </Typography>
                                                                            )}
                                                                        </Stack>
                                                                    </Box>
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                    {error && (
                                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                                            {error.message}
                                                        </Typography>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Divider sx={{ borderStyle: 'dashed' }} />
                                    </Grid>

                                    {/* ── Validity + Manager Row ────────────────── */}
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                            Validity Period
                                        </Typography>
                                        <Controller
                                            name="validity"
                                            control={MembershipForm.control}
                                            rules={{ required: 'Select Validity' }}
                                            render={({ field: { value, onChange } }) => (
                                                <Stack direction="row" spacing={1.5}>
                                                    {[
                                                        { label: '6 Months', value: 6 },
                                                        { label: '1 Year', value: 12 },
                                                    ].map((opt) => {
                                                        const active = Number(value) === opt.value;
                                                        return (
                                                            <Box
                                                                key={opt.value}
                                                                onClick={() => onChange(opt.value)}
                                                                sx={(t) => ({
                                                                    flex: 1,
                                                                    py: 1.5,
                                                                    px: 2,
                                                                    borderRadius: 2,
                                                                    cursor: 'pointer',
                                                                    border: `2px solid ${active ? t.palette.primary.main : t.palette.divider}`,
                                                                    background: active
                                                                        ? `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.1)}, ${alpha(t.palette.primary.light, 0.05)})`
                                                                        : t.palette.background.paper,
                                                                    textAlign: 'center',
                                                                    transition: 'all 0.18s ease',
                                                                    '&:hover': {
                                                                        borderColor: t.palette.primary.main,
                                                                        boxShadow: `0 4px 14px ${alpha(t.palette.primary.main, 0.18)}`,
                                                                    },
                                                                })}
                                                            >
                                                                <Typography
                                                                    fontWeight={active ? 700 : 500}
                                                                    variant="body2"
                                                                    color={active ? 'primary' : 'text.secondary'}
                                                                >
                                                                    {opt.label}
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    })}
                                                </Stack>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                            Reference By
                                        </Typography>
                                        <Controller
                                            name="referenceBy"
                                            control={MembershipForm.control}
                                            rules={{ required: 'Reference By is required' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <FormControl fullWidth error={!!error}>
                                                    <Select
                                                        value={value}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        displayEmpty
                                                    >
                                                        {/* <MenuItem value="">Select</MenuItem> */}
                                                        <MenuItem value="google">Google</MenuItem>
                                                        <MenuItem value="instagram_or_facebook">Instagram/Facebook</MenuItem>
                                                        <MenuItem value="direct_call">Direct Call</MenuItem>
                                                        <MenuItem value="website">Website</MenuItem>
                                                        <MenuItem value="justdial">Just Dial</MenuItem>
                                                        <MenuItem value="other">Other</MenuItem>
                                                    </Select>
                                                    {error && <FormHelperText>{error.message}</FormHelperText>}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                            Manager on Duty
                                        </Typography>
                                        <Controller
                                            name="managerName"
                                            control={MembershipForm.control}
                                            render={({ field: { value } }) => (
                                                <Box
                                                    sx={(t) => ({
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.5,
                                                        px: 2,
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        border: `1px solid ${t.palette.divider}`,
                                                        background: alpha(t.palette.action.hover, 0.04),
                                                    })}
                                                >
                                                    <Box
                                                        sx={(t) => ({
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: '50%',
                                                            background: `linear-gradient(135deg, ${t.palette.secondary.main}, ${t.palette.secondary.dark})`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                        })}
                                                    >
                                                        <UserTag size={16} color="#fff" variant="Bold" />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="caption" color="text.disabled" display="block">
                                                            Auto-assigned
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {value || '—'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Divider sx={{ borderStyle: 'dashed' }} />
                                    </Grid>

                                    {/* ── Extra Hours Stepper ───────────────────── */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                            Extra Hours
                                        </Typography>
                                        <Controller
                                            name="extraHours"
                                            control={MembershipForm.control}
                                            render={({ field: { value } }) => (
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    spacing={2}
                                                    sx={(t) => ({
                                                        px: 2,
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        border: `1px solid ${t.palette.divider}`,
                                                        background: t.palette.background.paper,
                                                        width: 'fit-content',
                                                        minWidth: 200,
                                                    })}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        disabled={parseInt(value) < 1}
                                                        onClick={() => MembershipForm.setValue("extraHours", (parseInt(value) - 1).toString())}
                                                        sx={(t) => ({
                                                            width: 32,
                                                            height: 32,
                                                            border: `1px solid ${t.palette.divider}`,
                                                            borderRadius: '8px',
                                                            '&:hover:not(:disabled)': {
                                                                borderColor: t.palette.error.main,
                                                                color: t.palette.error.main,
                                                                background: alpha(t.palette.error.main, 0.06),
                                                            },
                                                        })}
                                                    >
                                                        <Minus size={16} />
                                                    </IconButton>

                                                    <Box sx={{ textAlign: 'center', minWidth: 56 }}>
                                                        <Typography variant="h4" fontWeight={800} lineHeight={1}>
                                                            {value}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            hrs
                                                        </Typography>
                                                    </Box>

                                                    <IconButton
                                                        size="small"
                                                        onClick={() => MembershipForm.setValue("extraHours", (parseInt(value) + 1).toString())}
                                                        sx={(t) => ({
                                                            width: 32,
                                                            height: 32,
                                                            border: `1px solid ${t.palette.divider}`,
                                                            borderRadius: '8px',
                                                            '&:hover': {
                                                                borderColor: t.palette.primary.main,
                                                                color: t.palette.primary.main,
                                                                background: alpha(t.palette.primary.main, 0.06),
                                                            },
                                                        })}
                                                    >
                                                        <AddCircle size={16} />
                                                    </IconButton>
                                                </Stack>
                                            )}
                                        />
                                    </Grid>

                                    {/* ── Summary Strip ────────────────────────── */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="membershipPlanID"
                                            control={MembershipForm.control}
                                            render={({ field: { value: planId } }) => {
                                                const plan = membershipPlanList.find((p) => p.id === planId);
                                                const extraHrs = parseInt(MembershipForm.watch('extraHours') || '0');
                                                const validityVal = MembershipForm.watch('validity');
                                                const validityLabel = Number(validityVal) === 12 ? '1 Year' : '6 Months';
                                                if (!plan) return <></>;
                                                return (
                                                    <Box
                                                        sx={(t) => ({
                                                            p: 2,
                                                            borderRadius: 2,
                                                            background: `linear-gradient(135deg, ${alpha(t.palette.success.main, 0.08)}, ${alpha(t.palette.success.light, 0.04)})`,
                                                            border: `1px solid ${alpha(t.palette.success.main, 0.25)}`,
                                                        })}
                                                    >
                                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                                            Summary
                                                        </Typography>
                                                        <Stack spacing={0.75} sx={{ mt: 1 }}>
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="body2" color="text.secondary">Plan</Typography>
                                                                <Typography variant="body2" fontWeight={600}>{plan.planName}</Typography>
                                                            </Stack>
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="body2" color="text.secondary">Total Hours</Typography>
                                                                <Typography variant="body2" fontWeight={600}>{plan.hours + extraHrs} hrs</Typography>
                                                            </Stack>
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="body2" color="text.secondary">Validity</Typography>
                                                                <Typography variant="body2" fontWeight={600}>{validityLabel}</Typography>
                                                            </Stack>
                                                            <Divider sx={{ my: 0.5 }} />
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="body2" fontWeight={700}>Amount</Typography>
                                                                <Typography variant="body2" fontWeight={800} color="success.main">₹{plan.price}/-</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Box>
                                                );
                                            }}
                                        />
                                    </Grid>

                                </Grid>
                            </Box>

                            {/* ── Footer Actions ───────────────────────────────── */}
                            <Box
                                sx={(t) => ({
                                    px: 3,
                                    py: 2,
                                    borderTop: `1px solid ${t.palette.divider}`,
                                    background: alpha(t.palette.action.hover, 0.02),
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 1.5,
                                })}
                            >
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={toggleAddMembershipShow}
                                    sx={{ minWidth: 100 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={MembershipForm.formState.isSubmitting}
                                    startIcon={MembershipForm.formState.isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
                                    sx={{ minWidth: 140 }}
                                >
                                    {isPayment
                                        ? MembershipForm.formState.isSubmitting
                                            ? 'Processing...'
                                            : isOtpSend
                                                ? 'Verify & Proceed'
                                                : 'Send OTP'
                                        : 'Proceed to Payment'}
                                </Button>
                            </Box>
                        </MainCard>
                    </form>
                </>
            )}
            {/* =========================================================================
              * 3. REDEEM MEMBERSHIP SECTION
              * =========================================================================
              * Lists active memberships for a customer and allows deducting hours
              * (redeeming) for a particular service/room/therapist.
              * Flow: Select Membership -> Fill Details -> OTP -> Deduct Valid Hours.
              * ========================================================================= */}
            {isMembershipRedeemShow && (
                <>
                    {selectedMembershipID ?
                        <>
                            {(() => {
                                const selectedMembership = membershipList.find((m: any) => m.id === selectedMembershipID);
                                const remainingMins = selectedMembership?.minutes ?? 0;
                                const remainingHrs = Math.floor(remainingMins / 60);
                                const remainingMin = remainingMins % 60;
                                const isLow = remainingMins < 60;

                                return (
                                    <form onSubmit={MembershipRedeemForm.handleSubmit(isMembershipRedeemOtpSend ? handleSaveMembershipRedeem : handleSendOtpMembershipRedeem)}>
                                        {/* // <form onSubmit={MembershipRedeemForm.handleSubmit(handleSaveMembershipRedeem)}> */}
                                        <MainCard
                                            content={false}
                                            sx={{
                                                overflow: 'visible',
                                                border: (t) => `1px solid ${t.palette.divider}`,
                                            }}
                                        >
                                            {/* ── Card Header ─────────────────────────────── */}
                                            <Box
                                                sx={(t) => ({
                                                    px: 3,
                                                    py: 2.5,
                                                    background: `linear-gradient(135deg, ${alpha(t.palette.warning.main, 0.08)} 0%, ${alpha(t.palette.warning.light, 0.03)} 100%)`,
                                                    borderBottom: `1px solid ${t.palette.divider}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexWrap: 'wrap',
                                                    gap: 1.5,
                                                })}
                                            >
                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                    <Box
                                                        sx={(t) => ({
                                                            width: 38,
                                                            height: 38,
                                                            borderRadius: '10px',
                                                            background: `linear-gradient(135deg, ${t.palette.warning.main}, ${t.palette.warning.dark})`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                            boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.35)}`,
                                                        })}
                                                    >
                                                        <Clock size={18} color="#fff" variant="Bold" />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                                                            Redeem Membership
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Fill in session details to deduct hours
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color="success"
                                                        onClick={() => {
                                                            setIsAddMembershipShow(false);
                                                            setIsMembershipRedeemShow(false);
                                                            toggleRenewMembershipShow();
                                                            fetchMembershipPlanDropDown();
                                                        }}
                                                        sx={(t) => ({
                                                            borderRadius: 10,
                                                            fontSize: '0.75rem',
                                                        })}
                                                    >
                                                        Renew Plan
                                                    </Button>
                                                    {/* Back button */}
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        color="inherit"
                                                        onClick={() => setSelectedMembershipID(null)}
                                                        sx={(t) => ({
                                                            borderRadius: 1.5,
                                                            borderColor: t.palette.divider,
                                                            color: t.palette.text.secondary,
                                                            fontSize: '0.75rem',
                                                            '&:hover': { borderColor: t.palette.primary.main, color: t.palette.primary.main },
                                                        })}
                                                    >
                                                        ← Back to list
                                                    </Button>
                                                </Box>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                {/* ── Membership Info Banner ─────────────────── */}
                                                {selectedMembership && (
                                                    <Box
                                                        sx={(t) => ({
                                                            mb: 3,
                                                            p: 2,
                                                            borderRadius: 2,
                                                            background: isLow
                                                                ? `linear-gradient(135deg, ${alpha(t.palette.error.main, 0.08)}, ${alpha(t.palette.error.light, 0.04)})`
                                                                : `linear-gradient(135deg, ${alpha(t.palette.success.main, 0.08)}, ${alpha(t.palette.success.light, 0.04)})`,
                                                            border: `1px solid ${alpha(isLow ? t.palette.error.main : t.palette.success.main, 0.22)}`,
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: 3,
                                                            alignItems: 'center',
                                                        })}
                                                    >
                                                        {/* Plan badge */}
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Star1 size={15} color={theme.palette.primary.main} variant="Bold" />
                                                            <Box>
                                                                <Typography variant="caption" color="text.disabled" display="block">Plan</Typography>
                                                                <Typography variant="body2" fontWeight={700} color="primary.main">
                                                                    {selectedMembership?.px_membership_plan?.planName || '—'}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>

                                                        <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />

                                                        {/* Customer */}
                                                        <Box>
                                                            <Typography variant="caption" color="text.disabled" display="block">Customer</Typography>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {selectedMembership?.px_customer?.name || '—'}
                                                            </Typography>
                                                        </Box>

                                                        <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />

                                                        {/* Remaining time */}
                                                        <Box>
                                                            <Typography variant="caption" color="text.disabled" display="block">Time Remaining</Typography>
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={700}
                                                                color={isLow ? 'error.main' : 'success.main'}
                                                            >
                                                                {remainingHrs > 0 ? `${remainingHrs}h ` : ''}{remainingMin}m
                                                            </Typography>
                                                        </Box>

                                                        <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />

                                                        {/* Bill No */}
                                                        <Box>
                                                            <Typography variant="caption" color="text.disabled" display="block">Bill No</Typography>
                                                            <Typography variant="caption" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                                                                {selectedMembership?.billNo || '—'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}
                                                {membershipRedeemHistory.length > 0 &&
                                                    <Box>
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            justifyContent="space-between"
                                                            onClick={() => setIsRedeemHistoryOpen(!isRedeemHistoryOpen)}
                                                            sx={{
                                                                cursor: 'pointer',
                                                                paddingBottom: 2,
                                                                borderRadius: 1,
                                                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                                                            }}
                                                        >
                                                            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 1 }}>
                                                                Redeem History ({membershipRedeemHistory.length})
                                                            </Typography>
                                                            <IconButton size="small">
                                                                {isRedeemHistoryOpen ? <ArrowUp2 size={16} /> : <ArrowDown2 size={16} />}
                                                            </IconButton>
                                                        </Stack>
                                                        <Collapse in={isRedeemHistoryOpen}>
                                                            <TableContainer sx={{ mt: 1 }}>
                                                                <Table size="small">
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
                                                                        {membershipRedeemHistory.map((item: any, index: number) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>{moment(item.createdAt).format('DD/MM/yyyy HH:MM A')}</TableCell>
                                                                                <TableCell>{item?.px_user?.lastName}</TableCell>
                                                                                <TableCell>{item?.billNo}</TableCell>
                                                                                <TableCell>{item?.px_service?.name}</TableCell>
                                                                                <TableCell>{item?.minutes}</TableCell>
                                                                                <TableCell>{item?.px_staff?.nickName}</TableCell>
                                                                                <TableCell>{Array.isArray(item?.managerName) ? item?.managerName?.map((manager: any) => `${manager?.nickName}`).join(', ') : item?.managerName}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Collapse>
                                                    </Box>
                                                }

                                                <Grid container spacing={3}>

                                                    {/* ── Duration selection ────────────────────── */}
                                                    <Grid size={{ xs: 12 }}>
                                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                                            Session Duration
                                                        </Typography>
                                                        <Controller
                                                            name="minutes"
                                                            control={MembershipRedeemForm.control}
                                                            rules={{ required: 'Duration is required' }}
                                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                                <>
                                                                    <Stack direction="row" spacing={2}>
                                                                        {[
                                                                            { label: '60 Minutes', sub: '1 Hour', value: 60 },
                                                                            { label: '120 Minutes', sub: '2 Hours', value: 120 },
                                                                        ].map((opt) => {
                                                                            const active = Number(value) === opt.value;
                                                                            return (
                                                                                <Box
                                                                                    key={opt.value}
                                                                                    onClick={() => onChange(opt.value)}
                                                                                    sx={(t) => ({
                                                                                        flex: 1,
                                                                                        maxWidth: 200,
                                                                                        py: 2,
                                                                                        px: 2.5,
                                                                                        borderRadius: 2,
                                                                                        cursor: 'pointer',
                                                                                        border: `2px solid ${active ? t.palette.primary.main : t.palette.divider}`,
                                                                                        background: active
                                                                                            ? `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.1)}, ${alpha(t.palette.primary.light, 0.05)})`
                                                                                            : t.palette.background.paper,
                                                                                        transition: 'all 0.18s ease',
                                                                                        '&:hover': {
                                                                                            borderColor: t.palette.primary.main,
                                                                                            boxShadow: `0 4px 14px ${alpha(t.palette.primary.main, 0.18)}`,
                                                                                        },
                                                                                    })}
                                                                                >
                                                                                    <Typography
                                                                                        variant="body1"
                                                                                        fontWeight={active ? 800 : 500}
                                                                                        color={active ? 'primary.dark' : 'text.primary'}
                                                                                        lineHeight={1.1}
                                                                                    >
                                                                                        {opt.label}
                                                                                    </Typography>
                                                                                    <Typography variant="caption" color={active ? 'primary.main' : 'text.disabled'}>
                                                                                        {opt.sub}
                                                                                    </Typography>
                                                                                </Box>
                                                                            );
                                                                        })}
                                                                    </Stack>
                                                                    {error && (
                                                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                                                            {error.message}
                                                                        </Typography>
                                                                    )}
                                                                </>
                                                            )}
                                                        />
                                                    </Grid>

                                                    <Grid size={{ xs: 12 }}>
                                                        <Divider sx={{ borderStyle: 'dashed' }} />
                                                    </Grid>

                                                    {/* ── Service ──────────────────────────────── */}
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                                            Service
                                                        </Typography>
                                                        <Controller
                                                            name="serviceID"
                                                            control={MembershipRedeemForm.control}
                                                            rules={{ required: 'Service is required' }}
                                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                                <Autocomplete
                                                                    options={serviceDropDown}
                                                                    getOptionLabel={(option) => option.name}
                                                                    value={serviceDropDown.find((s: any) => s.id === value) || null}
                                                                    onChange={(_, newValue) => onChange(newValue?.id || null)}
                                                                    renderOption={(props, option) => (
                                                                        <li {...props} key={option.id}>
                                                                            <Box>
                                                                                <Typography variant="body2" fontWeight={600}>{option.name}</Typography>
                                                                                {option.minutes && (
                                                                                    <Typography variant="caption" color="text.secondary">{option.minutes} min</Typography>
                                                                                )}
                                                                            </Box>
                                                                        </li>
                                                                    )}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Select Service"
                                                                            fullWidth
                                                                            error={!!error}
                                                                            helperText={error?.message}
                                                                        />
                                                                    )}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>

                                                    {/* ── Room ─────────────────────────────────── */}
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                                            Room
                                                        </Typography>
                                                        <Controller
                                                            name="roomID"
                                                            control={MembershipRedeemForm.control}
                                                            rules={{ required: 'Room is required' }}
                                                            render={({ field, fieldState: { error } }) => (
                                                                <Autocomplete
                                                                    options={roomList}
                                                                    getOptionLabel={(option) => option.roomName}
                                                                    value={roomList.find((r: any) => r.id === field.value) || null}
                                                                    onChange={(_, newValue) => field.onChange(newValue?.id || null)}
                                                                    renderOption={(props, option) => (
                                                                        <li {...props} key={option.id}>
                                                                            <Typography variant="body2" fontWeight={600}>{option.roomName}</Typography>
                                                                        </li>
                                                                    )}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Select Room"
                                                                            fullWidth
                                                                            error={!!error}
                                                                            helperText={error?.message}
                                                                        />
                                                                    )}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>

                                                    {/* ── Therapist / Staff ────────────────────── */}
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                                            Therapist
                                                        </Typography>
                                                        <Controller
                                                            name="staffID"
                                                            control={MembershipRedeemForm.control}
                                                            rules={{ required: 'Therapist is required' }}
                                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                                <Autocomplete
                                                                    options={therapistList}
                                                                    getOptionLabel={(option) => option.label}
                                                                    value={therapistList.find((t: any) => t.value === value) || null}
                                                                    onChange={(_, newValue) => onChange(newValue?.value || null)}
                                                                    renderOption={(props, option) => (
                                                                        <li {...props} key={option.value}>
                                                                            <Typography variant="body2" fontWeight={600}>{option.label}</Typography>
                                                                        </li>
                                                                    )}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Select Therapist"
                                                                            fullWidth
                                                                            error={!!error}
                                                                            helperText={error?.message}
                                                                        />
                                                                    )}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>

                                                    {/* ── Manager on Duty ──────────────────────── */}
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                                            Manager on Duty
                                                        </Typography>
                                                        <Controller
                                                            name="managerName"
                                                            control={MembershipRedeemForm.control}
                                                            render={({ field: { value } }) => (
                                                                <Box
                                                                    sx={(t) => ({
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1.5,
                                                                        px: 2,
                                                                        py: 1.5,
                                                                        borderRadius: 2,
                                                                        border: `1px solid ${t.palette.divider}`,
                                                                        background: alpha(t.palette.action.hover, 0.04),
                                                                    })}
                                                                >
                                                                    <Box
                                                                        sx={(t) => ({
                                                                            width: 36,
                                                                            height: 36,
                                                                            borderRadius: '50%',
                                                                            background: `linear-gradient(135deg, ${t.palette.secondary.main}, ${t.palette.secondary.dark})`,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            flexShrink: 0,
                                                                        })}
                                                                    >
                                                                        <UserTag size={16} color="#fff" variant="Bold" />
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="caption" color="text.disabled" display="block">
                                                                            Auto-assigned
                                                                        </Typography>
                                                                        <Typography variant="body2" fontWeight={600}>
                                                                            {value || '—'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        />
                                                    </Grid>

                                                </Grid>
                                            </Box>

                                            {/* ── Footer Actions ───────────────────────────── */}
                                            <Box
                                                sx={(t) => ({
                                                    px: 3,
                                                    py: 2,
                                                    borderTop: `1px solid ${t.palette.divider}`,
                                                    background: alpha(t.palette.action.hover, 0.02),
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    flexWrap: 'wrap',
                                                })}
                                            >
                                                {/* Deduction preview */}
                                                <Controller
                                                    name="minutes"
                                                    control={MembershipRedeemForm.control}
                                                    render={({ field: { value: mins } }) => (
                                                        mins ? (
                                                            <Box
                                                                sx={(t) => ({
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1,
                                                                    px: 1.5,
                                                                    py: 0.75,
                                                                    borderRadius: 1.5,
                                                                    background: alpha(t.palette.warning.main, 0.08),
                                                                    border: `1px solid ${alpha(t.palette.warning.main, 0.22)}`,
                                                                })}
                                                            >
                                                                <Clock size={14} color={theme.palette.warning.main} />
                                                                <Typography variant="caption" fontWeight={700} color="warning.dark">
                                                                    {Number(mins)} min will be deducted · {remainingMins - Number(mins)} min remaining after
                                                                </Typography>
                                                            </Box>
                                                        ) : <Box />
                                                    )}
                                                />

                                                <Stack direction="row" spacing={1.5}>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => setSelectedMembershipID(null)}
                                                        sx={{ minWidth: 100 }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        disabled={MembershipRedeemForm.formState.isSubmitting}
                                                        startIcon={MembershipRedeemForm.formState.isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
                                                        sx={(t) => ({
                                                            minWidth: 140,
                                                            boxShadow: `0 4px 14px ${alpha(t.palette.primary.main, 0.35)}`,
                                                            '&:hover': { boxShadow: `0 6px 20px ${alpha(t.palette.primary.main, 0.5)}` },
                                                        })}
                                                    >
                                                        {MembershipRedeemForm.formState.isSubmitting ? 'Processing...' : isMembershipRedeemOtpSend ? 'Redeem' : 'Verify'}
                                                    </Button>
                                                </Stack>
                                            </Box>
                                        </MainCard>
                                    </form>
                                );
                            })()}
                            <OtpModal
                                title="Verify Customer Redeem OTP"
                                isOpen={isOtpSend}
                                handleCancelVerifyPermission={() => setIsOtpSend(false)}
                                handleEnterOtp={handleVerifyMembershipRedeemOtp}
                                resendOtp={() => handleSendOtpMembershipRedeem(MembershipRedeemForm.getValues())}
                                setOpen={(value: boolean) => setIsOtpSend(value)}
                                okTitle={MembershipRedeemForm.formState.isSubmitting ? 'Verifying...' : 'Verify'}
                            />
                        </>
                        :
                        <MainCard content={false} sx={{ border: (t) => `1px solid ${t.palette.divider}` }}>

                            {/* ── Card Header ───────────────────────────── */}
                            <Box
                                sx={(t) => ({
                                    px: 3,
                                    py: 2.5,
                                    background: `linear-gradient(135deg, ${alpha(t.palette.info.main, 0.08)} 0%, ${alpha(t.palette.info.light, 0.03)} 100%)`,
                                    borderBottom: `1px solid ${t.palette.divider}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 1.5,
                                })}
                            >
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Box
                                        sx={(t) => ({
                                            width: 38,
                                            height: 38,
                                            borderRadius: '10px',
                                            background: `linear-gradient(135deg, ${t.palette.info.main}, ${t.palette.info.dark})`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.35)}`,
                                        })}
                                    >
                                        <Star1 size={18} color="#fff" variant="Bold" />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                                            Active Memberships
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Select a membership to redeem hours
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Box
                                    sx={(t) => ({
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 10,
                                        background: alpha(t.palette.info.main, 0.12),
                                        border: `1px solid ${alpha(t.palette.info.main, 0.25)}`,
                                    })}
                                >
                                    <Typography variant="caption" fontWeight={700} color="info.main">
                                        {membershipList.length} Record{membershipList.length !== 1 ? 's' : ''}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* ── Table ─────────────────────────────────── */}
                            {membershipList.length === 0 ? (
                                <Box sx={{ py: 8, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.disabled">No memberships found for this customer.</Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow
                                                sx={(t) => ({
                                                    background: alpha(t.palette.action.hover, 0.04),
                                                    '& .MuiTableCell-head': {
                                                        py: 1.5,
                                                        color: t.palette.text.secondary,
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.06em',
                                                        borderBottom: `1px solid ${t.palette.divider}`,
                                                        whiteSpace: 'nowrap',
                                                    },
                                                })}
                                            >
                                                <TableCell>Date</TableCell>
                                                <TableCell>Branch</TableCell>
                                                <TableCell>Customer</TableCell>
                                                <TableCell>Bill No</TableCell>
                                                <TableCell>Plan</TableCell>
                                                <TableCell align="center">Extra Hrs</TableCell>
                                                <TableCell align="center">Remaining</TableCell>
                                                <TableCell align="right">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {membershipList.map((membership) => {
                                                const remainingMins = membership?.minutes ?? 0;
                                                const remainingHrs = Math.floor(remainingMins / 60);
                                                const remainingMin = remainingMins % 60;
                                                const isLow = remainingMins < 60;

                                                return (
                                                    <TableRow
                                                        key={membership.id}
                                                        sx={(t) => ({
                                                            transition: 'background 0.15s ease',
                                                            '&:hover': {
                                                                background: alpha(t.palette.primary.main, 0.03),
                                                            },
                                                            '& .MuiTableCell-body': {
                                                                py: 1.75,
                                                                borderBottom: `1px solid ${alpha(t.palette.divider, 0.6)}`,
                                                            },
                                                            '&:last-child .MuiTableCell-body': {
                                                                borderBottom: 'none',
                                                            },
                                                        })}
                                                    >
                                                        {/* Date */}
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {new Date(membership?.createdAt).toLocaleDateString('en-IN', {
                                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                                })}
                                                            </Typography>
                                                        </TableCell>

                                                        {/* Branch */}
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={500} color="text.secondary">
                                                                {membership?.px_user?.lastName || '—'}
                                                            </Typography>
                                                        </TableCell>

                                                        {/* Customer */}
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {membership?.px_customer?.name || '—'}
                                                            </Typography>
                                                        </TableCell>

                                                        {/* Bill No */}
                                                        <TableCell>
                                                            <Typography
                                                                variant="caption"
                                                                fontWeight={600}
                                                                sx={(t) => ({
                                                                    px: 1,
                                                                    py: 0.3,
                                                                    borderRadius: 1,
                                                                    fontFamily: 'monospace',
                                                                    background: alpha(t.palette.action.hover, 0.08),
                                                                    border: `1px solid ${t.palette.divider}`,
                                                                    display: 'inline-block',
                                                                })}
                                                            >
                                                                {membership?.billNo || '—'}
                                                            </Typography>
                                                        </TableCell>

                                                        {/* Plan */}
                                                        <TableCell>
                                                            <Box
                                                                sx={(t) => ({
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5,
                                                                    px: 1.25,
                                                                    py: 0.4,
                                                                    borderRadius: 10,
                                                                    background: alpha(t.palette.primary.main, 0.1),
                                                                    border: `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
                                                                })}
                                                            >
                                                                <Star1 size={11} color={theme.palette.primary.main} variant="Bold" />
                                                                <Typography variant="caption" fontWeight={700} color="primary.main">
                                                                    {membership?.px_membership_plan?.planName || '—'}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>

                                                        {/* Extra Hours */}
                                                        <TableCell align="center">
                                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                                                <Clock size={13} color={theme.palette.text.secondary} />
                                                                <Typography variant="body2" fontWeight={600}>
                                                                    {membership?.extraHours ?? 0}h
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell>

                                                        {/* Remaining Minutes */}
                                                        <TableCell align="center">
                                                            <Box
                                                                sx={(t) => ({
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5,
                                                                    px: 1.25,
                                                                    py: 0.35,
                                                                    borderRadius: 10,
                                                                    background: isLow
                                                                        ? alpha(t.palette.error.main, 0.1)
                                                                        : alpha(t.palette.success.main, 0.1),
                                                                    border: `1px solid ${isLow
                                                                        ? alpha(t.palette.error.main, 0.25)
                                                                        : alpha(t.palette.success.main, 0.25)}`,
                                                                })}
                                                            >
                                                                <Typography
                                                                    variant="caption"
                                                                    fontWeight={700}
                                                                    color={isLow ? 'error.main' : 'success.main'}
                                                                >
                                                                    {remainingHrs > 0 ? `${remainingHrs}h ` : ''}{remainingMin}m
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>

                                                        {/* Action */}
                                                        <TableCell align="right">
                                                            <Button
                                                                variant="contained"
                                                                type="button"
                                                                size="small"
                                                                onClick={() => {
                                                                    setSelectedMembershipID(membership.id);
                                                                    handleDetchRedeemHistory(membership);
                                                                }}
                                                                sx={(t) => ({
                                                                    borderRadius: 1.5,
                                                                    px: 2,
                                                                    fontWeight: 700,
                                                                    fontSize: '0.75rem',
                                                                    boxShadow: `0 2px 8px ${alpha(t.palette.primary.main, 0.3)}`,
                                                                    '&:hover': {
                                                                        boxShadow: `0 4px 16px ${alpha(t.palette.primary.main, 0.45)}`,
                                                                        transform: 'translateY(-1px)',
                                                                    },
                                                                    transition: 'all 0.18s ease',
                                                                })}
                                                            >
                                                                Redeem
                                                            </Button>
                                                            {isAdmin &&
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    onClick={() => {
                                                                        setSelectedMembershipIDForEdit(membership.id);
                                                                        toggleMembershipEdit();
                                                                    }}
                                                                    sx={(t) => ({
                                                                        borderRadius: 1.5,
                                                                        px: 2,
                                                                        marginLeft: 2,
                                                                        fontWeight: 700,
                                                                        fontSize: '0.75rem',
                                                                        boxShadow: `0 2px 8px ${alpha(t.palette.primary.main, 0.3)}`,
                                                                        '&:hover': {
                                                                            boxShadow: `0 4px 16px ${alpha(t.palette.primary.main, 0.45)}`,
                                                                            transform: 'translateY(-1px)',
                                                                        },
                                                                        transition: 'all 0.18s ease',
                                                                    })}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </MainCard>
                    }
                </>
            )}
            {isAdmin && isMembershipEdit && (
                <EditMembershipModal
                    isOpen={isMembershipEdit}
                    onClose={() => toggleMembershipEdit()}
                    membershipId={selectedMembershipIDForEdit}
                    selectedMembership={membershipList.find((x: any) => x.id === selectedMembershipIDForEdit)}
                    onSubmit={(detail: any) => handleEditMembership(detail)}
                />
            )}
            {/* =========================================================================
              * 4. RENEW MEMBERSHIP SECTION
              * =========================================================================
              * Similar to Add Membership, used for extending or purchasing a new plan
              * when an active membership exists or expires.
              * ========================================================================= */}
            {isRenewMembershipShow && (
                <>
                    <form onSubmit={RenewMembershipForm.handleSubmit(isPayment ? !isOtpSend ? getOtp : verifyCustomerMembership ? handleRenewMembership : handleSendOtpForMembership : togglePaymentModal)}>
                        <MainCard
                            content={false}
                            sx={{
                                overflow: 'visible',
                                border: (t) => `1px solid ${t.palette.divider}`,
                            }}
                        >
                            {/* ── Card Header ─────────────────────────────────── */}
                            <Box
                                sx={(t) => ({
                                    px: 3,
                                    py: 2.5,
                                    background: `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.08)} 0%, ${alpha(t.palette.primary.light, 0.04)} 100%)`,
                                    borderBottom: `1px solid ${t.palette.divider}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 1.5,
                                })}
                            >
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Box
                                        sx={(t) => ({
                                            width: 38,
                                            height: 38,
                                            borderRadius: '10px',
                                            background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
                                        })}
                                    >
                                        <Star1 size={18} color="#fff" variant="Bold" />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                                            Renew Membership
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Fill in the details below to renew a membership
                                        </Typography>
                                    </Box>
                                </Stack>
                                {/* Back button */}
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="inherit"
                                    onClick={() => {
                                        setIsMembershipRedeemShow(true);
                                        toggleRenewMembershipShow();
                                    }}
                                    sx={(t) => ({
                                        borderRadius: 1.5,
                                        borderColor: t.palette.divider,
                                        color: t.palette.text.secondary,
                                        fontSize: '0.75rem',
                                        '&:hover': { borderColor: t.palette.primary.main, color: t.palette.primary.main },
                                    })}
                                >
                                    ← Back to list
                                </Button>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>

                                    {/* ── Membership Plan ───────────────────────── */}
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1 }}>
                                            Membership Plan
                                        </Typography>
                                        <Controller
                                            name="membershipPlanID"
                                            control={RenewMembershipForm.control}
                                            rules={{ required: 'Membership plan is required' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <>
                                                    {/* Plan cards grid */}
                                                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                                        {membershipPlanList.map((plan) => {
                                                            const selected = plan.id === value;
                                                            return (
                                                                <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                                                    <Box
                                                                        onClick={() => onChange(plan.id)}
                                                                        sx={(t) => ({
                                                                            position: 'relative',
                                                                            p: 2.5,
                                                                            borderRadius: 2,
                                                                            cursor: 'pointer',
                                                                            border: `2px solid ${selected ? t.palette.primary.main : t.palette.divider}`,
                                                                            background: selected
                                                                                ? `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.07)} 0%, ${alpha(t.palette.primary.light, 0.03)} 100%)`
                                                                                : t.palette.background.paper,
                                                                            transition: 'all 0.2s ease',
                                                                            '&:hover': {
                                                                                borderColor: t.palette.primary.main,
                                                                                transform: 'translateY(-2px)',
                                                                                boxShadow: `0 8px 24px ${alpha(t.palette.primary.main, 0.15)}`,
                                                                            },
                                                                        })}
                                                                    >
                                                                        {selected && (
                                                                            <Box
                                                                                sx={(t) => ({
                                                                                    position: 'absolute',
                                                                                    top: 10,
                                                                                    right: 10,
                                                                                    width: 20,
                                                                                    height: 20,
                                                                                    borderRadius: '50%',
                                                                                    background: t.palette.primary.main,
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                })}
                                                                            >
                                                                                <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</Typography>
                                                                            </Box>
                                                                        )}
                                                                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                                                            {plan.planName}
                                                                        </Typography>
                                                                        <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 1 }}>
                                                                            <Typography variant="h4" fontWeight={800} color="primary">
                                                                                ₹{plan.price}
                                                                            </Typography>
                                                                            <Typography variant="caption" color="text.secondary">/-</Typography>
                                                                        </Stack>
                                                                        <Stack spacing={0.5}>
                                                                            <Stack direction="row" spacing={0.75} alignItems="center">
                                                                                <Clock size={13} color={theme.palette.text.secondary} />
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {plan.hours} Hours included
                                                                                </Typography>
                                                                            </Stack>
                                                                            {plan.hsnCode && (
                                                                                <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                                                                                    HSN: {plan.hsnCode}
                                                                                </Typography>
                                                                            )}
                                                                        </Stack>
                                                                    </Box>
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                    {error && (
                                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                                            {error.message}
                                                        </Typography>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Divider sx={{ borderStyle: 'dashed' }} />
                                    </Grid>

                                    {/* ── Validity + Manager Row ────────────────── */}
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                            Validity Period
                                        </Typography>
                                        <Controller
                                            name="validity"
                                            control={RenewMembershipForm.control}
                                            rules={{ required: 'Select Validity' }}
                                            render={({ field: { value, onChange } }) => (
                                                <Stack direction="row" spacing={1.5}>
                                                    {[
                                                        { label: '6 Months', value: 6 },
                                                        { label: '1 Year', value: 12 },
                                                    ].map((opt) => {
                                                        const active = Number(value) === opt.value;
                                                        return (
                                                            <Box
                                                                key={opt.value}
                                                                onClick={() => onChange(opt.value)}
                                                                sx={(t) => ({
                                                                    flex: 1,
                                                                    py: 1.5,
                                                                    px: 2,
                                                                    borderRadius: 2,
                                                                    cursor: 'pointer',
                                                                    border: `2px solid ${active ? t.palette.primary.main : t.palette.divider}`,
                                                                    background: active
                                                                        ? `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.1)}, ${alpha(t.palette.primary.light, 0.05)})`
                                                                        : t.palette.background.paper,
                                                                    textAlign: 'center',
                                                                    transition: 'all 0.18s ease',
                                                                    '&:hover': {
                                                                        borderColor: t.palette.primary.main,
                                                                        boxShadow: `0 4px 14px ${alpha(t.palette.primary.main, 0.18)}`,
                                                                    },
                                                                })}
                                                            >
                                                                <Typography
                                                                    fontWeight={active ? 700 : 500}
                                                                    variant="body2"
                                                                    color={active ? 'primary' : 'text.secondary'}
                                                                >
                                                                    {opt.label}
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    })}
                                                </Stack>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                            Reference By
                                        </Typography>
                                        <Controller
                                            name="referenceBy"
                                            control={RenewMembershipForm.control}
                                            rules={{ required: 'Reference By is required' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <FormControl fullWidth error={!!error}>
                                                    <Select
                                                        value={value}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        displayEmpty
                                                    >
                                                        {/* <MenuItem value="">Select</MenuItem> */}
                                                        <MenuItem value="google">Google</MenuItem>
                                                        <MenuItem value="instagram_or_facebook">Instagram/Facebook</MenuItem>
                                                        <MenuItem value="direct_call">Direct Call</MenuItem>
                                                        <MenuItem value="website">Website</MenuItem>
                                                        <MenuItem value="justdial">Just Dial</MenuItem>
                                                        <MenuItem value="other">Other</MenuItem>
                                                    </Select>
                                                    {error && <FormHelperText>{error.message}</FormHelperText>}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                            Manager on Duty
                                        </Typography>
                                        <Controller
                                            name="managerName"
                                            control={RenewMembershipForm.control}
                                            render={({ field: { value } }) => (
                                                <Box
                                                    sx={(t) => ({
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.5,
                                                        px: 2,
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        border: `1px solid ${t.palette.divider}`,
                                                        background: alpha(t.palette.action.hover, 0.04),
                                                    })}
                                                >
                                                    <Box
                                                        sx={(t) => ({
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: '50%',
                                                            background: `linear-gradient(135deg, ${t.palette.secondary.main}, ${t.palette.secondary.dark})`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                        })}
                                                    >
                                                        <UserTag size={16} color="#fff" variant="Bold" />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="caption" color="text.disabled" display="block">
                                                            Auto-assigned
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {value || '—'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Divider sx={{ borderStyle: 'dashed' }} />
                                    </Grid>

                                    {/* ── Extra Hours Stepper ───────────────────── */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                                            Extra Hours
                                        </Typography>
                                        <Controller
                                            name="extraHours"
                                            control={RenewMembershipForm.control}
                                            render={({ field: { value } }) => (
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    spacing={2}
                                                    sx={(t) => ({
                                                        px: 2,
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        border: `1px solid ${t.palette.divider}`,
                                                        background: t.palette.background.paper,
                                                        width: 'fit-content',
                                                        minWidth: 200,
                                                    })}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        disabled={parseInt(value) < 1}
                                                        onClick={() => RenewMembershipForm.setValue("extraHours", (parseInt(value) - 1).toString())}
                                                        sx={(t) => ({
                                                            width: 32,
                                                            height: 32,
                                                            border: `1px solid ${t.palette.divider}`,
                                                            borderRadius: '8px',
                                                            '&:hover:not(:disabled)': {
                                                                borderColor: t.palette.error.main,
                                                                color: t.palette.error.main,
                                                                background: alpha(t.palette.error.main, 0.06),
                                                            },
                                                        })}
                                                    >
                                                        <Minus size={16} />
                                                    </IconButton>

                                                    <Box sx={{ textAlign: 'center', minWidth: 56 }}>
                                                        <Typography variant="h4" fontWeight={800} lineHeight={1}>
                                                            {value}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            hrs
                                                        </Typography>
                                                    </Box>

                                                    <IconButton
                                                        size="small"
                                                        onClick={() => RenewMembershipForm.setValue("extraHours", (parseInt(value) + 1).toString())}
                                                        sx={(t) => ({
                                                            width: 32,
                                                            height: 32,
                                                            border: `1px solid ${t.palette.divider}`,
                                                            borderRadius: '8px',
                                                            '&:hover': {
                                                                borderColor: t.palette.primary.main,
                                                                color: t.palette.primary.main,
                                                                background: alpha(t.palette.primary.main, 0.06),
                                                            },
                                                        })}
                                                    >
                                                        <AddCircle size={16} />
                                                    </IconButton>
                                                </Stack>
                                            )}
                                        />
                                    </Grid>

                                    {/* ── Summary Strip ────────────────────────── */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="membershipPlanID"
                                            control={RenewMembershipForm.control}
                                            render={({ field: { value: planId } }) => {
                                                const plan = membershipPlanList.find((p) => p.id === planId);
                                                const extraHrs = parseInt(RenewMembershipForm.watch('extraHours') || '0');
                                                const validityVal = RenewMembershipForm.watch('validity');
                                                const validityLabel = Number(validityVal) === 12 ? '1 Year' : '6 Months';
                                                if (!plan) return <></>;
                                                return (
                                                    <Box
                                                        sx={(t) => ({
                                                            p: 2,
                                                            borderRadius: 2,
                                                            background: `linear-gradient(135deg, ${alpha(t.palette.success.main, 0.08)}, ${alpha(t.palette.success.light, 0.04)})`,
                                                            border: `1px solid ${alpha(t.palette.success.main, 0.25)}`,
                                                        })}
                                                    >
                                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                                            Summary
                                                        </Typography>
                                                        <Stack spacing={0.75} sx={{ mt: 1 }}>
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="body2" color="text.secondary">Plan</Typography>
                                                                <Typography variant="body2" fontWeight={600}>{plan.planName}</Typography>
                                                            </Stack>
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="body2" color="text.secondary">Total Hours</Typography>
                                                                <Typography variant="body2" fontWeight={600}>{plan.hours + extraHrs} hrs</Typography>
                                                            </Stack>
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="body2" color="text.secondary">Validity</Typography>
                                                                <Typography variant="body2" fontWeight={600}>{validityLabel}</Typography>
                                                            </Stack>
                                                            <Divider sx={{ my: 0.5 }} />
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="body2" fontWeight={700}>Amount</Typography>
                                                                <Typography variant="body2" fontWeight={800} color="success.main">₹{plan.price}/-</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Box>
                                                );
                                            }}
                                        />
                                    </Grid>

                                </Grid>
                            </Box>

                            {/* ── Footer Actions ───────────────────────────────── */}
                            <Box
                                sx={(t) => ({
                                    px: 3,
                                    py: 2,
                                    borderTop: `1px solid ${t.palette.divider}`,
                                    background: alpha(t.palette.action.hover, 0.02),
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 1.5,
                                })}
                            >
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={toggleAddMembershipShow}
                                    sx={{ minWidth: 100 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={RenewMembershipForm.formState.isSubmitting}
                                    startIcon={RenewMembershipForm.formState.isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
                                    sx={{ minWidth: 140 }}
                                >
                                    {isPayment
                                        ? RenewMembershipForm.formState.isSubmitting
                                            ? 'Processing...'
                                            : isOtpSend
                                                ? 'Verify & Proceed'
                                                : 'Send OTP'
                                        : 'Proceed to Payment'}
                                </Button>
                            </Box>
                        </MainCard>
                    </form>
                </>
            )}

            {/* =========================================================================
              * 5. GLOBAL MODALS
              * =========================================================================
              * These modals handle common OTP and Payment flows across Add and Renew steps.
              * Pulled out to root layer to avoid duplication and simplify structure.
              * ========================================================================= */}
            <OtpModal
                title="Verify Extra Hour Permission OTP"
                isOpen={openVerifyMembershipByMerchantModal}
                handleCancelVerifyPermission={handleCancelVerifyPermission}
                handleEnterOtp={verifyOtp}
                resendOtp={getOtp}
                setOpen={(value: boolean) => setOpenVerifyMembershipByMerchantModal(value)}
                okTitle={MembershipForm.formState.isSubmitting ? 'Verifying...' : 'Verify'}
            />
            <OtpModal
                title="Verify Customer OTP"
                isOpen={openVerifyMembershipModal}
                handleCancelVerifyPermission={() => setOpenVerifyMembershipModal(false)}
                handleEnterOtp={handleVerifyMembership}
                resendOtp={() => { }}
                setOpen={(value: boolean) => setOpenVerifyMembershipModal(value)}
                okTitle={MembershipForm.formState.isSubmitting ? 'Verifying...' : 'Verify'}
            />
            <PaymentModal
                open={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                grandTotal={membershipPlanList.find((membershipPlan) => membershipPlan.id === (isRenewMembershipShow ? RenewMembershipForm.getValues("membershipPlanID") : MembershipForm.getValues("membershipPlanID")))?.price}
                onConfirm={handlePaymentDetail}
            />
        </>
    )
}

export default Membership;