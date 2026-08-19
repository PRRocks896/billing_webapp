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
import IconButton from "@mui/material/IconButton";

import MainCard from "components/MainCard";
import UseAddEditChallan from "./hooks/useAddEditChallan";
import {
    ArrowLeft,
    Shop,
    Box1,
    Add,
    Trash,
    DocumentText,
    Money4
} from "iconsax-reactjs";
import { Controller } from "react-hook-form";

const AddEditChallan = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        fields,
        isEdit,
        control,
        isSubmitting,
        laundryItemList,
        laundryVendorList,
        onSubmit,
        handleBack,
        handleSubmit,
        addLaundryItem,
        removeLaundryItem,
        watch
    } = UseAddEditChallan();

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
                            <DocumentText size={32} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Select a vendor and add laundry items to send for washing.
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
                        {/* ── Section 1: Vendor Selection ─────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <Shop size={24} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Vendor Selection</Typography>
                            </Stack>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="vendorId"
                                        control={control}
                                        rules={{ required: "Vendor is required" }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <Autocomplete
                                                fullWidth
                                                options={laundryVendorList}
                                                getOptionLabel={(option: any) => `${option.name} (${option.laundryName})`}
                                                value={laundryVendorList.find((item) => item.id === value) || null}
                                                onChange={(_, newValue: any) => onChange(newValue ? newValue.id : null)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Laundry Vendor"
                                                        placeholder="Search or Select Vendor"
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
                                    <Typography variant="h5" fontWeight={700}>Items to Send</Typography>
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
                                {fields.map((item, index) => {
                                    const selectedItemId = watch(`items.${index}.laundryItemId`);
                                    const selectedItem = laundryItemList.find(i => i.value === selectedItemId);

                                    return (
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
                                                <Grid size={{ xs: 12, md: 5 }}>
                                                    <Controller
                                                        name={`items.${index}.laundryItemId`}
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
                                                                        label="Select Item"
                                                                        error={!!error}
                                                                        helperText={error?.message}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 3 }}>
                                                    <Controller
                                                        name={`items.${index}.givenQty`}
                                                        control={control}
                                                        rules={{
                                                            required: 'Quantity is required',
                                                            min: { value: 1, message: 'Minimum qty is 1' }
                                                        }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                type="number"
                                                                label="Quantity to Send"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                InputProps={{
                                                                    endAdornment: selectedItem ? <InputAdornment position="end">{selectedItem.unitName}</InputAdornment> : null
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <Controller
                                                        name={`items.${index}.price`}
                                                        control={control}
                                                        rules={{ required: 'Washing price is required' }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                type="number"
                                                                label="Washing Price (per item)"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                InputProps={{
                                                                    startAdornment: <InputAdornment position="start"><Money4 size={18} color={theme.palette.text.disabled} /></InputAdornment>
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    );
                                })}
                            </Stack>
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
                        {isSubmitting ? "Processing..." : mode === "add" ? "Create Challan (Send Items)" : "Update Challan"}
                    </Button>
                </Box>
            </MainCard>
        </form>
    )
}

export default AddEditChallan;
