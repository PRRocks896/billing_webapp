import { Controller } from 'react-hook-form';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Box, Chip, Divider, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import { AddCircle, Trash } from 'iconsax-reactjs';

import useAddEditModule from "../hooks/useAddEditModule";
import MainCard from 'components/MainCard';
import { generateSlug } from 'utils/helper';

const AddEditModule = () => {
    const {
        mode,
        title,
        control,
        isSubmitting,
        showModuleSection,
        moduleSectionArray,
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
        toggleModuleSection,
        handleAddModuleSection,
        handleRemoveModuleSection
    } = useAddEditModule();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>

                    {/* ── Module Basic Info ── */}
                    <MainCard title={title}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Module Name is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            fullWidth
                                            label="Module Name"
                                            placeholder="Enter Module Name"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="path"
                                    control={control}
                                    rules={{ required: 'Path is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            fullWidth
                                            label="Path"
                                            placeholder="Enter Path"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="icon"
                                    control={control}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            fullWidth
                                            label="Icon"
                                            placeholder="Enter Icon"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </MainCard>

                    {/* ── Module Sections Toggle ── */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        <Switch
                            checked={showModuleSection}
                            onChange={(e) => toggleModuleSection(e.target.checked)}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 500 }}>
                            Module Sections
                        </Typography>
                        {showModuleSection && moduleSectionArray.fields.length > 0 && (
                            <Chip
                                label={`${moduleSectionArray.fields.length} section${moduleSectionArray.fields.length > 1 ? 's' : ''}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        )}
                    </Stack>

                    {/* ── Module Sections Card ── */}
                    {showModuleSection && (
                        <MainCard
                            title="Module Sections"
                            secondary={
                                <Tooltip title="Add New Section">
                                    <IconButton
                                        color="primary"
                                        aria-label="add-section"
                                        onClick={handleAddModuleSection}
                                        size="small"
                                    >
                                        <AddCircle size={22} />
                                    </IconButton>
                                </Tooltip>
                            }
                            content={false}
                        >
                            {moduleSectionArray.fields.length === 0 ? (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No sections yet. Click <strong>+</strong> to add one.
                                    </Typography>
                                </Box>
                            ) : (
                                moduleSectionArray.fields.map((field: any, index: number) => {
                                    // field.id is RHF's internal UUID — NEVER use it as DB id
                                    // field.sectionId is our actual database id (undefined = new row)
                                    const isExisting = !!field.sectionId;

                                    return (
                                        <Box key={field.id}>
                                            <Grid
                                                container
                                                spacing={2}
                                                alignItems="center"
                                                sx={{
                                                    px: 2,
                                                    py: 1.5,
                                                    // Subtle highlight for existing saved sections
                                                    bgcolor: isExisting ? 'transparent' : 'primary.lighter',
                                                    transition: 'background-color 0.2s'
                                                }}
                                            >
                                                {/* Row badge */}
                                                <Grid size={{ xs: 12, sm: 'auto' }}>
                                                    <Tooltip title={isExisting ? 'Saved Section' : 'New Section (unsaved)'}>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: 28,
                                                                height: 28,
                                                                borderRadius: '50%',
                                                                bgcolor: isExisting ? 'success.lighter' : 'primary.light',
                                                                color: isExisting ? 'success.dark' : 'primary.darker',
                                                                fontWeight: 700,
                                                                fontSize: '0.75rem',
                                                                cursor: 'default',
                                                                flexShrink: 0
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </Typography>
                                                    </Tooltip>
                                                </Grid>

                                                {/* Section Name */}
                                                <Grid size={{ xs: 12, sm: 5 }}>
                                                    <Controller
                                                        name={`moduleSection.${index}.name`}
                                                        control={control}
                                                        rules={{ required: 'Section Name is required' }}
                                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                            <TextField
                                                                value={value}
                                                                onChange={(e) => {
                                                                    onChange(e.target.value);
                                                                    // Auto-generate key only for new (unsaved) sections
                                                                    if (!isExisting) {
                                                                        setValue(`moduleSection.${index}.key`, generateSlug(e.target.value, '_'));
                                                                    }
                                                                }}
                                                                onBlur={onBlur}
                                                                fullWidth
                                                                size="small"
                                                                label="Section Name"
                                                                placeholder="e.g. Sales Report"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                {/* Section Key */}
                                                <Grid size={{ xs: 12, sm: 5 }}>
                                                    <Controller
                                                        name={`moduleSection.${index}.key`}
                                                        control={control}
                                                        rules={{ required: 'Section Key is required' }}
                                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                            <TextField
                                                                value={value}
                                                                onChange={onChange}
                                                                onBlur={onBlur}
                                                                fullWidth
                                                                size="small"
                                                                label="Section Key"
                                                                placeholder="auto-generated"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                slotProps={{
                                                                    input: {
                                                                        sx: { fontFamily: 'monospace', fontSize: '0.85rem' }
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                {/* Status chip + Delete */}
                                                <Grid size={{ xs: 12, sm: 'auto' }}>
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        {isExisting && (
                                                            <Chip
                                                                label="Saved"
                                                                size="small"
                                                                color="success"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.65rem', height: 20 }}
                                                            />
                                                        )}
                                                        {!isExisting && (
                                                            <Chip
                                                                label="New"
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.65rem', height: 20 }}
                                                            />
                                                        )}
                                                        <Tooltip title="Remove Section">
                                                            <span>
                                                                <IconButton
                                                                    aria-label="delete-section"
                                                                    onClick={() => handleRemoveModuleSection(index)}
                                                                    // disabled={moduleSectionArray.fields.length === 1}
                                                                    size="small"
                                                                >
                                                                    <Trash
                                                                        size={18}
                                                                        color={moduleSectionArray.fields.length === 1 ? '#ccc' : 'red'}
                                                                    />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    </Stack>
                                                </Grid>
                                            </Grid>

                                            {index < moduleSectionArray.fields.length - 1 && <Divider />}
                                        </Box>
                                    );
                                })
                            )}
                        </MainCard>
                    )}

                    {/* ── Action Buttons ── */}
                    <Stack direction="row" sx={{ mt: 3 }} spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" color="secondary" onClick={handleBack}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {mode === 'add'
                                ? isSubmitting ? 'Adding...' : 'Add'
                                : isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
}

export default AddEditModule;