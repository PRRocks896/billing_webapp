import { Controller } from 'react-hook-form';

// assets
import {
    Award,
    ReceiptItem,
    Calendar,
    Gallery,
    Magicpen,
    Add,
    Trash,
    ArrowLeft,
    Wallet,
    Timer1,
    Hashtag,
    TickCircle
} from 'iconsax-reactjs';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

// project components
import MainCard from 'components/MainCard';
import FileUpload from 'components/FileUpload';

import useAddEditEmployeeWellnessPlan from "./hooks/useAddEditEmployeeWellnessPlan";

const AddEditEmployeeWellnessPlan = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        fields,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
        handleAddFeature,
        handleRemoveFeature,
    } = useAddEditEmployeeWellnessPlan();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}` }}>
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
                            <Award size={24} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                {title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Configure wellness plan.
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ borderRadius: 2 }}
                    >
                        Back to List
                    </Button>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                        <ReceiptItem size={20} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={600}>Plan Specifications</Typography>
                                    </Stack>
                                    <Grid container spacing={2.5}>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name='title'
                                                control={control}
                                                rules={{ required: 'Title is required' }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Title"
                                                        placeholder="e.g. Platinum Plus"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name='minPrice'
                                                control={control}
                                                rules={{
                                                    required: 'Minimum Price is required',
                                                    pattern: { value: /^[0-9]*(\.[0-9]{1,2})?$/, message: 'Please enter a valid number' }
                                                }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Minimum Price"
                                                        type='text'
                                                        onInput={(e: any) => {
                                                            e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                                                            if (e.target.value.split('.')[1]?.length > 2) {
                                                                e.target.value = e.target.value.slice(0, -1);
                                                            }
                                                        }}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name='maxPrice'
                                                control={control}
                                                rules={{
                                                    required: 'Maximum Price is required',
                                                    pattern: { value: /^[0-9]*(\.[0-9]{1,2})?$/, message: 'Please enter a valid number' }
                                                }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Maximum Price"
                                                        type='text'
                                                        onInput={(e: any) => {
                                                            e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                                                            if (e.target.value.split('.')[1]?.length > 2) {
                                                                e.target.value = e.target.value.slice(0, -1);
                                                            }
                                                        }}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                control={control}
                                                name='description'
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Description"
                                                        placeholder="Plan description..."
                                                        multiline
                                                        minRows={6}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* ── Section 3: Visual Assets ─────────────────────── */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                <Gallery size={20} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={600}>Visual Assets</Typography>
                            </Stack>
                            <Controller
                                name='images'
                                control={control}
                                // rules={{ required: 'Images are required' }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <FileUpload
                                        value={value || undefined}
                                        onChange={onChange}
                                        accept="image/*"
                                        maxSize={2097152} // 2MB
                                        label="Images"
                                        multiple
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider /></Grid>

                        {/* ── Section 4: Curated Benefits ────────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Magicpen size={20} color={theme.palette.primary.main} variant="Bulk" />
                                    <Typography variant="h5" fontWeight={600}>Plan Features</Typography>
                                </Stack>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Add size={18} />}
                                    onClick={handleAddFeature}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add Plan Feature
                                </Button>
                            </Stack>

                            <Grid container spacing={2}>
                                {fields.map((item, index) => (
                                    <Grid size={{ xs: 12 }} key={item.id}>
                                        <Box sx={{
                                            p: 2,
                                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                                            borderRadius: 3,
                                            border: `1px solid ${theme.palette.divider}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5
                                        }}>
                                            <TickCircle variant="Bold" size={20} color={theme.palette.primary.main} />
                                            <Controller
                                                control={control}
                                                name={`featureList.${index}.value`}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        variant="standard"
                                                        placeholder="Enter feature description..."
                                                        InputProps={{ disableUnderline: true, sx: { fontSize: '0.875rem' } }}
                                                        error={!!error}
                                                    />
                                                )}
                                            />
                                            {fields.length > 1 && (
                                                <IconButton size="small" color="error" onClick={() => handleRemoveFeature(index)}>
                                                    <Trash size={16} />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                {/* ── Footer Actions ───────────────────────────────────── */}
                <Box sx={{ p: 3, bgcolor: alpha(theme.palette.secondary.main, 0.02), borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" color="secondary" onClick={handleBack} sx={{ minWidth: 100, borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            minWidth: 140,
                            borderRadius: 2,
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`
                        }}
                    >
                        {isSubmitting ? 'Processing...' : mode === 'add' ? 'Create' : 'Update'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    )
}

export default AddEditEmployeeWellnessPlan