import { Controller } from 'react-hook-form';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

// project components
import MainCard from 'components/MainCard';
import FileUpload from 'components/FileUpload';
import { generateSlug } from 'utils/helper';

// hooks & utils
import useAddEditCity from "../hooks/useAddEditCity";

// assets
import {
    Location,
    Global,
    DocumentText,
    Gallery,
    ArrowLeft,
    Building,
    Link,
    Map
} from 'iconsax-reactjs';

const AddEditCity = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        control,
        statesList,
        isSubmitting,
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
    } = useAddEditCity();

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
                            <Location size={24} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                {title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Registry for geographic entities and local branch coverage areas.
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
                                {/* ── Section 1: Geographic Identity ──────────────── */}
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                        <Global size={20} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={600}>Geographic Identity</Typography>
                                    </Stack>
                                    <Grid container spacing={2.5}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Controller
                                                name="name"
                                                control={control}
                                                rules={{ required: 'City Name is required' }}
                                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                    <TextField
                                                        value={value}
                                                        onChange={(e) => {
                                                            onChange(e);
                                                            setValue("slug", generateSlug(e.target.value));
                                                        }}
                                                        onBlur={onBlur}
                                                        fullWidth
                                                        label="Official City Name"
                                                        placeholder="e.g. New York"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start"><Building size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Controller
                                                name="slug"
                                                control={control}
                                                rules={{ required: 'Slug is required' }}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <TextField
                                                        disabled
                                                        value={value}
                                                        fullWidth
                                                        label="Dynamic Slug (Auto)"
                                                        placeholder="Generated slug"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start"><Link size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Controller
                                                name="stateID"
                                                control={control}
                                                rules={{ required: 'State is required' }}
                                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                    <Autocomplete
                                                        value={statesList.find((state: any) => state.id === value) || null}
                                                        onChange={(_, newValue) => onChange(newValue ? newValue.id : null)}
                                                        onBlur={onBlur}
                                                        options={statesList}
                                                        getOptionLabel={(option: any) => option.name}
                                                        isOptionEqualToValue={(option: any, value: any) => option.id === value}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Parent Region / State"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <>
                                                                            <InputAdornment position="start" sx={{ pl: 0.5 }}><Map size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                                            {params.InputProps.startAdornment}
                                                                        </>
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid size={{ xs: 12 }}><Divider /></Grid>

                                {/* ── Section 2: City Narrative ─────────────────── */}
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                        <DocumentText size={20} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={600}>City Narrative</Typography>
                                    </Stack>
                                    <Controller
                                        name="description"
                                        control={control}
                                        rules={{ required: 'Description is required' }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Contextual Description"
                                                placeholder="Provide detailed information about the city's landmarks, administrative importance, etc."
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* ── Section 3: Visual Landmark ─────────────────────── */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                <Gallery size={20} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={600}>Visual Landmark</Typography>
                            </Stack>
                            <Stack spacing={3}>
                                <Controller
                                    name='image'
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <FileUpload
                                            value={value || undefined}
                                            onChange={onChange}
                                            accept="image/*"
                                            maxSize={2097152} // 2MB
                                            label="City Perspective / Aerial Image"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name='backgroundImage'
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <FileUpload
                                            value={value || undefined}
                                            onChange={onChange}
                                            accept="image/*"
                                            maxSize={2097152} // 2MB
                                            label="Background Presentation Image"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                            </Stack>
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
                        {isSubmitting ? 'Syncing...' : mode === 'add' ? 'Register City' : 'Update Record'}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditCity;