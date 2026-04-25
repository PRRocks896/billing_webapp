import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { CloseCircle, Profile2User } from "iconsax-reactjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from "react-hook-form";
import { PHONE_REGEX } from "utils/constant";
import useAddCustomerModal from "pages/customer/hooks/useAddCustomerModal";

// ─── Props ──────────────────────────────────────────────────────────────────────
type AddCustomerModalProps = {
    open: boolean;
    onClose: () => void;
    onSuccess?: (customer?: any) => void;
};

// ─── Component ──────────────────────────────────────────────────────────────────
const AddCustomerModal = ({ open, onClose, onSuccess }: AddCustomerModalProps) => {
    const {
        control,
        isSubmitting,
        countryCodeList,
        handleClose,
        handleSubmit,
        onSubmit,
    } = useAddCustomerModal({ onClose, onSuccess });

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <DialogTitle sx={{ p: 0 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: 3, py: 2 }}
                >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Profile2User size={22} />
                        <Typography variant="h5" fontWeight={600}>
                            Add New Customer
                        </Typography>
                    </Stack>
                    <IconButton size="small" onClick={handleClose} aria-label="close">
                        <CloseCircle size={20} />
                    </IconButton>
                </Stack>
                <Divider />
            </DialogTitle>

            {/* ── Form ───────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
                    <Grid container spacing={2.5}>

                        {/* Name */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Full name is required' }}
                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                    <TextField
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        label="Full Name"
                                        placeholder="Enter customer's full name"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Country Code + Phone */}
                        <Grid size={{ xs: 12, sm: 5 }}>
                            <Controller
                                name="countryCode"
                                control={control}
                                rules={{ required: 'Country code is required' }}
                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                    <Autocomplete
                                        fullWidth
                                        value={countryCodeList.find((c: any) => c.value === value) || null}
                                        onChange={(_, newValue: any) => onChange(newValue ? newValue.value : null)}
                                        onBlur={onBlur}
                                        options={countryCodeList}
                                        getOptionLabel={(option: any) => option.label}
                                        isOptionEqualToValue={(option: any, val: any) => option.value === val.value}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Country Code"
                                                variant="outlined"
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 7 }}>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                rules={{
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: PHONE_REGEX,
                                        message: 'Enter a valid phone number',
                                    },
                                }}
                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                    <TextField
                                        fullWidth
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        label="Phone Number"
                                        placeholder="10-digit phone number"
                                        inputMode="numeric"
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Date of Birth */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="dob"
                                control={control}
                                rules={{ required: 'Date of birth is required' }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            format="dd/MM/yyyy"
                                            value={value}
                                            onChange={onChange}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    label: 'Date of Birth',
                                                    error: !!error,
                                                    helperText: error?.message,
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                        </Grid>

                        {/* Gender */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{ required: 'Please select a gender' }}
                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                    <>
                                        <FormLabel error={!!error}>Gender</FormLabel>
                                        <RadioGroup
                                            row
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            name="gender"
                                        >
                                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        </RadioGroup>
                                        {error && (
                                            <FormHelperText error>{error.message}</FormHelperText>
                                        )}
                                    </>
                                )}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>

                {/* ── Actions ────────────────────────────────────────────── */}
                <DialogActions sx={{ px: 3, py: 2.5 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Customer'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddCustomerModal;
