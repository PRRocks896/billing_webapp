import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { openSnackbar } from "api/snackbar";
import { CloseCircle, Edit, UserTag, Clock, ArrowRight, TickCircle } from "iconsax-reactjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getCustomerDropdown } from "service/customer";

export type EditMembershipModalProps = {
    isOpen: boolean;
    membershipId?: number | null;
    selectedMembership?: any;
    onClose: () => void;
    onSubmit: (detail: any) => void;
}

const EditMembershipModal = ({ isOpen, onClose, membershipId, selectedMembership, onSubmit }: EditMembershipModalProps) => {
    const theme = useTheme();
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [isCustomerSearching, setIsCustomerSearching] = useState<boolean>(false);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        defaultValues: {
            customerID: null,
            minutes: null
        },
        mode: 'onBlur'
    });

    const searchCustomerViaPhone = useCallback((searchText: string = "") => {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

        const digitsOnly = searchText.replace(/\D/g, "");
        if (digitsOnly.length !== 10) {
            setCustomerList([]);
            return;
        }

        searchDebounceRef.current = setTimeout(async () => {
            try {
                setIsCustomerSearching(true);
                const whereCondition = { searchText: digitsOnly, isActive: true, isDeleted: false };
                const { success, data }: any = await getCustomerDropdown(whereCondition);
                setCustomerList(success && Array.isArray(data) && data.length > 0 ? data : []);
            } catch (error: any) {
                openSnackbar({
                    open: true,
                    message: error?.message || error?.messageCode || (error as Error).message || "Something went wrong",
                    variant: "alert",
                    severity: 'error',
                    alert: { color: "error" },
                });
            } finally {
                setIsCustomerSearching(false);
            }
        }, 300);
    }, []);

    const handleSubmitForm = (data: any) => {
        if (!data.customerID) {
            openSnackbar({
                open: true,
                message: 'Please select customer',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' },
            });
            return;
        }
        if (!data.minutes) {
            openSnackbar({
                open: true,
                message: 'Please enter minutes',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' },
            });
            return;
        }
        if (selectedMembership.customerID === data.customerID) {
            openSnackbar({
                open: true,
                message: 'Please select different customer',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' },
            });
            return;
        }

        // if (selectedMembership.minutes < Number(data.minutes)) {
        //     openSnackbar({
        //         open: true,
        //         message: 'Please enter minutes less than remaining minutes',
        //         variant: 'alert',
        //         severity: 'error',
        //         alert: { color: 'error' },
        //     });
        //     return;
        // }
        onSubmit(data);
    };

    useEffect(() => {
        if (isOpen) {
            reset({
                customerID: null,
                minutes: null
            })
        }
        // if (isOpen && selectedMembership) {
        //     reset({
        //         customerID: selectedMembership?.customerID,
        //         minutes: selectedMembership?.minutes
        //     })
        //     searchCustomerViaPhone(selectedMembership?.px_customer?.phoneNumber);
        // }
    }, [isOpen, selectedMembership]);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: (t: any) => t.customShadows?.z1 || 1
                }
            }}
        >
            {/* ── Custom Header ──────────────────────────────────────── */}
            <Box
                sx={(t) => ({
                    px: 3,
                    py: 2.5,
                    background: `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.12)} 0%, ${alpha(t.palette.primary.light, 0.05)} 100%)`,
                    borderBottom: `1px solid ${t.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                })}
            >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                        sx={(t) => ({
                            width: 42,
                            height: 42,
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 4px 12px ${alpha(t.palette.primary.main, 0.35)}`,
                        })}
                    >
                        <Edit size={22} color="#fff" variant="Bold" />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                            Edit Membership
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Transfer or adjust membership details
                        </Typography>
                    </Box>
                </Stack>
                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': { background: (t) => alpha(t.palette.error.main, 0.1), color: 'error.main' }
                    }}
                >
                    <CloseCircle size={22} />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                {/* ── Current Membership Info Badge ───────────────────────── */}
                {selectedMembership && (
                    <Box
                        sx={(t) => ({
                            mb: 3,
                            p: 2,
                            borderRadius: '12px',
                            background: alpha(t.palette.secondary.main, 0.04),
                            border: `1px solid ${alpha(t.palette.secondary.main, 0.12)}`,
                        })}
                    >
                        <Typography variant="overline" color="secondary.main" fontWeight={700} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>
                            Current Plan Details
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box
                                    sx={(t) => ({
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: alpha(t.palette.secondary.main, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    })}
                                >
                                    <UserTag size={18} color={theme.palette.secondary.main} variant="Bold" />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700}>
                                        {selectedMembership?.px_membership_plan?.planName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedMembership?.px_customer?.name} ({selectedMembership?.px_customer?.phoneNumber})
                                    </Typography>
                                </Box>
                            </Stack>
                            <Box sx={{ textAlign: 'right' }}>
                                <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                                    <Clock size={14} color={theme.palette.success.main} variant="Bold" />
                                    <Typography variant="subtitle2" color="success.main" fontWeight={800}>
                                        {selectedMembership?.minutes}
                                    </Typography>
                                </Stack>
                                <Typography variant="caption" color="text.secondary">Remaining Mins</Typography>
                            </Box>
                        </Stack>
                    </Box>
                )}

                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Typography variant="subtitle2" color="text.primary" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <UserTag size={16} /> Transfer To Customer
                            </Typography>
                            <Controller
                                name="customerID"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Autocomplete
                                        disablePortal
                                        loading={isCustomerSearching}
                                        options={customerList}
                                        filterOptions={(x) => x}
                                        getOptionLabel={(option) => option ? `${option?.phoneNumber} - ${option?.name}` : ''}
                                        isOptionEqualToValue={(option, val) => option?.id === val?.id}
                                        value={customerList.find((option) => option.id === value) || null}
                                        onChange={(_, selected) => {
                                            onChange(selected?.id ?? '');
                                        }}
                                        onInputChange={(_, inputValue, reason) => {
                                            if (reason === 'input') searchCustomerViaPhone(inputValue);
                                            if (reason === 'clear') {
                                                setCustomerList([]);
                                            }
                                        }}
                                        noOptionsText={
                                            isCustomerSearching
                                                ? 'Searching...'
                                                : 'Enter 10-digit phone number to search'
                                        }
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 0.5 }}>
                                                    <Box
                                                        sx={(t) => ({
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: '50%',
                                                            background: alpha(t.palette.primary.main, 0.1),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        })}
                                                    >
                                                        <UserTag size={14} color={theme.palette.primary.main} variant="Bold" />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={700}>{option.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{option.phoneNumber}</Typography>
                                                    </Box>
                                                </Stack>
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Search customer by mobile number"
                                                error={!!errors.customerID}
                                                helperText={errors.customerID?.message || "Search for the customer you want to transfer this membership to"}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
                                                            <ArrowRight size={18} color={theme.palette.text.disabled} />
                                                        </Box>
                                                    ),
                                                    endAdornment: (
                                                        <>
                                                            {isCustomerSearching ? <CircularProgress color="inherit" size={16} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="subtitle2" color="text.primary" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Clock size={16} /> Membership Minutes
                            </Typography>
                            <Controller
                                name="minutes"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        onChange={(e) => {
                                            const rawValue = e.target.value;
                                            const digitsOnly = rawValue.replace(/\D/g, '');
                                            onChange(digitsOnly);
                                        }}
                                        placeholder="Enter minutes"
                                        type="text"
                                        fullWidth
                                        error={!!errors.minutes}
                                        helperText={errors.minutes?.message || "Adjust remaining minutes if necessary"}
                                        inputProps={{
                                            maxLength: 5,
                                            pattern: "[0-9]*",
                                            inputMode: "numeric",
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center', mr: 1 }}>
                                                    <TickCircle size={18} color={theme.palette.text.disabled} />
                                                </Box>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                    sx={{ borderRadius: '10px', px: 3 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(handleSubmitForm)}
                    variant="contained"
                    color="primary"
                    startIcon={<TickCircle size={18} variant="Bold" />}
                    sx={{
                        borderRadius: '10px',
                        px: 4,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
                        '&:hover': {
                            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.45)}`,
                        }
                    }}
                >
                    Submit Transfer
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditMembershipModal;