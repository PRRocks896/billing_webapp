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
    MenuItem,
    FormHelperText,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';

// project components
import MainCard from 'components/MainCard';
import FileUpload from 'components/FileUpload';

// Icons
import {
    ArrowLeft,
    Save2,
    Tag2,
    Key,
    Hashtag,
    DocumentText,
    Gallery,
    Edit2,
    PercentageSquare,
} from 'iconsax-reactjs';

import UseAddEditPromoCode from "./hooks/useAddEditPromoCode";

const DISCOUNT_TYPES = ['Percentage', 'Flat'] as const;

const AddEditPromoCode = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        control,
        isSubmitting,
        onSubmit,
        watch,
        setValue,
        getValues,
        handleBack,
        handleSubmit,
    } = UseAddEditPromoCode();

    const selectedType = watch('type');

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
                            <Tag2 size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Manage discount codes and their applicable values.
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
                        {/* ── Left Column: Core Details ───────────────────────── */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Stack spacing={4}>
                                {/* Section 1: Basic Info */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Edit2 size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Basic Information</Typography>
                                    </Stack>
                                    <Grid container spacing={3}>
                                        {/* Promo Code Name */}
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name="name"
                                                control={control}
                                                rules={{ required: "Promo Code Name is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Promo Code Name"
                                                        placeholder="Enter promo code name"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Edit2 size={18} color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        {/* Promo Code */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="code"
                                                control={control}
                                                rules={{ required: "Promo Code is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Promo Code"
                                                        placeholder="e.g. SAVE20"
                                                        error={!!error}
                                                        helperText={error?.message}
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

                                        {/* Discount Type */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="type"
                                                control={control}
                                                rules={{ required: "Discount Type is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel id="promo-type-label">Discount Type</InputLabel>
                                                        <Select
                                                            {...field}
                                                            labelId="promo-type-label"
                                                            label="Discount Type"
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <Hashtag size={18} color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            }
                                                        >
                                                            {DISCOUNT_TYPES.map((type) => (
                                                                <MenuItem key={type} value={type}>
                                                                    {type}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {error && <FormHelperText>{error.message}</FormHelperText>}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>

                                        {/* Discount Value */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="value"
                                                control={control}
                                                rules={{
                                                    required: "Discount Value is required",
                                                    min: { value: 0, message: "Value must be at least 0" },
                                                    ...(selectedType === 'Percentage' && {
                                                        max: { value: 100, message: "Percentage value cannot exceed 100" },
                                                    }),
                                                }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        type="number"
                                                        label="Discount Value"
                                                        placeholder={selectedType === 'Percentage' ? "e.g. 20 (max 100)" : "e.g. 50"}
                                                        error={!!error}
                                                        helperText={error?.message || (selectedType === 'Percentage' ? "Enter a value between 0 – 100" : undefined)}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PercentageSquare size={18} color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: selectedType ? (
                                                                <InputAdornment position="end">
                                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                        {selectedType === 'Percentage' ? '%' : '₹'}
                                                                    </Typography>
                                                                </InputAdornment>
                                                            ) : undefined,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider sx={{ borderStyle: 'dashed' }} />

                                {/* Section 2: Description */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <DocumentText size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Description</Typography>
                                    </Stack>
                                    <Controller
                                        name="description"
                                        control={control}
                                        // rules={{ required: "Description is required" }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Promo Code Description"
                                                placeholder="Describe the promo code, terms, and conditions..."
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Box>
                            </Stack>
                        </Grid>

                        {/* ── Right Column: Visual Assets ───────────────────────── */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Gallery size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Promo Banner</Typography>
                                    </Stack>

                                    <Box sx={{ p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                                        <Controller
                                            name="image"
                                            control={control}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FileUpload
                                                    value={value}
                                                    onChange={onChange}
                                                    label="Upload Promo Banner Image"
                                                    error={!!error}
                                                    helperText={error?.message || "This image will be shown alongside the promo code."}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ mt: 4, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2, border: `1px dashed ${alpha(theme.palette.info.main, 0.2)}` }}>
                                        <Typography variant="subtitle2" color="info.main" gutterBottom sx={{ fontWeight: 700 }}>Pro Tip</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: 'block' }}>
                                            Use <strong>Percentage</strong> for relative discounts (max 100%). Use <strong>Flat</strong> for fixed amount deductions.
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
                        {isSubmitting ? 'Processing...' : mode === 'add' ? 'Add Promo Code' : 'Update Promo Code'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    )
}

export default AddEditPromoCode;