import { Controller } from 'react-hook-form';
import AceEditor from "react-ace";

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
    Chip,
    FormHelperText,
} from '@mui/material';

// project components
import MainCard from 'components/MainCard';
import FileUpload from 'components/FileUpload';

// Icons
import {
    ArrowLeft,
    Save2,
    Global,
    SearchNormal,
    Key,
    Hashtag,
    DocumentText,
    Gallery,
    Edit2,
    Link,
} from 'iconsax-reactjs';

import useAddEditSeoHook from "./hooks/useAddEditSeo";
import { generateSlug } from 'utils/helper';

const generateUrl = (value: string) => {
    return value.trim().toLowerCase().replace(/\s+/g, '-') || "";
};

const AddEditSeo = () => {
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
    } = useAddEditSeoHook();

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
                            <Global size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Optimize how your platform appears in search results and social previews.
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
                        {/* ── Left Column: SEO Content & Data ───────────────────── */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Stack spacing={4}>
                                {/* Section 1: Visibility Hub */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <SearchNormal size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Visibility Strategy</Typography>
                                    </Stack>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name="title"
                                                control={control}
                                                rules={{ required: "Seo Title is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Page Metadata Title"
                                                        placeholder="e.g. Best Laundry Services in New York | OurBrand"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.value);
                                                            // setValue("slug", generateSlug(e.target.value));
                                                            // setValue("pagePath", generateUrl(e.target.value));
                                                        }}
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
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="slug"
                                                control={control}
                                                rules={{ required: "Slug is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="System Slug"
                                                        placeholder="page_identifier"
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
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="pagePath"
                                                control={control}
                                                rules={{ required: "Page Path is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Canonical Page Path"
                                                        placeholder="/services/laundry-care"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Link size={18} color={theme.palette.text.disabled} />
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

                                {/* Section 2: Indexing Metadata */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Hashtag size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Indexing & Semantics</Typography>
                                    </Stack>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="tags"
                                                control={control}
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <Autocomplete
                                                        multiple
                                                        freeSolo
                                                        options={[]}
                                                        value={value || []}
                                                        onChange={(_event, newValue) => {
                                                            const processedValue = newValue.reduce((acc: string[], curr: string) => {
                                                                if (curr.includes(',')) {
                                                                    return [...acc, ...curr.split(',').map((v) => v.trim()).filter((v) => v)];
                                                                }
                                                                return [...acc, curr.trim()].filter((v) => v);
                                                            }, []);
                                                            onChange(Array.from(new Set(processedValue)));
                                                        }}
                                                        renderTags={(tagValue, getTagProps) =>
                                                            tagValue.map((option, index) => (
                                                                <Chip
                                                                    label={option}
                                                                    {...getTagProps({ index })}
                                                                    color="primary"
                                                                    variant="light"
                                                                    size="small"
                                                                />
                                                            ))
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Search Tags"
                                                                placeholder="Add tag..."
                                                                error={!!error}
                                                                helperText={error?.message || "Press enter to add multiple tags"}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name="keywords"
                                                control={control}
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <Autocomplete
                                                        multiple
                                                        freeSolo
                                                        options={[]}
                                                        value={value || []}
                                                        onChange={(_event, newValue) => {
                                                            const processedValue = newValue.reduce((acc: string[], curr: string) => {
                                                                if (curr.includes(',')) {
                                                                    return [...acc, ...curr.split(',').map((v) => v.trim()).filter((v) => v)];
                                                                }
                                                                return [...acc, curr.trim()].filter((v) => v);
                                                            }, []);
                                                            onChange(Array.from(new Set(processedValue)));
                                                        }}
                                                        renderTags={(tagValue, getTagProps) =>
                                                            tagValue.map((option, index) => (
                                                                <Chip
                                                                    label={option}
                                                                    {...getTagProps({ index })}
                                                                    color="primary"
                                                                    variant="light"
                                                                    size="small"
                                                                />
                                                            ))
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Target Keywords"
                                                                placeholder="Add keyword..."
                                                                error={!!error}
                                                                helperText={error?.message || "Press enter to add multiple keywords"}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider sx={{ borderStyle: 'dashed' }} />

                                {/* Section 3: Meta Description */}
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <DocumentText size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>The Meta Narrative</Typography>
                                    </Stack>
                                    <Controller
                                        name="description"
                                        control={control}
                                        rules={{ required: "Description is required" }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Meta Description (150-160 chars recommended)"
                                                placeholder="Provide a compelling summary that appears in search results to drive clicks..."
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
                                        <Typography variant="h5" fontWeight={700}>Social Preview Card</Typography>
                                    </Stack>

                                    <Box sx={{ p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                                        <Controller
                                            name="image"
                                            control={control}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FileUpload
                                                    value={value}
                                                    onChange={onChange}
                                                    label="Upload Search Preview Image"
                                                    error={!!error}
                                                    helperText={error?.message || "This image appears on Google Knowledge Graph and Social links."}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ mt: 4, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2, border: `1px dashed ${alpha(theme.palette.info.main, 0.2)}` }}>
                                        <Typography variant="subtitle2" color="info.main" gutterBottom sx={{ fontWeight: 700 }}>SEO Pro-Tip</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: 'block' }}>
                                            Ensure your primary keyword is near the beginning of the title and meta description for better relevancy.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ p: { xs: 3, md: 5 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                        <DocumentText size={22} color={theme.palette.primary.main} variant="Bulk" />
                        <Typography variant="h5" fontWeight={700}>Structured Data</Typography>
                    </Stack>
                    <Controller
                        name="structuredData"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <Box sx={{ p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                                <AceEditor
                                    mode="json"
                                    theme="github"
                                    name="structuredData"
                                    value={typeof field.value === 'string' ? field.value : field.value ? JSON.stringify(field.value, null, 2) : ''}
                                    onChange={(value) => field.onChange(value)}
                                    editorProps={{ $blockScrolling: true }}
                                    setOptions={{
                                        useWorker: false,
                                        showLineNumbers: true,
                                        wrapEnabled: true,
                                        fontSize: 14
                                    }}
                                    width="100%"
                                    height="500px"
                                />
                                {error && <FormHelperText error>{error.message}</FormHelperText>}
                            </Box>
                        )}
                    />
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
                        {isSubmitting ? 'Processing...' : mode === 'add' ? 'Add' : 'Update'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditSeo;