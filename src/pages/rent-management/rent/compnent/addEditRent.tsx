import { Controller } from 'react-hook-form';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// project components
import MainCard from 'components/MainCard';
import FileUpload from 'components/FileUpload';

// hooks && utils
import UseAddEditRent from "../hooks/useAddEditRent";
import {
    ArrowLeft,
    Home2,
    ReceiptItem,
    Bank,
    Gallery,
    Personalcard,
    ShieldTick,
    PercentageCircle,
    TrendUp,
    Calendar,
} from 'iconsax-reactjs';
import { GST_REGEX } from 'utils/constant';

const AddEditRent = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        control,
        ifscVerified,
        isSubmitting,
        onSubmit,
        setValue,
        handleBack,
        handleSubmit,
        handleIfscVerify,
    } = UseAddEditRent();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <MainCard
                content={false}
                sx={{
                    overflow: 'visible',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '16px',
                    boxShadow: (t: any) => t.customShadows?.z1 || 1,
                }}
            >
                {/* ── Hero Header ──────────────────────────────────────── */}
                <Box
                    sx={{
                        px: 3,
                        py: 3.5,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '14px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}
                        >
                            <Home2 size={24} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
                                {title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Configure rent, payment cycles and bank details.
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ borderRadius: '10px', px: 2 }}
                    >
                        Back to List
                    </Button>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={4}>

                        {/* ── LEFT COLUMN ─────────────────────────────────── */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Grid container spacing={4}>

                                {/* Section 1: Basic Information */}
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                        <Personalcard size={20} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={600}>Basic Information</Typography>
                                    </Stack>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name='ownerName'
                                                control={control}
                                                rules={{ required: 'Owner name is required' }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <TextField
                                                        label='Owner Name'
                                                        fullWidth
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name='panCard'
                                                control={control}
                                                rules={{
                                                    required: 'Pan card is required',
                                                    validate: (value) => {
                                                        const panCardRegex = /^([A-Z]{5}[0-9]{4}[A-Z]{1})$/;
                                                        if (!panCardRegex.test(value)) return 'Invalid pan card number';
                                                        return true;
                                                    }
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <TextField
                                                        label='Pan Card'
                                                        fullWidth
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name='rentAmount'
                                                control={control}
                                                rules={{
                                                    required: 'Rent amount is required',
                                                    pattern: { value: /^[0-9]+$/, message: 'Rent amount must be a number' }
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <TextField
                                                        label='Rent Amount'
                                                        fullWidth
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Typography variant="body2" color="text.secondary" fontWeight={700}>₹</Typography>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid size={{ xs: 12 }}><Divider /></Grid>

                                {/* Section 2: TDS / GST Information */}
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                        <PercentageCircle size={20} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={600}>TDS / GST Information</Typography>
                                    </Stack>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name='tds'
                                                control={control}
                                                rules={{
                                                    required: 'TDS is required',
                                                    pattern: { value: /^[0-9]+$/, message: 'TDS must be a number' }
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <TextField
                                                        label='TDS %'
                                                        fullWidth
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name='gst'
                                                control={control}
                                                rules={{
                                                    required: 'GST is required',
                                                    pattern: { value: /^[0-9]+$/, message: 'GST must be a number' },
                                                    min: { value: 1, message: 'GST must be at least 1' },
                                                    max: { value: 100, message: 'GST must be at most 100' }
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <TextField
                                                        label='GST %'
                                                        fullWidth
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name="gstNo"
                                                control={control}
                                                rules={{
                                                    required: 'GST No is required',
                                                    pattern: { value: GST_REGEX, message: 'Invalid GST No' }
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <TextField
                                                        label='GST No'
                                                        fullWidth
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid size={{ xs: 12 }}><Divider /></Grid>

                                {/* Section 3: Future Rent Details */}
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                        <TrendUp size={20} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={600}>Future Rent Details</Typography>
                                    </Stack>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Controller
                                                name="incrementPercentage"
                                                control={control}
                                                rules={{
                                                    required: "Increment percentage is required",
                                                    pattern: { value: /^[0-9]+$/, message: "Increment percentage must be a number" },
                                                    min: { value: 1, message: "Increment percentage must be at least 1" },
                                                    max: { value: 100, message: "Increment percentage must be at most 100" }
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <TextField
                                                        label="Increment Percentage"
                                                        fullWidth
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Controller
                                                name="maintenance"
                                                control={control}
                                                rules={{
                                                    required: "Maintenance amount is required",
                                                    pattern: { value: /^[0-9]+$/, message: "Maintenance amount must be a number" },
                                                    min: { value: 1, message: "Maintenance amount must be at least 1" }
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <TextField
                                                        label="Maintenance Amount"
                                                        fullWidth
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Typography variant="body2" color="text.secondary" fontWeight={700}>₹</Typography>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* ── RIGHT COLUMN ─────────────────────────────────── */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                <Calendar size={20} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={600}>Agreement Details</Typography>
                            </Stack>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='agreementDate'
                                        control={control}
                                        rules={{ required: 'Agreement date is required' }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    format="dd/MM/yyyy"
                                                    value={value}
                                                    onChange={onChange}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            label: 'Agreement Date',
                                                            error: !!error,
                                                            helperText: error?.message,
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='agreementExpireDate'
                                        control={control}
                                        rules={{ required: 'Agreement expire date is required' }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    format="dd/MM/yyyy"
                                                    value={value}
                                                    onChange={onChange}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            label: 'Agreement Expire Date',
                                                            error: !!error,
                                                            helperText: error?.message,
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                        <Gallery size={18} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Agreement PDF  (optional)</Typography>
                                    </Stack>
                                    <Controller
                                        name='agreementPdf'
                                        control={control}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <FileUpload
                                                value={value || undefined}
                                                onChange={onChange}
                                                accept="application/pdf"
                                                // label="Agreement PDF (optional)"
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider /></Grid>

                        {/* ── Section: Bank Details ──────────────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 3, border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`, mb: 3 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box sx={{ p: 1, bgcolor: theme.palette.primary.main, borderRadius: 1.5, display: 'flex', color: '#fff' }}>
                                        <Bank size={20} variant="Bold" />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700}>Bank Details</Typography>
                                        <Typography variant="caption" color="text.secondary">Primary bank account for rent transfers.</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Controller
                                        name='bankDetails.holderName'
                                        control={control}
                                        rules={{ required: 'Account holder name is required' }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                type='text'
                                                label="Account Holder Name"
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Controller
                                        name='bankDetails.accountNumber'
                                        control={control}
                                        rules={{ required: 'Account number is required' }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                type='text'
                                                label="Account Number"
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Controller
                                        name='bankDetails.ifscCode'
                                        control={control}
                                        rules={{
                                            required: 'IFSC code is required',
                                            pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Invalid IFSC format (e.g. SBIN0001234)' },
                                            validate: (value) => handleIfscVerify(value, 'bankDetails.ifscCode')
                                        }}
                                        render={({ field: { value, onChange, onBlur, ref }, fieldState: { error, isValidating } }) => (
                                            <TextField
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                inputRef={ref}
                                                fullWidth
                                                label="IFSC Code"
                                                placeholder="e.g. SBIN0001234"
                                                error={!!error}
                                                helperText={
                                                    error?.message ||
                                                    (ifscVerified === true ? '✓ IFSC verified successfully' : '')
                                                }
                                                FormHelperTextProps={{
                                                    sx: { color: !error && ifscVerified === true ? 'success.main' : undefined }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Bank size={18} color={theme.palette.text.disabled} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {isValidating ? (
                                                                <Tooltip title="Verifying IFSC...">
                                                                    <CircularProgress size={18} />
                                                                </Tooltip>
                                                            ) : ifscVerified === true ? (
                                                                <Tooltip title="IFSC Verified">
                                                                    <ShieldTick size={20} variant="Bold" color={theme.palette.success.main} />
                                                                </Tooltip>
                                                            ) : ifscVerified === false ? (
                                                                <Tooltip title="IFSC Not Found">
                                                                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <Typography variant="caption" sx={{ color: '#fff', lineHeight: 1, fontWeight: 700 }}>✕</Typography>
                                                                    </Box>
                                                                </Tooltip>
                                                            ) : null}
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider /></Grid>

                        {/* ── Section: Maintenance Account Details ──────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.04), borderRadius: 3, border: `1px dashed ${alpha(theme.palette.warning.main, 0.3)}`, mb: 3 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box sx={{ p: 1, bgcolor: theme.palette.warning.main, borderRadius: 1.5, display: 'flex', color: '#fff' }}>
                                        <ReceiptItem size={20} variant="Bold" />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700}>Maintenance Account</Typography>
                                        <Typography variant="caption" color="text.secondary">Separate account for maintenance fee transfers.</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Controller
                                        name='maintenanceAccount.holderName'
                                        control={control}
                                        rules={{ required: 'Account holder name is required' }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                type='text'
                                                label="Account Holder Name"
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Controller
                                        name='maintenanceAccount.accountNumber'
                                        control={control}
                                        rules={{ required: 'Account number is required' }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                type='text'
                                                label="Account Number"
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Controller
                                        name='maintenanceAccount.ifscCode'
                                        control={control}
                                        rules={{
                                            required: 'IFSC code is required',
                                            pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Invalid IFSC format (e.g. SBIN0001234)' },
                                            validate: (value) => handleIfscVerify(value, 'maintenanceAccount.ifscCode')
                                        }}
                                        render={({ field: { value, onChange, onBlur, ref }, fieldState: { error, isValidating } }) => (
                                            <TextField
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                inputRef={ref}
                                                fullWidth
                                                label="IFSC Code"
                                                placeholder="e.g. SBIN0001234"
                                                error={!!error}
                                                helperText={
                                                    error?.message ||
                                                    (ifscVerified === true ? '✓ IFSC verified successfully' : '')
                                                }
                                                FormHelperTextProps={{
                                                    sx: { color: !error && ifscVerified === true ? 'success.main' : undefined }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Bank size={18} color={theme.palette.text.disabled} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {isValidating ? (
                                                                <Tooltip title="Verifying IFSC...">
                                                                    <CircularProgress size={18} />
                                                                </Tooltip>
                                                            ) : ifscVerified === true ? (
                                                                <Tooltip title="IFSC Verified">
                                                                    <ShieldTick size={20} variant="Bold" color={theme.palette.success.main} />
                                                                </Tooltip>
                                                            ) : ifscVerified === false ? (
                                                                <Tooltip title="IFSC Not Found">
                                                                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <Typography variant="caption" sx={{ color: '#fff', lineHeight: 1, fontWeight: 700 }}>✕</Typography>
                                                                    </Box>
                                                                </Tooltip>
                                                            ) : null}
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
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
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        sx={{ minWidth: 100, borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            minWidth: 140,
                            borderRadius: 2,
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
                            '&:hover': {
                                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {isSubmitting ? 'Processing...' : mode === 'add' ? 'Create Record' : 'Update Record'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditRent;