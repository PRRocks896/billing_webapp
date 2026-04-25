import { Controller } from 'react-hook-form';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
    Button,
    Grid,
    Stack,
    TextField,
    Typography,
    Box,
    Divider,
    InputAdornment,
    Autocomplete,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    FormHelperText,
} from '@mui/material';

// project components
import MainCard from 'components/MainCard';

// Icons
import {
    ArrowLeft,
    Save2,
    Calendar,
    Money,
    Key,
    User,
    UserTick,
    Wallet,
    DocumentText,
} from 'iconsax-reactjs';

import UseAddEditAdvance from "./hooks/useAddEditAdvance";

const AddEditAdvance = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        control,
        staffOption,
        isSubmitting,
        paymentOption,
        managerOption,
        onSubmit,
        handleBack,
        handleSubmit,
    } = UseAddEditAdvance();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}`, maxWidth: 1400, margin: '0 auto' }}>
                {/* ── Integrated Hero Header ───────────────────────────────── */}
                <Box
                    sx={{
                        px: 3,
                        py: 3.5,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: '16px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                            }}
                        >
                            <Money size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Efficiently manage staff advance requests and financial disbursements.
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        startIcon={<ArrowLeft size={18} />}
                        sx={{ borderRadius: '10px', height: 42, px: 2 }}
                    >
                        Back to List
                    </Button>
                </Box>

                <Box sx={{ p: { xs: 3, md: 5 } }}>
                    <Grid container spacing={5}>
                        {/* ── Left Column: Advance Core Details ──────────────────── */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Stack spacing={4}>
                                {/* Section 1: Advance Core */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <DocumentText size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Advance Details</Typography>
                                    </Stack>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="date"
                                                control={control}
                                                rules={{ required: "Date is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        type="date"
                                                        label="Disbursement Date"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Calendar size={18} color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="amount"
                                                control={control}
                                                rules={{
                                                    required: "Amount is required",
                                                    pattern: {
                                                        value: /^\d*(\.\d{0,2})?$/i,
                                                        message: "Please enter a valid amount",
                                                    }
                                                }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        type="text"
                                                        label="Advance Amount"
                                                        placeholder="0.00"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Money size={18} color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name="permissionName"
                                                control={control}
                                                rules={{ required: "Permission name is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Permission/Reference Name"
                                                        placeholder="e.g. APPROVED BY DIRECTOR"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Key size={18} color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider sx={{ borderStyle: 'dashed' }} />

                                {/* Section 2: Stakeholders */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <UserTick size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Stakeholders & Disbursement</Typography>
                                    </Stack>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="staffID"
                                                control={control}
                                                rules={{ required: "Staff is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <Autocomplete
                                                        fullWidth
                                                        options={staffOption || []}
                                                        getOptionLabel={(option) => option.nickName || ''}
                                                        isOptionEqualToValue={(option, value) => option?.id === value}
                                                        value={staffOption?.find((option) => option.id === field.value) || null}
                                                        onChange={(_event, value) => field.onChange(value?.id || null)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Staff Member"
                                                                placeholder="Search staff..."
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <>
                                                                            <InputAdornment position="start">
                                                                                <User size={18} color={theme.palette.text.disabled} />
                                                                            </InputAdornment>
                                                                            {params.InputProps.startAdornment}
                                                                        </>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="managerID"
                                                control={control}
                                                rules={{ required: "Manager is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <Autocomplete
                                                        fullWidth
                                                        options={managerOption || []}
                                                        getOptionLabel={(option) => option.nickName || ''}
                                                        isOptionEqualToValue={(option, value) => option?.id === value}
                                                        value={managerOption?.find((option) => option.id === field.value) || null}
                                                        onChange={(_event, value) => field.onChange(value?.id || null)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Approving Manager"
                                                                placeholder="Search manager..."
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <>
                                                                            <InputAdornment position="start">
                                                                                <UserTick size={18} color={theme.palette.text.disabled} />
                                                                            </InputAdornment>
                                                                            {params.InputProps.startAdornment}
                                                                        </>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name="paymentID"
                                                control={control}
                                                rules={{ required: "Payment source is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel id="payment-source-label">Paid By (Payment Type)</InputLabel>
                                                        <Select
                                                            {...field}
                                                            labelId="payment-source-label"
                                                            label="Paid By (Payment Type)"
                                                            startAdornment={
                                                                <InputAdornment position="start" sx={{ ml: 1 }}>
                                                                    <Wallet size={18} color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            }
                                                        >
                                                            {paymentOption?.map((res) => (
                                                                <MenuItem key={res.id} value={res.id} sx={{ textTransform: 'capitalize' }}>
                                                                    {res.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {error && <FormHelperText>{error.message}</FormHelperText>}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Stack>
                        </Grid>

                        {/* ── Right Column: Info & Summary ───────────────────────── */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 3, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Money size={20} color={theme.palette.primary.main} variant="Bulk" />
                                    Advance Summary
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Review the disbursement details before saving. Advances will be deducted from the staff's future salary.
                                </Typography>

                                <Stack spacing={2}>
                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', border: `1px solid ${theme.palette.divider}` }}>
                                        <Typography variant="caption" color="text.secondary" display="block">Deduction Method</Typography>
                                        <Typography variant="body1" fontWeight={600}>Salary Adjustment</Typography>
                                    </Box>
                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', border: `1px solid ${theme.palette.divider}` }}>
                                        <Typography variant="caption" color="text.secondary" display="block">Compliance</Typography>
                                        <Typography variant="body2" color="text.secondary">Ensure you have signed physical documentation for this advance request.</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* ── Footer Actions ───────────────────────────────────── */}
                <Box
                    sx={{
                        p: 3,
                        bgcolor: alpha(theme.palette.secondary.main, 0.02),
                        borderTop: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        borderRadius: '0 0 16px 16px'
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        sx={{ minWidth: 120, borderRadius: 2, height: 48, fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={!isSubmitting && <Save2 size={20} variant="Bold" />}
                        sx={{
                            minWidth: 180,
                            height: 48,
                            borderRadius: 2,
                            fontWeight: 700,
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`
                        }}
                    >
                        {isSubmitting ? 'Processing...' : mode === 'add' ? 'Save Advance' : 'Update Advance'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditAdvance;