import Grid from "@mui/material/Grid";
import UseAddEditBill from "../hooks/useAddEditBill";
import MainCard from "components/MainCard";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Add, ArrowLeft, Printer, SearchNormal, ProfileCircle, Calendar, Box1, Receipt1, TicketDiscount, CloseCircle } from "iconsax-reactjs";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import AddCustomerModal from "pages/customer/component/AddCustomerModal";
import PaymentModal from "../modal/paymentModal";
import ViewDetailModal from "components/ViewDetailModal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import CustomerBillData from "components/CustomerBillData";

// ─── Section Header ────────────────────────────────────────────────────────────
export const SectionHeader = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Typography variant="subtitle1" fontWeight={600}>{label}</Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider', ml: 1 }} />
    </Stack>
);

// ─── Read-only Summary Row ─────────────────────────────────────────────────────
const SummaryRow = ({ label, value, bold }: { label: string; value: any; bold?: boolean }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2" fontWeight={bold ? 700 : 400}>{value ?? '—'}</Typography>
    </Stack>
);

const AddEditBill = () => {
    const {
        title,
        isEdit,
        control,
        gstValue,
        roomList,
        staffList,
        serviceList,
        paymentType,
        isSubmitting,
        customerList,
        isCardSelected,
        isViewDetailOpen,
        isAddCustomerOpen,
        isPaymentModalOpen,
        isCustomerSearching,
        isCustomerBillDataModalOpen,
        // Gift Card
        giftCard,
        giftCardCode,
        isGiftCardValidating,
        giftCardDeduction,
        setGiftCardCode,
        validateGiftCardHandler,
        clearGiftCard,
        setValue,
        getValues,
        handleBack,
        handlePrint,
        handleSubmit,
        calculateTotal,
        togglePaymentModal,
        handlePaymentDetail,
        toggleViewDetailOpen,
        searchCustomerViaPhone,
        toggleAddCustomerModal,
        toggleCustomerBillDataModalOpen
    } = UseAddEditBill();



    return (
        <>
            <form onSubmit={handleSubmit(
                isEdit
                    ? handlePrint
                    : (giftCard && giftCardDeduction.customerPayable <= 0)
                        ? handlePrint  // Scenario 2: no payment needed, submit directly
                        : togglePaymentModal
            )}>
                <Grid container spacing={3}>

                    {/* ── Main Form Column ───────────────────────────────────────── */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Stack spacing={3}>

                            {/* ── Section 1: Customer ──────────────────────────── */}
                            <MainCard>
                                <SectionHeader icon={<ProfileCircle size={18} />} label="Customer Details" />
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <Controller
                                            name="customerID"
                                            control={control}
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
                                                        setValue("Phone", selected?.name ?? '');
                                                    }}
                                                    onInputChange={(_, inputValue, reason) => {
                                                        if (reason === 'input') searchCustomerViaPhone(inputValue);
                                                    }}
                                                    noOptionsText={isCustomerSearching ? 'Searching...' : 'Enter 10-digit phone number to search'}
                                                    renderOption={(props, option) => (
                                                        <li {...props} key={option.id}>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={600}>{option.name}</Typography>
                                                                <Typography variant="caption" color="text.secondary">{option.phoneNumber}</Typography>
                                                            </Box>
                                                        </li>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Search by Phone Number"
                                                            placeholder="Enter 10-digit phone number"
                                                            fullWidth
                                                            error={!!error}
                                                            helperText={error?.message || 'Type the customer\'s phone number to look them up'}
                                                            onKeyDown={(e) => {
                                                                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
                                                                if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) e.preventDefault();
                                                            }}
                                                            inputProps={{ ...params.inputProps, maxLength: 10, inputMode: 'numeric' }}
                                                            InputProps={{
                                                                ...params.InputProps,
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
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{ alignItems: 'stretch', height: '100%' }}
                                        >
                                            {getValues('Phone') && (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<SearchNormal size={16} />}
                                                    onClick={() => toggleCustomerBillDataModalOpen()}
                                                    sx={{ whiteSpace: 'nowrap', py: { xs: 1.5, sm: 1.8 } }}
                                                >
                                                    <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>View Bills</Box>
                                                </Button>
                                            )}
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<Add size={16} />}
                                                onClick={toggleAddCustomerModal}
                                                sx={{ whiteSpace: 'nowrap', py: { xs: 1.5, sm: 1.8 } }}
                                            >
                                                New
                                            </Button>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="Phone"
                                            control={control}
                                            rules={{ required: "Customer name is required" }}
                                            render={({ field: { value }, fieldState: { error } }) => (
                                                <TextField
                                                    disabled
                                                    value={value || ""}
                                                    label="Customer Name"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message || 'Auto-filled after selection'}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <ProfileCircle size={16} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="date"
                                            control={control}
                                            render={({ field: { value }, fieldState: { error } }) => (
                                                <TextField
                                                    disabled
                                                    value={value || ""}
                                                    label="Bill Date"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText="Today's date (auto-set)"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Calendar size={16} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </MainCard>

                            {/* ── Section 2: Service / Line Item ──────────────── */}
                            <MainCard>
                                <SectionHeader icon={<Box1 size={18} />} label="Service Details" />
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <Controller
                                            name="serviceID"
                                            control={control}
                                            rules={{ required: 'Please select a service' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    value={serviceList.find((option) => option.id === value) || null}
                                                    onChange={(_, newValue) => {
                                                        onChange(newValue?.id);
                                                        setValue("hsnCode", newValue?.hsnCode || '9997');
                                                        setValue("rate", Number(newValue?.amount));
                                                        setValue("discount", 0);
                                                        setValue("quantity", 1);
                                                        calculateTotal();
                                                    }}
                                                    onBlur={onBlur}
                                                    options={serviceList || []}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            label="Select Service"
                                                            placeholder="Search and select a service..."
                                                            error={!!error}
                                                            helperText={error?.message || 'Choose the service being billed'}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="hsnCode"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <TextField
                                                    disabled
                                                    value={value || ""}
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                    label="HSN Code"
                                                    fullWidth
                                                    helperText="Auto-filled"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="quantity"
                                            control={control}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <TextField
                                                    disabled
                                                    value={value || ""}
                                                    onChange={(e) => { onChange(e); calculateTotal(); }}
                                                    onBlur={onBlur}
                                                    label="Quantity"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message || ' '}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="rate"
                                            control={control}
                                            rules={{ required: 'Rate is required' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <TextField
                                                    value={value || ""}
                                                    onChange={(e) => { onChange(parseFloat(e.target.value)); calculateTotal(); }}
                                                    onBlur={onBlur}
                                                    label="Rate (₹)"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message || ' '}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="discount"
                                            control={control}
                                            rules={{
                                                required: 'Required',
                                                min: { value: 0, message: 'Min 0' },
                                                max: { value: 100, message: 'Max 100' },
                                            }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <TextField
                                                    value={value ?? "0"}
                                                    onChange={(e) => { onChange(e); calculateTotal(); }}
                                                    onBlur={onBlur}
                                                    label="Discount (%)"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message || '0–100%'}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {isEdit &&
                                        <>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name="paymentID"
                                                    control={control}
                                                    rules={{ required: 'Payment Methos is required' }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <>
                                                            <FormLabel>Payment Method</FormLabel>
                                                            <RadioGroup row {...field} value={field.value ?? ""}>
                                                                {paymentType.map((type: any) => (
                                                                    <FormControlLabel key={type.id} value={type.id} control={<Radio size="small" />} label={<Typography variant="body2">{type.name}</Typography>} />
                                                                ))}
                                                            </RadioGroup>
                                                            <FormHelperText error>{error?.message}</FormHelperText>
                                                        </>
                                                    )}
                                                />
                                            </Grid>
                                            {isCardSelected && (
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Controller
                                                        name="cardNo"
                                                        control={control}
                                                        rules={{ required: 'Card Number is required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                label="Card Number"
                                                                fullWidth
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                {...field}
                                                                sx={{ mt: 1 }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            )}
                                        </>
                                    }
                                </Grid>
                            </MainCard>

                            {/* ── Section 2.5: Gift Card (Add mode only) ───────── */}
                            {!isEdit && (
                                <MainCard>
                                    <SectionHeader icon={<TicketDiscount size={18} />} label="Gift Card" />
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                value={giftCardCode}
                                                onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                                                label="Gift Card Code"
                                                placeholder="Enter gift card code (e.g., GABCDE12)"
                                                fullWidth
                                                disabled={!!giftCard || isGiftCardValidating}
                                                helperText={giftCard ? `✅ Valid — ₹${giftCard.amount} Gift Card` : 'Enter the gift card code to apply'}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <TicketDiscount size={16} />
                                                        </InputAdornment>
                                                    ),
                                                    ...(giftCard && {
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton size="small" onClick={clearGiftCard} color="error">
                                                                    <CloseCircle size={16} />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 3 }}>
                                            {!giftCard ? (
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={() => validateGiftCardHandler(giftCardCode)}
                                                    disabled={isGiftCardValidating || !giftCardCode}
                                                    sx={{ py: 1.8 }}
                                                >
                                                    {isGiftCardValidating ? <CircularProgress size={20} /> : 'Validate'}
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    fullWidth
                                                    onClick={clearGiftCard}
                                                    sx={{ py: 1.8 }}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </Grid>
                                        {giftCard && (
                                            <Grid size={{ xs: 12 }}>
                                                <Divider sx={{ my: 1 }} />
                                                <Stack spacing={0.5}>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body2" color="text.secondary">Gift Card Amount</Typography>
                                                        <Typography variant="body2" fontWeight={600} color="success.main">₹ {giftCardDeduction.giftCardAmount}/-</Typography>
                                                    </Stack>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body2" color="text.secondary">Service Total</Typography>
                                                        <Typography variant="body2" fontWeight={600}>₹ {getValues('grandTotal') || '0'}/-</Typography>
                                                    </Stack>
                                                    <Divider />
                                                    {giftCardDeduction.customerPayable > 0 ? (
                                                        <Stack direction="row" justifyContent="space-between">
                                                            <Typography variant="body2" fontWeight={700}>Customer Payable</Typography>
                                                            <Typography variant="body2" fontWeight={700} color="warning.main">₹ {giftCardDeduction.customerPayable.toFixed(2)}/-</Typography>
                                                        </Stack>
                                                    ) : (
                                                        <>
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="body2" fontWeight={700}>Customer Payable</Typography>
                                                                <Typography variant="body2" fontWeight={700} color="success.main">₹ 0 (Fully Covered)</Typography>
                                                            </Stack>
                                                            {giftCardDeduction.remainingExpires > 0 && (
                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography variant="caption" color="text.secondary">Remaining Expires</Typography>
                                                                    <Typography variant="caption" color="error.main">₹ {giftCardDeduction.remainingExpires.toFixed(2)}</Typography>
                                                                </Stack>
                                                            )}
                                                        </>
                                                    )}
                                                </Stack>
                                            </Grid>
                                        )}
                                    </Grid>
                                </MainCard>
                            )}

                            {/* ── Section 3: Assignment ────────────────────────── */}
                            <MainCard>
                                <SectionHeader icon={<Receipt1 size={18} />} label="Assignment & Reference" />
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="roomID"
                                            control={control}
                                            rules={{ required: 'Room is required' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    options={roomList}
                                                    getOptionLabel={(option) => option.roomName}
                                                    isOptionEqualToValue={(option, val) => option.id === val.id}
                                                    value={roomList.find((room) => room.id === value) || null}
                                                    onChange={(_, newValue) => onChange(newValue?.id)}
                                                    onBlur={onBlur}
                                                    renderOption={(props, option) => (
                                                        <li {...props} key={option.id}>{option.roomName}</li>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Room"
                                                            error={!!error}
                                                            helperText={error?.message || 'Select the treatment room'}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="staffID"
                                            control={control}
                                            rules={{ required: 'Staff is required' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    options={staffList}
                                                    getOptionLabel={(option) => option.label}
                                                    isOptionEqualToValue={(option, val) => option.value === val}
                                                    value={staffList.find((staff) => staff.value === value) || null}
                                                    onChange={(_, newValue) => onChange(newValue?.value)}
                                                    onBlur={onBlur}
                                                    renderOption={(props, option) => (
                                                        <li {...props} key={option.value}>{option.label}</li>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Therapist / Staff"
                                                            error={!!error}
                                                            helperText={error?.message || 'Assign the therapist'}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="referenceBy"
                                            control={control}
                                            rules={{ required: 'Reference By is required' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <FormControl fullWidth error={!!error}>
                                                    <InputLabel id="reference-by-label">Reference By</InputLabel>
                                                    <Select
                                                        labelId="reference-by-label"
                                                        value={value || ""}
                                                        label="Reference By"
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        fullWidth
                                                        error={!!error}
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
                                                // <TextField
                                                //     value={value}
                                                //     onChange={onChange}
                                                //     onBlur={onBlur}
                                                //     fullWidth
                                                //     label="Reference By"
                                                //     placeholder="Referred by (optional)"
                                                //     error={!!error}
                                                //     helperText={error?.message || 'Optional referral name'}
                                                // />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="managerName"
                                            control={control}
                                            render={({ field: { value } }) => (
                                                <TextField
                                                    value={value}
                                                    fullWidth
                                                    label="Manager on Duty"
                                                    disabled
                                                    helperText="Auto-assigned from today's manager"
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </MainCard>

                        </Stack>
                    </Grid>

                    {/* ── Summary / Totals Column ────────────────────────────────── */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Box sx={{ position: { xs: 'static', lg: 'sticky' }, top: 88 }}>
                            <MainCard>
                                <SectionHeader icon={<Receipt1 size={18} />} label="Bill Summary" />
                                <Controller
                                    name="roomID"
                                    control={control}
                                    render={({ field: { value } }) => {
                                        const room = roomList.find((room) => room.id === value)
                                        return (
                                            <SummaryRow label="Room" value={room ? room.roomName : '—'} />
                                        )
                                    }}
                                />
                                <Controller
                                    name="staffID"
                                    control={control}
                                    render={({ field: { value } }) => {
                                        const staff = staffList.find((staff) => staff.value === value)
                                        return (
                                            <SummaryRow label="Staff" value={staff ? staff.label : '—'} />
                                        )
                                    }}
                                />
                                <Controller
                                    name="managerName"
                                    control={control}
                                    render={({ field: { value } }) => {
                                        return (
                                            <SummaryRow label="Manager" value={value ? value : '—'} />
                                        )
                                    }}
                                />
                                {/* Amounts */}
                                <Controller
                                    name="total"
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <SummaryRow label="Subtotal" value={value ? `₹ ${value}/-` : '—'} />
                                    )}
                                />
                                {gstValue.csgst > 0 && (
                                    <Controller
                                        name="csgst"
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <SummaryRow label={`CGST (${gstValue.csgst}%)`} value={value ? `₹ ${value}/-` : '—'} />
                                        )}
                                    />
                                )}
                                {gstValue.sgst > 0 && (
                                    <Controller
                                        name="sgst"
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <SummaryRow label={`SGST (${gstValue.sgst}%)`} value={value ? `₹ ${value}/-` : '—'} />
                                        )}
                                    />
                                )}

                                <Divider sx={{ my: 1.5 }} />

                                <Controller
                                    name="grandTotal"
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={700}>Grand Total</Typography>
                                            <Typography variant="h5" fontWeight={700} color="primary.main">
                                                {value ? `₹ ${value}/-` : '₹ 0.00'}
                                            </Typography>
                                        </Stack>
                                    )}
                                />

                                {/* Gift Card Deduction in Summary */}
                                {giftCard && giftCardDeduction.applied && (
                                    <>
                                        <SummaryRow label="Gift Card" value={`- ₹ ${giftCardDeduction.giftCardAmount}/-`} />
                                        <Divider sx={{ my: 0.5 }} />
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.5 }}>
                                            <Typography variant="subtitle2" fontWeight={700} color={giftCardDeduction.customerPayable > 0 ? 'warning.main' : 'success.main'}>
                                                {giftCardDeduction.customerPayable > 0 ? 'Payable' : 'Fully Covered'}
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight={700} color={giftCardDeduction.customerPayable > 0 ? 'warning.main' : 'success.main'}>
                                                ₹ {giftCardDeduction.customerPayable.toFixed(2)}/-
                                            </Typography>
                                        </Stack>
                                    </>
                                )}

                                <Divider sx={{ my: 2 }} />

                                {/* Action Buttons */}
                                <Stack spacing={1.5}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        startIcon={<Printer size={18} />}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Generating...' : 'Print Bill'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        fullWidth
                                        color="secondary"
                                        startIcon={<ArrowLeft size={18} />}
                                        onClick={handleBack}
                                    >
                                        Go Back
                                    </Button>
                                </Stack>
                            </MainCard>
                        </Box>
                    </Grid>

                </Grid>
                {/* View Detail Modal */}
                <ViewDetailModal
                    title="Payment Detail"
                    submitButtonTitle={isSubmitting ? 'Generating...' : 'Print'}
                    detail={{
                        customer: `${getValues('Phone')} (${customerList.find((customer) => customer.id === getValues('customerID'))?.phoneNumber})`,
                        service: serviceList.find((service) => service.id === getValues('serviceID'))?.name,
                        manager: getValues('managerName'),
                        staff: staffList.find((staff) => staff.value === getValues('staffID'))?.label,
                        payment: getValues('paymentDetail')?.map((item) => item.name.split(' ')[0]).join(', '),
                        rate: getValues('rate'),
                    }}
                    open={isViewDetailOpen}
                    handleClose={toggleViewDetailOpen}
                    handleSubmit={!isSubmitting ? handleSubmit(handlePrint) : () => { }}
                />
            </form>
            {/* Payment Modal */}
            <PaymentModal
                open={isPaymentModalOpen}
                onClose={togglePaymentModal}
                grandTotal={giftCard && giftCardDeduction.customerPayable > 0 ? giftCardDeduction.customerPayable : getValues("grandTotal")}
                onConfirm={handlePaymentDetail}
            />

            {/* Add Customer Modal */}
            <AddCustomerModal
                open={isAddCustomerOpen}
                onClose={toggleAddCustomerModal}
                onSuccess={(customer) => {
                    if (customer) {
                        searchCustomerViaPhone(customer.phoneNumber);
                        setValue("customerID", customer.id);
                        setValue("Phone", customer.name ?? '');
                    }
                }}
            />
            <CustomerBillData
                open={isCustomerBillDataModalOpen}
                handleClose={toggleCustomerBillDataModalOpen}
                customerPhone={getValues('customerID')}
            />
        </>
    );
};

export default AddEditBill;