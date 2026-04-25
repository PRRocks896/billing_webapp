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
    IconButton,
} from '@mui/material';

// project components
import MainCard from 'components/MainCard';

// Icons
import {
    ArrowLeft,
    Save2,
    Building3,
    Key,
    Setting2,
    AddCircle,
    MinusCirlce,
    CardEdit,
    TableDocument,
} from 'iconsax-reactjs';

import UseAddEditPaymentBank from "./hooks/useAddEditPaymentBank";

const AddEditPaymentBank = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        fields,
        control,
        companyList,
        isSubmitting,
        onSubmit,
        handleAdd,
        handleBack,
        handleRemove,
        handleSubmit,
    } = UseAddEditPaymentBank();

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
                            <Building3 size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Configure bank details and integration parameters for seamless payments.
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
                        {/* ── Left Column: Bank Detail & Dynamic Config ────────────────── */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Stack spacing={4}>
                                {/* Section 1: Banking Core */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <CardEdit size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Banking Core</Typography>
                                    </Stack>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="bankName"
                                                control={control}
                                                rules={{ required: "Bank Name is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Bank Name"
                                                        placeholder="e.g. HDFC Bank, Stripe, etc."
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Building3 size={18} color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="companyID"
                                                control={control}
                                                rules={{ required: "Company is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <Autocomplete
                                                        fullWidth
                                                        options={companyList}
                                                        value={companyList.find((company) => company.id === field.value) || null}
                                                        getOptionLabel={(option) => option.companyName}
                                                        onChange={(_event, newValue) => field.onChange(newValue?.id || null)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Associate Company"
                                                                placeholder="Select company..."
                                                                error={!!error}
                                                                helperText={error?.message}
                                                            />
                                                        )}
                                                        renderOption={(props, option) => (
                                                            <li {...props} key={option.id}>
                                                                {option.companyName}
                                                            </li>
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider sx={{ borderStyle: 'dashed' }} />

                                {/* Section 2: Configuration Parameters */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Setting2 size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Configuration Parameters</Typography>
                                    </Stack>

                                    <Stack spacing={2.5}>
                                        {fields.map((item, index) => (
                                            <Box
                                                key={item.id}
                                                sx={{
                                                    p: 2.5,
                                                    borderRadius: 2,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.01),
                                                    position: 'relative',
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.main,
                                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`
                                                    },
                                                    transition: 'all 0.2s ease-in-out'
                                                }}
                                            >
                                                <Grid container spacing={3} alignItems="center">
                                                    <Grid size={{ xs: 12, sm: 5 }}>
                                                        <Controller
                                                            name={`value.${index}.key`}
                                                            control={control}
                                                            rules={{ required: "Key is required" }}
                                                            render={({ field, fieldState: { error } }) => (
                                                                <TextField
                                                                    {...field}
                                                                    fullWidth
                                                                    size="small"
                                                                    label="Integration Key"
                                                                    placeholder="e.g. API_KEY, MERCHANT_ID"
                                                                    error={!!error}
                                                                    helperText={error?.message}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <Key size={16} color={theme.palette.text.disabled} />
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 5.5 }}>
                                                        <Controller
                                                            name={`value.${index}.value`}
                                                            control={control}
                                                            rules={{ required: "Value is required" }}
                                                            render={({ field, fieldState: { error } }) => (
                                                                <TextField
                                                                    {...field}
                                                                    fullWidth
                                                                    size="small"
                                                                    label="Parameter Value"
                                                                    placeholder="Enter value..."
                                                                    error={!!error}
                                                                    helperText={error?.message}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 1.5 }}>
                                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                            {fields.length > 1 && (
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() => handleRemove(index)}
                                                                    sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) } }}
                                                                >
                                                                    <MinusCirlce size={20} variant="Bulk" />
                                                                </IconButton>
                                                            )}
                                                            {fields.length === index + 1 && (
                                                                <IconButton
                                                                    color="primary"
                                                                    onClick={handleAdd}
                                                                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) } }}
                                                                >
                                                                    <AddCircle size={20} variant="Bulk" />
                                                                </IconButton>
                                                            )}
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Grid>

                        {/* ── Right Column: Visual Info/Tips ───────────────────────── */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <TableDocument size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Integration Guide</Typography>
                                    </Stack>

                                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 3, border: `1px dashed ${alpha(theme.palette.info.main, 0.2)}` }}>
                                        <Typography variant="subtitle2" color="info.main" gutterBottom sx={{ fontWeight: 700 }}>Pro Tip</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>
                                            Integration keys are used to link this bank with your external payment processors. Double-check your Merchant ID and Secret Keys before saving.
                                        </Typography>
                                        <Divider sx={{ my: 2, borderStyle: 'dotted' }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>
                                            Associating the correct company ensures that payment reports are accurately attributed in your billing system.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
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
                        {isSubmitting ? 'Processing...' : mode === 'add' ? 'Save Bank' : 'Update Bank'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditPaymentBank;