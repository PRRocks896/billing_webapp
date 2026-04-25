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
    FormHelperText
} from '@mui/material';

// project components
import MainCard from 'components/MainCard';
import Editor from 'components/third-party/ReactQuill';

// Icons
import {
    ArrowLeft,
    Save2,
    MessageQuestion,
    Edit2,
    DocumentText,
} from 'iconsax-reactjs';

import UseAddEditFaq from "./hooks/useAddEditFaq";

const AddEditFaq = () => {
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
    } = UseAddEditFaq();
    
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
                            <MessageQuestion size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Manage frequently asked questions and provide clear answers to your users.
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
                        <Grid size={{ xs: 12 }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <MessageQuestion size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Question Details</Typography>
                                    </Stack>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name="title"
                                                control={control}
                                                rules={{ required: "Question title is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Question"
                                                        placeholder="e.g. How to reset my password?"
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
                                    </Grid>
                                </Box>

                                <Divider sx={{ borderStyle: 'dashed' }} />

                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <DocumentText size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Answer Content</Typography>
                                    </Stack>
                                    <Controller
                                        name="description"
                                        control={control}
                                        rules={{ required: "Description is required" }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <FormControl fullWidth error={!!error}>
                                                <Editor
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder="Provide a detailed answer here..."
                                                />
                                                {error && <FormHelperText>{error.message}</FormHelperText>}
                                            </FormControl>
                                        )}
                                    />
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
                        {isSubmitting ? 'Processing...' : mode === 'add' ? 'Add FAQ' : 'Update FAQ'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    )
}

export default AddEditFaq;