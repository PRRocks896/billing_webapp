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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from '@mui/material';

// project components
import MainCard from 'components/MainCard';
import FileUpload from 'components/FileUpload';
import ReactQuill from 'components/third-party/ReactQuill';

// Icons
import {
    ArrowLeft,
    Save2,
    Box1,
    DocumentText,
    Category,
    InfoCircle,
    Gallery,
    VideoPlay,
    Edit2,
    Link,
} from 'iconsax-reactjs';

import useAddEditHomePage from "./hooks/useAddEditHomePage";

const AddEditHomePage = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
    } = useAddEditHomePage();

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
                            <Box1 size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Manage content blocks, banners, and narratives for the platform's landing page.
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
                        {/* ── Left Column: Content & Details ─────────────────────── */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Stack spacing={4}>
                                {/* Section 1: Basic Identity */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Edit2 size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Identity & Classification</Typography>
                                    </Stack>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <Controller
                                                name="title"
                                                control={control}
                                                rules={{ required: "Title is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Content Title"
                                                        placeholder="e.g. Exclusive Laundry Services"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.value.toUpperCase());
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <DocumentText size={18} color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Controller
                                                name="tag"
                                                control={control}
                                                rules={{ required: "Please select a tag" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel id="tag-label">Content Tag / Placement</InputLabel>
                                                        <Select
                                                            {...field}
                                                            labelId="tag-label"
                                                            label="Content Tag / Placement"
                                                            startAdornment={
                                                                <InputAdornment position="start" sx={{ mr: 1 }}>
                                                                    <Category size={18} color={theme.palette.text.disabled} />
                                                                </InputAdornment>
                                                            }
                                                        >
                                                            <MenuItem value="banner">Banner</MenuItem>
                                                            <MenuItem value="service">Service</MenuItem>
                                                            <MenuItem value="aboutUs">About Us</MenuItem>
                                                            <MenuItem value="membershipPlan">Membership Plan</MenuItem>
                                                            <MenuItem value="testimony">Testimony</MenuItem>
                                                            <MenuItem value="city">City</MenuItem>
                                                            <MenuItem value="story">Story</MenuItem>
                                                            <MenuItem value="standard">Standard</MenuItem>
                                                            <MenuItem value="getOurService">Get Our Service</MenuItem>
                                                            <MenuItem value="faq">FAQ</MenuItem>
                                                        </Select>
                                                        {error && <FormHelperText>{error.message}</FormHelperText>}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name="detail"
                                                control={control}
                                                rules={{ required: "Brief details are required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        label="Brief Summary / Detail"
                                                        placeholder="Provide a short hook or summary for this section..."
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider sx={{ borderStyle: 'dashed' }} />

                                {/* Section 2: Narrative Content */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <InfoCircle size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Narrative Insight</Typography>
                                    </Stack>
                                    <Controller
                                        name="description"
                                        control={control}
                                        rules={{ required: "Description is required" }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <Stack spacing={1}>
                                                <ReactQuill
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder="Draft the detailed narrative content here..."
                                                />
                                                {error && <FormHelperText error>{error.message}</FormHelperText>}
                                            </Stack>
                                        )}
                                    />
                                </Box>
                            </Stack>
                        </Grid>

                        {/* ── Right Column: Media Assets ─────────────────────────── */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Gallery size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Visual & Motion Media</Typography>
                                    </Stack>

                                    <Stack spacing={3}>
                                        <Box sx={{ p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Primary Hero Image</Typography>
                                            <Controller
                                                name="image"
                                                control={control}
                                                rules={{ required: "Image is required" }}
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <FileUpload
                                                        value={value}
                                                        onChange={onChange}
                                                        label="Upload Feature Image"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Box>

                                        <Box sx={{ p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.secondary.main, 0.01) }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Supporting Video (Optional)</Typography>
                                                <VideoPlay size={20} variant="Bulk" color={theme.palette.secondary.main} />
                                            </Stack>
                                            <Controller
                                                name="video"
                                                control={control}
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <FileUpload
                                                        value={value}
                                                        onChange={onChange}
                                                        label="Upload Video Asset"
                                                        error={!!error}
                                                        helperText={error?.message || "Supported: .mp4, .mov (Max 50MB)"}
                                                        accept="video/*"
                                                    />
                                                )}
                                            />
                                        </Box>
                                    </Stack>

                                    <Box sx={{ mt: 4, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 2, border: `1px dashed ${alpha(theme.palette.warning.main, 0.2)}` }}>
                                        <Stack direction="row" spacing={1.5}>
                                            <InfoCircle size={20} color={theme.palette.warning.main} variant="Bulk" />
                                            <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                                                Ensure high-resolution media for the best hero-section experience. Recommended image ratio: 16:9.
                                            </Typography>
                                        </Stack>
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
                        {isSubmitting ? 'Syncing...' : mode === 'add' ? 'Publish Content' : 'Update Content'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditHomePage;