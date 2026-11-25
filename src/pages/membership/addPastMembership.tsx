import MainCard from 'components/MainCard';
import UseAddPastMembership from './hooks/useAddPastMembership.hook';
import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { capitalize } from 'lodash';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { AddCircle, Clock, MinusCirlce, Star1, UserTag } from 'iconsax-reactjs';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, display: 'block', mb: 1.5 }}>
        {children}
    </Typography>
);

const AddPastMembership = () => {
    const theme = useTheme();
    const {
        control,
        customerList,
        isCustomerSearching,
        membershipPlanList,
        managerList,
        branchList,
        paymentTypeList,
        isAddCustomerOpen,
        searchCustomerViaPhone,
        toggleAddCustomerModal,
        handleSubmit,
        onSubmit,
        reset,
        cancelHandler,
        isCardSelected,
        isSubmitting,
        isAdmin
    } = UseAddPastMembership();

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <MainCard
                    content={false}
                    sx={{
                        overflow: 'visible',
                        border: (t) => `1px solid ${t.palette.divider}`
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
                            gap: 1.5
                        })}
                    >
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
                                boxShadow: `0 4px 14px ${alpha(t.palette.primary.main, 0.38)}`
                            })}
                        >
                            <Star1 size={20} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                                Add Past Membership
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Record a membership that was sold earlier, with its original date and payment details
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            {/* ── Branch & Date ─────────────────────────────── */}
                            <Grid size={{ xs: 12 }}>
                                <SectionLabel>Branch &amp; Date</SectionLabel>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="userID"
                                            rules={{ required: 'Please select a branch' }}
                                            control={control}
                                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    freeSolo
                                                    disabled={!isAdmin}
                                                    getOptionLabel={(option: any) => option.lastName || ''}
                                                    isOptionEqualToValue={(option: any, value) => option?.id === value}
                                                    options={branchList}
                                                    value={branchList.find((item) => item.id === value) || null}
                                                    onChange={(_, data) => {
                                                        onChange(data?.id || null);
                                                    }}
                                                    onBlur={onBlur}
                                                    renderOption={(props, option) => (
                                                        <li {...props} key={option.id}>
                                                            {capitalize(option.lastName)}
                                                        </li>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Select Branch"
                                                            variant="outlined"
                                                            error={!!error}
                                                            helperText={error ? error.message : null}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="createdAt"
                                            rules={{ required: 'Please select a date' }}
                                            control={control}
                                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                                <TextField
                                                    type="date"
                                                    label="Created At"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={value}
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                    error={!!error}
                                                    helperText={error ? error.message : null}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ borderStyle: 'dashed' }} />
                            </Grid>

                            {/* ── Customer ──────────────────────────────────── */}
                            <Grid size={{ xs: 12 }}>
                                <SectionLabel>Find Customer</SectionLabel>
                                <Controller
                                    name="customerID"
                                    rules={{ required: 'Please select a customer' }}
                                    control={control}
                                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
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
                                                    reset();
                                                }
                                            }}
                                            noOptionsText={isCustomerSearching ? 'Searching...' : 'Enter 10-digit phone number to search'}
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
                                                                flexShrink: 0
                                                            })}
                                                        >
                                                            <UserTag size={15} color={theme.palette.primary.main} variant="Bold" />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                                                                {option.name}
                                                            </Typography>
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
                                                    helperText={error?.message || "Search by the customer's registered mobile number"}
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
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ borderStyle: 'dashed' }} />
                            </Grid>

                            {/* ── Plan details ──────────────────────────────── */}
                            <Grid size={{ xs: 12 }}>
                                <SectionLabel>Membership Details</SectionLabel>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="membershipPlanID"
                                            rules={{ required: 'Please select a membership plan' }}
                                            control={control}
                                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    disablePortal
                                                    options={membershipPlanList}
                                                    getOptionLabel={(option) => option.planName || ''}
                                                    isOptionEqualToValue={(option, val) => option?.id === val?.id}
                                                    value={membershipPlanList.find((option) => option.id === value) || null}
                                                    onChange={(_, selected) => {
                                                        onChange(selected?.id ?? '');
                                                    }}
                                                    renderOption={(props, option) => (
                                                        <li {...props} key={option.id}>
                                                            {capitalize(option.planName)}
                                                        </li>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Select Membership Plan"
                                                            variant="outlined"
                                                            error={!!error}
                                                            helperText={error ? error.message : null}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            control={control}
                                            name="validity"
                                            rules={{
                                                required: 'Please Select Memership Plan'
                                            }}
                                            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                                                <FormControl fullWidth>
                                                    <InputLabel id="validity">Validity</InputLabel>
                                                    <Select
                                                        labelId="validity"
                                                        id="validity-select"
                                                        value={value || '6'}
                                                        label="Validity"
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                    >
                                                        <MenuItem style={{ textTransform: 'capitalize' }} value={'6'}>
                                                            6 Months
                                                        </MenuItem>
                                                        <MenuItem style={{ textTransform: 'capitalize' }} value={'12'}>
                                                            1 Year
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="managerName"
                                            rules={{ required: 'Please select a manager' }}
                                            control={control}
                                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    disablePortal
                                                    options={managerList}
                                                    getOptionLabel={(option) => option.nickName || option.name || ''}
                                                    isOptionEqualToValue={(option, val) => option?.id === val?.id}
                                                    value={managerList.find((option) => [option.nickName, option.name].includes(value)) || null}
                                                    onChange={(_, selected) => {
                                                        onChange(selected?.name ?? '');
                                                    }}
                                                    renderOption={(props, option) => (
                                                        <li {...props} key={option.id}>
                                                            {capitalize(option.nickName)} - ({capitalize(option.name)})
                                                        </li>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Select Manager"
                                                            variant="outlined"
                                                            error={!!error}
                                                            helperText={error ? error.message : null}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ borderStyle: 'dashed' }} />
                            </Grid>

                            {/* ── Payment ───────────────────────────────────── */}
                            <Grid size={{ xs: 12 }}>
                                <SectionLabel>Payment</SectionLabel>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            control={control}
                                            name="paymentID"
                                            rules={{
                                                required: 'Please Select Paid By'
                                            }}
                                            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                                                <FormControl fullWidth error={!!error}>
                                                    <InputLabel id="paidBy">Paid By</InputLabel>
                                                    <Select
                                                        labelId="paidBy"
                                                        id="paidBy-select"
                                                        value={value ?? ''}
                                                        label="Paid By"
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                    >
                                                        {paymentTypeList?.map((res, ind) => (
                                                            <MenuItem
                                                                style={{ textTransform: 'capitalize' }}
                                                                key={`paidBy_${ind}`}
                                                                value={res.id}
                                                            >
                                                                {res.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {error && error.message && <FormHelperText error={true}>{error.message}</FormHelperText>}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    {isCardSelected && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="cardNo"
                                                control={control}
                                                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                                    <TextField
                                                        type="text"
                                                        label="Card Number"
                                                        placeholder="Last 4 digits"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={value}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error ? error.message : 'Enter the last 4 digits of the card'}
                                                    />
                                                )}
                                                rules={{
                                                    required: 'Please Enter Card Number',
                                                    pattern: {
                                                        value: /^[0-9]{4}$/,
                                                        message: 'Card number must be last 4 digits'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ borderStyle: 'dashed' }} />
                            </Grid>

                            {/* ── Hours ─────────────────────────────────────── */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <SectionLabel>Extra Hours</SectionLabel>
                                <Controller
                                    name="extraHours"
                                    control={control}
                                    rules={{
                                        required: 'Please Enter Remaining Minutes',
                                        pattern: {
                                            value: /^\d*(\.\d{0,2})?$/i,
                                            message: "please enter digit only.",
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1.5}
                                            sx={(t) => ({
                                                px: 2,
                                                py: 1.5,
                                                borderRadius: 2,
                                                border: `1px solid ${error ? t.palette.error.main : t.palette.divider}`,
                                                background: t.palette.background.paper
                                            })}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={() => onChange(String(Math.max(0, (parseInt(value) || 0) - 1)))}
                                                sx={(t) => ({
                                                    width: 32,
                                                    height: 32,
                                                    border: `1px solid ${t.palette.divider}`,
                                                    borderRadius: '8px',
                                                    '&:hover': {
                                                        borderColor: t.palette.error.main,
                                                        color: t.palette.error.main,
                                                        background: alpha(t.palette.error.main, 0.06)
                                                    }
                                                })}
                                            >
                                                <MinusCirlce size={16} />
                                            </IconButton>

                                            <TextField
                                                label="Extra Hours"
                                                variant="outlined"
                                                size="small"
                                                name="extrahours"
                                                value={value || ''}
                                                onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                                inputProps={{ style: { textAlign: 'center', fontWeight: 700 } }}
                                                sx={{ flex: 1 }}
                                            />

                                            <IconButton
                                                size="small"
                                                onClick={() => onChange(String((parseInt(value) || 0) + 1))}
                                                sx={(t) => ({
                                                    width: 32,
                                                    height: 32,
                                                    border: `1px solid ${t.palette.divider}`,
                                                    borderRadius: '8px',
                                                    '&:hover': {
                                                        borderColor: t.palette.primary.main,
                                                        color: t.palette.primary.main,
                                                        background: alpha(t.palette.primary.main, 0.06)
                                                    }
                                                })}
                                            >
                                                <AddCircle size={16} />
                                            </IconButton>
                                        </Stack>
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <SectionLabel>Minutes</SectionLabel>
                                <Controller
                                    name="minutes"
                                    rules={{ required: 'Minutes is required', pattern: { value: /^[0-9]+$/, message: 'Enter a valid number of minutes' } }}
                                    control={control}
                                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                        <TextField
                                            type="text"
                                            label="Minutes"
                                            variant="outlined"
                                            fullWidth
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            InputProps={{
                                                startAdornment: (
                                                    <Box sx={{ mr: 0.75, display: 'flex', alignItems: 'center' }}>
                                                        <Clock size={18} color={theme.palette.text.disabled} />
                                                    </Box>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* ── Footer Actions ───────────────────────────────────── */}
                    <Box
                        sx={(t) => ({
                            px: 3,
                            py: 2,
                            borderTop: `1px solid ${t.palette.divider}`,
                            background: alpha(t.palette.action.hover, 0.02),
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1.5
                        })}
                    >
                        <Button type="button" variant="outlined" color="secondary" onClick={cancelHandler} sx={{ minWidth: 100 }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
                            sx={(t) => ({
                                minWidth: 140,
                                boxShadow: `0 4px 14px ${alpha(t.palette.primary.main, 0.35)}`,
                                '&:hover': { boxShadow: `0 6px 20px ${alpha(t.palette.primary.main, 0.5)}` }
                            })}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Box>
                </MainCard>
            </form>
        </>
    );
};

export default AddPastMembership;
