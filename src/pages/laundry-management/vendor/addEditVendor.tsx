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

import MainCard from "components/MainCard";
import UseAddEditVendor from "./hooks/useAddEditVendor";
import {
    ArrowLeft,
    Building,
    User,
    Call,
    Location,
    Bank,
    Card,
    UserSquare,
    Hashtag,
    Shop
} from "iconsax-reactjs";
import { Controller } from "react-hook-form";
import { PHONE_REGEX } from "utils/constant";
import { doUpperCase } from "utils/helper";

const AddEditVendor = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        control,
        isSubmitting,
        countryCodeList,
        onSubmit,
        getValues,
        handleBack,
        handleSubmit,
        handleIfscVerify
    } = UseAddEditVendor();

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
                            <Building size={32} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Manage laundry vendor profiles, contact details, and banking information for settlements.
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
                        {/* ── Section 1: Laundry Identity ─────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <Shop size={24} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Laundry Identity</Typography>
                            </Stack>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="laundryName"
                                        control={control}
                                        rules={{ required: "Laundry Shop Name is required" }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Laundry (Shop) Name"
                                                placeholder="e.g. Clean & Shine Laundry"
                                                onChange={(e) => field.onChange(doUpperCase(e.target.value))}
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Building size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: "Owner / Manager Name is required" }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Owner / Person Name"
                                                placeholder="Enter full name"
                                                onChange={(e) => field.onChange(doUpperCase(e.target.value))}
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><User size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                        {/* ── Section 2: Contact & Location ────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <Call size={24} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Contact & Location</Typography>
                            </Stack>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 5 }}>
                                    <Grid container spacing={1}>
                                        <Grid size={{ xs: 6 }}>
                                            <Controller
                                                name="countryCode"
                                                control={control}
                                                rules={{ required: "Code required" }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <Autocomplete
                                                        fullWidth
                                                        options={countryCodeList}
                                                        value={countryCodeList.find((c: any) => c.value === value) || null}
                                                        onChange={(_, n) => onChange(n ? n.value : '')}
                                                        renderInput={(params) => <TextField {...params} label="Code" error={!!error} />}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Controller
                                                name="phoneNumber"
                                                control={control}
                                                rules={{
                                                    required: "Phone Number is required",
                                                    pattern: { value: PHONE_REGEX, message: "Valid Phone Number only" },
                                                    maxLength: { value: 10, message: "Maximum 10 digits" }
                                                }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Phone Number"
                                                        placeholder="9876543210"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start"><Call size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 7 }}>
                                    <Controller
                                        name="address"
                                        control={control}
                                        rules={{ required: "Physical Address is required" }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Shop Address"
                                                placeholder="House no, Street, Area, City..."
                                                multiline
                                                rows={3}
                                                onChange={(e) => field.onChange(doUpperCase(e.target.value))}
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start" sx={{ mt: -0.5, alignSelf: 'flex-start' }}><Location size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                        {/* ── Section 3: Bank Settlement ─────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <Bank size={24} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Bank Settlement Details</Typography>
                            </Stack>
                            <Box sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.02), border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="accountHolder"
                                            control={control}
                                            rules={{ required: "Account Holder Name is required" }}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Account Holder Name"
                                                    placeholder="As per bank records"
                                                    onChange={(e) => field.onChange(doUpperCase(e.target.value))}
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start"><UserSquare size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="ifscCode"
                                            control={control}
                                            rules={{
                                                required: "IFSC Code is required",
                                                pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Invalid IFSC (e.g. SBIN0123456)' },
                                                validate: (value) => handleIfscVerify(value, 'ifscCode')
                                            }}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Bank IFSC Code"
                                                    placeholder="ABCD0123456"
                                                    onChange={(e) => field.onChange(doUpperCase(e.target.value))}
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start"><Hashtag size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="accountNumber"
                                            control={control}
                                            rules={{ required: "Account Number is required" }}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Account Number"
                                                    type="password"
                                                    placeholder="••••••••••••"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start"><Card size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="reEnterAccountNumber"
                                            control={control}
                                            rules={{
                                                required: "Please re-enter account number",
                                                validate: (value) => value === getValues('accountNumber') || "Account numbers must match"
                                            }}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Confirm Account Number"
                                                    type="text"
                                                    placeholder="01234567"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start"><Card size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
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
                        {isSubmitting ? "Processing..." : mode === "add" ? "Save Information" : "Update Profile"}
                    </Button>
                </Box>
            </MainCard>
        </form>
    )
}

export default AddEditVendor;
