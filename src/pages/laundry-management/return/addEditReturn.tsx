import { alpha, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';

import MainCard from "components/MainCard";
import UseAddEditReturn from "./hooks/useAddEditReturn";
import {
    ArrowLeft,
    SearchNormal,
    Import,
    InfoCircle,
    Box1
} from "iconsax-reactjs";
import { Controller } from "react-hook-form";

const AddEditReturn = () => {
    const theme = useTheme();
    const {
        challanCode,
        setChallanCode,
        searchChallan,
        challanDetails,
        fields,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
        watch
    } = UseAddEditReturn();

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
                            <Import size={32} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                Receive Items
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Enter a Challan Code to load pending items and record received quantities.
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
                        {/* ── Section 1: Search Challan ─────────────────── */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <TextField
                                    fullWidth
                                    label="Challan Code"
                                    placeholder="e.g. LC000001"
                                    value={challanCode}
                                    onChange={(e) => setChallanCode(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            searchChallan();
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchNormal size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={searchChallan}
                                    disabled={!challanCode}
                                    sx={{ py: 1.8, px: 4, borderRadius: 2 }}
                                >
                                    Search
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                        {/* ── Section 2: Items Grid ─────────────────── */}
                        {challanDetails && (
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ mb: 4, p: 2.5, borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <InfoCircle size={24} color={theme.palette.info.main} variant="Bulk" />
                                        <Typography variant="subtitle1">
                                            Found Challan <b>{challanDetails.challanCode}</b> for Vendor <b>{challanDetails.vendor?.name}</b> sent on <b>{new Date(challanDetails.createdAt).toLocaleDateString()}</b>.
                                        </Typography>
                                    </Stack>
                                </Box>

                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                    <Box1 size={24} color={theme.palette.primary.main} variant="Bulk" />
                                    <Typography variant="h5" fontWeight={700}>Pending Items to Receive</Typography>
                                </Stack>

                                {fields.length === 0 ? (
                                    <Typography color="text.secondary">No pending items to receive for this challan.</Typography>
                                ) : (
                                    <Stack spacing={3}>
                                        {fields.map((item, index) => {
                                            const pending = watch(`items.${index}.pendingQty`);
                                            return (
                                                <Box
                                                    key={item.id}
                                                    sx={{
                                                        p: 3,
                                                        borderRadius: 4,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                    }}
                                                >
                                                    <Grid container spacing={3} alignItems="center">
                                                        <Grid size={{ xs: 12, md: 4 }}>
                                                            <Typography variant="h6">{item.itemName}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Pending: {item.pendingQty} {item.unitName} (Total Sent: {item.givenQty})
                                                            </Typography>
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 4 }}>
                                                            <Controller
                                                                name={`items.${index}.receivedQty`}
                                                                control={control}
                                                                rules={{
                                                                    validate: (value) => {
                                                                        const val = parseInt(value || "0");
                                                                        if (val < 0) return 'Cannot be negative';
                                                                        const dam = parseInt(watch(`items.${index}.damagedQty`) || "0");
                                                                        if (val + dam > pending) return `Total cannot exceed ${pending}`;
                                                                        return true;
                                                                    }
                                                                }}
                                                                render={({ field, fieldState: { error } }) => (
                                                                    <TextField
                                                                        {...field}
                                                                        fullWidth
                                                                        type="number"
                                                                        label="Good Condition (Received)"
                                                                        error={!!error}
                                                                        helperText={error?.message}
                                                                        InputProps={{
                                                                            endAdornment: <InputAdornment position="end">{item.unitName}</InputAdornment>
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 4 }}>
                                                            <Controller
                                                                name={`items.${index}.damagedQty`}
                                                                control={control}
                                                                rules={{
                                                                    validate: (value) => {
                                                                        const val = parseInt(value || "0");
                                                                        if (val < 0) return 'Cannot be negative';
                                                                        const rec = parseInt(watch(`items.${index}.receivedQty`) || "0");
                                                                        if (rec + val > pending) return `Total cannot exceed ${pending}`;
                                                                        return true;
                                                                    }
                                                                }}
                                                                render={({ field, fieldState: { error } }) => (
                                                                    <TextField
                                                                        {...field}
                                                                        fullWidth
                                                                        type="number"
                                                                        label="Damaged / Lost"
                                                                        color="error"
                                                                        error={!!error}
                                                                        helperText={error?.message}
                                                                        InputProps={{
                                                                            endAdornment: <InputAdornment position="end">{item.unitName}</InputAdornment>
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
                                )}
                            </Grid>
                        )}
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
                        disabled={isSubmitting || !challanDetails || fields.length === 0}
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
                        {isSubmitting ? "Processing..." : "Submit Received Items"}
                    </Button>
                </Box>
            </MainCard>
        </form>
    )
}

export default AddEditReturn;
