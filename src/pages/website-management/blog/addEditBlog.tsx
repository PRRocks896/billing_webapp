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
    Chip,
    FormControl,
    FormHelperText,
} from '@mui/material';

// project components
import MainCard from 'components/MainCard';
import FileUpload from 'components/FileUpload';
import Editor from 'components/third-party/ReactQuill';

// Icons
import {
    ArrowLeft,
    Save2,
    Gallery,
    Edit2,
    SearchNormal,
    Hashtag,
    DocumentText,
    Key,
    Book1,
} from 'iconsax-reactjs';

import useAddEditBlog from "./hooks/useAddEditBlog";
import { generateSlug } from 'utils/helper';

import ReactQuill from 'react-quill-new';
import BlotFormatter from 'quill-blot-formatter';

const Quill = ReactQuill.Quill;
if (Quill && !Quill.imports['modules/blotFormatter']) {
    Quill.register('modules/blotFormatter', BlotFormatter);
}

const editorModules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    blotFormatter: {}
};

const AddEditBlog = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        control,
        isSubmitting,
        onSubmit,
        setValue,
        handleBack,
        handleSubmit,
    } = useAddEditBlog();

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
                            <Book1 size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Craft engaging stories and share knowledge with your community.
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
                    <Stack spacing={5}>
                        {/* ── Top Row: Core Info & Thumbnail ───────────────────── */}
                        <Grid container spacing={5}>
                            <Grid size={{ xs: 12, lg: 8 }}>
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Edit2 size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Narrative Hub</Typography>
                                    </Stack>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name="title"
                                                control={control}
                                                rules={{ required: "Blog title is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Headline"
                                                        placeholder="Enter a catchy title for your blog post..."
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.value);
                                                            setValue("slug", generateSlug(e.target.value));
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
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Controller
                                                name="slug"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="URL Slug (Auto-generated)"
                                                        placeholder="the-url-path"
                                                        onChange={(e) => field.onChange(generateSlug(e.target.value.toLowerCase()))}

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
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name="shortDescription"
                                                control={control}
                                                rules={{ required: "Short description is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        label="Brief Summary"
                                                        placeholder="Provide a quick overview that Hook the reader..."
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, lg: 4 }}>
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Gallery size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Visual Identity</Typography>
                                    </Stack>
                                    <Box sx={{ p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                                        <Controller
                                            name="thumbnilImage"
                                            control={control}
                                            rules={{ required: "Thumbnail image is required" }}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FileUpload
                                                    value={value}
                                                    onChange={onChange}
                                                    label="Featured Image"
                                                    error={!!error}
                                                    helperText={error?.message || "This image will be displayed on the blog list and sharing previews."}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        {/* ── Full Width Row: Blog Content Box ──────────────────────── */}
                        <Box>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <DocumentText size={22} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Rich Narrative</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Use the full canvas to craft your story with tools, images, and rich formatting.
                                </Typography>
                            </Stack>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: "Full content is required" }}
                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                    <FormControl fullWidth error={!!error}>
                                        <Editor
                                            value={value}
                                            onChange={onChange}
                                            editorMinHeight={600}
                                            modules={editorModules}
                                            placeholder="Start writing your masterpiece..."
                                        />
                                        {error && <FormHelperText>{error.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                        </Box>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        {/* ── Bottom Row: SEO Data ────────────────────────────── */}
                        <Box>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <SearchNormal size={22} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Discoverability (SEO Settings)</Typography>
                            </Stack>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Controller
                                        name="metaTags"
                                        control={control}
                                        rules={{ required: "At least one tag is required" }}
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
                                                            key={index}
                                                            color="primary"
                                                            variant="light"
                                                            size="small"
                                                        />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Article Tags"
                                                        placeholder="Press enter or use comma to add..."
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start">
                                                                        <Hashtag size={18} color={theme.palette.text.disabled} />
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
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Controller
                                        name="metaKeywords"
                                        control={control}
                                        rules={{ required: "At least one keyword is required" }}
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
                                                            key={index}
                                                            color="primary"
                                                            variant="light"
                                                            size="small"
                                                        />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Keywords"
                                                        placeholder="Search intent keywords (comma separated)..."
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="metaDescription"
                                        control={control}
                                        rules={{ required: "Meta description is required" }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label="Search Engine Snippet"
                                                placeholder="Provide a compelling description for search engine results..."
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
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
                        {isSubmitting ? 'Processing...' : mode === 'add' ? 'Publish Blog' : 'Update Blog'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditBlog;