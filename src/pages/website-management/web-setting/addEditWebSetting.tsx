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
    Chip,
} from '@mui/material';

// project components
import MainCard from 'components/MainCard';
import FileUpload from 'components/FileUpload';
import { generateSlug } from 'utils/helper';

// Icons
import {
    ArrowLeft,
    Key,
    Link,
    DocumentText,
    Image,
    Save2,
    InfoCircle,
    Setting2,
} from 'iconsax-reactjs';

import UseAddEditWebSetting from "./hooks/useAddEditWebSetting";

const AddEditWebSetting = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        control,
        isSubmitting,
        onSubmit,
        setValue,
        getValues,
        handleBack,
        handleSubmit,
    } = UseAddEditWebSetting();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}`, maxWidth: 1200, margin: '0 auto' }}>
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
                            <Setting2 size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Global system parameters and branding assets for the public platform.
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
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Grid container spacing={4}>
                                {/* ── Section 1: Configuration Metadata ──────────────── */}
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Key size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Configuration Metadata</Typography>
                                    </Stack>

                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="identifier"
                                                control={control}
                                                rules={{ required: "Identifier is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Identifier Key"
                                                        placeholder="E.g. SITE_LOGO"
                                                        error={!!error}
                                                        helperText={error?.message || "Used by engineers to query this setting"}
                                                        onChange={(e) => {
                                                            const val = e.target.value.toUpperCase().replace(/\s+/g, '_');
                                                            field.onChange(val);
                                                            setValue("slug", generateSlug(val.toLowerCase()));
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Setting2 size={18} variant="Bulk" color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="slug"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        disabled
                                                        label="System Slug"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Link size={18} variant="Bulk" color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid size={{ xs: 12 }}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                                {/* ── Section 2: Data Content ─────────────────── */}
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <DocumentText size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Data Content</Typography>
                                    </Stack>

                                    <Controller
                                        name="value"
                                        control={control}
                                        rules={{
                                            validate: (val) => {
                                                const img = getValues("image");
                                                const hasImage = Array.isArray(img) ? img.length > 0 : !!img;
                                                if (!val && !hasImage) {
                                                    return "Required: Either provide a text value or upload a media asset.";
                                                }
                                                return true;
                                            }
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Configuration Value / Text Payload"
                                                placeholder="Enter text, JSON, or any structural data payload..."
                                                error={!!error}
                                                helperText={error?.message || "This value will be ignored if an image is uploaded below."}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    if (e.target.value) {
                                                        setValue("image", "");
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* ── Section 3: Branding Asset ─────────────────────── */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <Image size={22} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Branding Asset</Typography>
                            </Stack>

                            <Box sx={{ p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                                <Controller
                                    name="image"
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Stack spacing={2}>
                                            <FileUpload
                                                label="Upload Media"
                                                value={value}
                                                onChange={(files) => {
                                                    onChange(files);
                                                    if (files && (Array.isArray(files) ? files.length > 0 : !!files)) {
                                                        setValue("value", "");
                                                    }
                                                }}
                                                error={!!error}
                                            />
                                            {error && <Typography variant="caption" color="error">{error.message}</Typography>}
                                        </Stack>
                                    )}
                                />

                                <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2, border: `1px dashed ${alpha(theme.palette.info.main, 0.2)}` }}>
                                    <Stack direction="row" spacing={1.5}>
                                        <InfoCircle size={20} color={theme.palette.info.main} variant="Bulk" />
                                        <Typography variant="caption" color="info.main" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                                            Images take precedence over text values. Loading an image will clear the text payload above.
                                        </Typography>
                                    </Stack>
                                </Box>
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
                        {isSubmitting ? 'Processing...' : mode === 'add' ? 'Save' : 'Update'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditWebSetting;