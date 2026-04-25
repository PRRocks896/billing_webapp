import { alpha, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import MainCard from "components/MainCard";
import {
    Trash,
    PlayAdd,
    ArrowLeft,
    Hashtag,
    Shop,
    Calendar,
    Box1,
    Archive,
    Add,
    InfoCircle,
    Money
} from "iconsax-reactjs";
import { Controller } from "react-hook-form";

import UseAddEditManagement from "./hooks/useAddEditManagement";

const AddEditManagement = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        isEdit,
        fields,
        control,
        isSubmitting,
        laundryItemList,
        laundryWasherList,
        onSubmit,
        getValues,
        handleBack,
        handleSubmit,
        addLaundryItem,
        removeLaundryItem
    } = UseAddEditManagement();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
                {/* ── Hero Header ──────────────────────────────────────── */}
                <Box
                    sx={{
                        px: 3,
                        py: 4,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 3,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '18px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                                flexShrink: 0
                            }}
                        >
                            <Box1 size={32} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Handover items to laundry washer and manage quantities.
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        startIcon={<ArrowLeft size={18} />}
                        sx={{
                            borderRadius: '12px',
                            px: 3,
                            py: 1.25,
                            borderWidth: '2px',
                            '&:hover': { borderWidth: '2px' }
                        }}
                    >
                        Back to List
                    </Button>
                </Box>

                <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Grid container spacing={5}>
                        {/* ── Section 1: Handover Identity ─────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <InfoCircle size={24} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Assignment Details</Typography>
                            </Stack>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="givenDate"
                                        control={control}
                                        rules={{ required: 'Handover date is required' }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                type="date"
                                                label="Date of Handover"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Calendar size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="laundryWasherID"
                                        control={control}
                                        rules={{ required: 'Washer selection is required' }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <Autocomplete
                                                fullWidth
                                                options={laundryWasherList}
                                                getOptionLabel={(option: any) => option.label}
                                                value={laundryWasherList.find((item) => item.value === value) || null}
                                                onChange={(_, newValue: any) => onChange(newValue ? newValue.value : null)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Laundry Washer (Receiver)"
                                                        placeholder="Search or Select Washer"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start" sx={{ ml: 1 }}><Shop size={20} color={theme.palette.text.disabled} /></InputAdornment>
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

                        <Grid size={{ xs: 12 }}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                        {/* ── Section 2: Laundry Items ─────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box1 size={24} color={theme.palette.primary.main} variant="Bulk" />
                                    <Typography variant="h5" fontWeight={700}>Laundry Items</Typography>
                                </Stack>
                                {!isEdit && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        startIcon={<Add size={18} variant="Outline" />}
                                        onClick={addLaundryItem}
                                        sx={{ borderRadius: 2, py: 1, px: 2 }}
                                    >
                                        Add Another Item
                                    </Button>
                                )}
                            </Stack>

                            <Stack spacing={3}>
                                {fields.map((item, index) => (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            p: 3,
                                            position: 'relative',
                                            borderRadius: 4,
                                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                            }
                                        }}
                                    >
                                        {!isEdit && fields.length > 1 && (
                                            <IconButton
                                                onClick={() => removeLaundryItem(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: -12,
                                                    right: -12,
                                                    bgcolor: 'background.paper',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    color: 'error.main',
                                                    '&:hover': { bgcolor: 'error.lighter' }
                                                }}
                                                size="small"
                                            >
                                                <Trash size={16} variant="Bold" />
                                            </IconButton>
                                        )}
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <Controller
                                                    name={`detail.${index}.laundryItemID`}
                                                    control={control}
                                                    rules={{ required: 'Item is required' }}
                                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                        <Autocomplete
                                                            fullWidth
                                                            options={laundryItemList}
                                                            getOptionLabel={(option: any) => option.label}
                                                            value={laundryItemList.find((i) => i.value === value) || null}
                                                            onChange={(_, newValue: any) => onChange(newValue ? newValue.value : null)}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label={`Laundry Item #${index + 1}`}
                                                                    placeholder="e.g. Jeans, Shirt"
                                                                    error={!!error}
                                                                    helperText={error?.message}
                                                                    InputProps={{
                                                                        ...params.InputProps,
                                                                        startAdornment: (
                                                                            <>
                                                                                <InputAdornment position="start" sx={{ ml: 1 }}><Archive size={20} color={theme.palette.text.disabled} /></InputAdornment>
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
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                <Controller
                                                    name={`detail.${index}.price`}
                                                    control={control}
                                                    rules={{ required: 'Price is required' }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            type="number"
                                                            label="Unit Price"
                                                            placeholder="0.00"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start"><Money size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                <Controller
                                                    name={`detail.${index}.givenQty`}
                                                    control={control}
                                                    rules={{ required: 'Quantity is required' }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            type="number"
                                                            label="Given Quantity"
                                                            placeholder="Numbers of pieces"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start"><Hashtag size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Stack>

                            {!isEdit && (
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        startIcon={<PlayAdd size={20} />}
                                        onClick={addLaundryItem}
                                        sx={{
                                            py: 2,
                                            borderRadius: 3,
                                            bgcolor: 'transparent',
                                            borderStyle: 'dashed',
                                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05), borderStyle: 'dashed' }
                                        }}
                                    >
                                        Add One More Item to this Handover
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Box>

                {/* ── Footer Actions ───────────────────────────────────── */}
                <Box
                    sx={{
                        p: 3,
                        px: 4,
                        bgcolor: alpha(theme.palette.secondary.main, 0.02),
                        borderTop: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'flex-end',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        sx={{
                            minWidth: 120,
                            borderRadius: '12px',
                            py: 1.25,
                            order: { xs: 2, sm: 1 }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            minWidth: 180,
                            borderRadius: '12px',
                            py: 1.25,
                            order: { xs: 1, sm: 2 },
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                            '&:hover': {
                                boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                            }
                        }}
                    >
                        {isSubmitting ? "Processing..." : mode === "add" ? "Save Handover" : "Update Profile"}
                    </Button>
                </Box>
            </MainCard>
        </form>
    );
};

export default AddEditManagement;