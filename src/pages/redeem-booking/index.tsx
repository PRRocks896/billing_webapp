import { alpha, useTheme } from "@mui/material/styles";

import UseRedeemBooking from "./useRedeemBooking";
import MainCard from "components/MainCard";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Printer, Receipt1, Refresh, Star1, SearchNormal, Ticket2, Profile, Clock, Calendar, Moneys } from "iconsax-reactjs";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import moment from "moment";
import { SectionHeader } from "pages/bill/component/addEditBill";
import Grid from "@mui/material/Grid";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import Fade from "@mui/material/Fade";

const RedeemBooking = () => {
    const theme = useTheme();
    const {
        control,
        roomList,
        staffList,
        voucherCode,
        voucherDetail,
        isSubmitting,
        reset,
        onSubmit,
        handleSubmit,
        setVoucherCode,
        setVoucherDetail,
        searchVoucherDetail
    } = UseRedeemBooking();

    return (
        <Box>
            <MainCard
                content={false}
                sx={{
                    overflow: 'visible',
                    border: 'none',
                    borderRadius: 4,
                    boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.08)}`,
                    mb: 4
                }}
            >
                {/* ── Hero Header ──────────────────────────────────────── */}
                <Box
                    sx={{
                        px: { xs: 3, md: 4 },
                        py: { xs: 3, md: 4 },
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '16px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }}
                        >
                            <Ticket2 size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={800} lineHeight={1.2} color="text.primary">
                                Redeem Voucher
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                Easily find and redeem customer booking vouchers
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* ── Search Section ──────────────────────────────────────── */}
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
                    >
                        <TextField
                            placeholder="Enter 8-digit voucher code..."
                            value={voucherCode || ''}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchNormal size={20} color={theme.palette.text.secondary} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 3,
                                    height: 56,
                                    bgcolor: alpha(theme.palette.background.default, 0.6),
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    letterSpacing: 1
                                }
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    searchVoucherDetail();
                                }
                            }}
                        />
                        <Button
                            size="large"
                            variant="contained"
                            onClick={searchVoucherDetail}
                            disabled={isSubmitting || voucherDetail}
                            startIcon={<Star1 size={20} variant="Bold" />}
                            sx={{
                                minWidth: { xs: '100%', sm: 180 },
                                height: 56,
                                borderRadius: 3,
                                fontWeight: 700,
                                fontSize: '1rem',
                                flexShrink: 0,
                                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                '&:hover': {
                                    boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Find Voucher
                        </Button>
                    </Stack>
                </Box>
            </MainCard>

            <Fade in={!!voucherDetail} timeout={500}>
                <Box>
                    {voucherDetail && (
                        <>
                            {/* ── Voucher Details Ticket ──────────────────────────────────────── */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    mb: 4,
                                    borderRadius: 4,
                                    border: `1px dashed ${theme.palette.primary.main}`,
                                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Decorative elements for ticket feel */}
                                <Box sx={{ position: 'absolute', top: '50%', left: -16, width: 32, height: 32, bgcolor: 'background.default', borderRadius: '50%', transform: 'translateY(-50%)', borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }} />
                                <Box sx={{ position: 'absolute', top: '50%', right: -16, width: 32, height: 32, bgcolor: 'background.default', borderRadius: '50%', transform: 'translateY(-50%)', borderLeft: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }} />

                                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                                        <Receipt1 size={24} variant="Bold" />
                                    </Box>
                                    <Typography variant="h5" fontWeight={700} color="text.primary">
                                        Voucher Details
                                    </Typography>
                                    <Box sx={{ ml: 'auto !important', px: 2, py: 0.5, borderRadius: 20, bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.dark, fontWeight: 700, fontSize: '0.875rem' }}>
                                        Valid
                                    </Box>
                                </Stack>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Profile size={24} color={theme.palette.text.secondary} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600}>CUSTOMER</Typography>
                                                <Typography variant="subtitle1" fontWeight={700}>{voucherDetail?.px_customer?.name}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Star1 size={24} color={theme.palette.text.secondary} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600}>SERVICE</Typography>
                                                <Typography variant="subtitle1" fontWeight={700}>{voucherDetail?.px_service?.displayName || voucherDetail?.px_service?.name}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Clock size={24} color={theme.palette.text.secondary} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600}>DURATION</Typography>
                                                <Typography variant="subtitle1" fontWeight={700}>{voucherDetail?.duration} Min</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Calendar size={24} color={theme.palette.text.secondary} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600}>PURCHASED ON</Typography>
                                                <Typography variant="subtitle1" fontWeight={700}>{moment(voucherDetail.createdAt).format("DD MMM, YYYY")}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Calendar size={24} color={theme.palette.text.secondary} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600}>BOOKED ON</Typography>
                                                <Typography variant="subtitle1" fontWeight={700}>{moment(voucherDetail.date).format("DD MMM, YYYY")}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Moneys size={24} color={theme.palette.text.secondary} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600}>AMOUNT</Typography>
                                                <Typography variant="subtitle1" fontWeight={700}>{voucherDetail?.grandTotal}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* ── Assignment Form ──────────────────────────────────────── */}
                            <MainCard
                                sx={{
                                    border: 'none',
                                    borderRadius: 4,
                                    boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.08)}`,
                                }}
                            >
                                <Box sx={{ px: { xs: 3, md: 4 }, py: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
                                    <Typography variant="h6" fontWeight={700} color="text.primary">
                                        Assign Resources
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Select the room and therapist for this session
                                    </Typography>
                                </Box>

                                <Box sx={{ p: { xs: 3, md: 4 } }}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Controller
                                                    name="roomID"
                                                    control={control}
                                                    rules={{ required: 'Room is required' }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <Autocomplete
                                                            options={roomList}
                                                            getOptionLabel={(option) => option.roomName}
                                                            isOptionEqualToValue={(option, val) => option.id === val.id}
                                                            value={roomList.find((room) => room.id === value) || null}
                                                            onChange={(_, newValue) => onChange(newValue?.id)}
                                                            onBlur={onBlur}
                                                            renderOption={(props, option) => (
                                                                <li {...props} key={option.id}>
                                                                    <Typography variant="body1">{option.roomName}</Typography>
                                                                </li>
                                                            )}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Treatment Room"
                                                                    error={!!error}
                                                                    helperText={error?.message}
                                                                    variant="outlined"
                                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Controller
                                                    name="staffID"
                                                    control={control}
                                                    rules={{ required: 'Staff is required' }}
                                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                        <Autocomplete
                                                            options={staffList}
                                                            getOptionLabel={(option) => option.label}
                                                            isOptionEqualToValue={(option, val) => option.value === val}
                                                            value={staffList.find((staff) => staff.value === value) || null}
                                                            onChange={(_, newValue) => onChange(newValue?.value)}
                                                            onBlur={onBlur}
                                                            renderOption={(props, option) => (
                                                                <li {...props} key={option.value}>
                                                                    <Typography variant="body1">{option.label}</Typography>
                                                                </li>
                                                            )}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Therapist / Staff"
                                                                    error={!!error}
                                                                    helperText={error?.message}
                                                                    variant="outlined"
                                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Controller
                                                    name="managerName"
                                                    control={control}
                                                    render={({ field: { value } }) => (
                                                        <TextField
                                                            value={value}
                                                            fullWidth
                                                            label="Manager on Duty"
                                                            disabled
                                                            variant="filled"
                                                            helperText="Auto-assigned to current active manager"
                                                            sx={{ '& .MuiFilledInput-root': { borderRadius: 2 } }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* Action Buttons */}
                                        <Stack
                                            direction={{ xs: 'column-reverse', sm: 'row' }}
                                            justifyContent="flex-end"
                                            alignItems="center"
                                            gap={2}
                                            mt={5}
                                        >
                                            <Button
                                                variant="outlined"
                                                size="large"
                                                color="inherit"
                                                startIcon={<Refresh size={18} />}
                                                onClick={() => {
                                                    reset();
                                                    setVoucherCode('');
                                                    setVoucherDetail(null);
                                                }}
                                                sx={{
                                                    borderRadius: 3,
                                                    width: { xs: '100%', sm: 'auto' },
                                                    height: 48,
                                                    fontWeight: 600
                                                }}
                                            >
                                                Start Over
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                startIcon={<Printer size={20} variant="Bold" />}
                                                disabled={isSubmitting}
                                                sx={{
                                                    borderRadius: 3,
                                                    fontWeight: 700,
                                                    fontSize: '1rem',
                                                    width: { xs: '100%', sm: 'auto' },
                                                    height: 48,
                                                    minWidth: 160,
                                                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                                    '&:hover': {
                                                        boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                        transform: 'translateY(-2px)',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {isSubmitting ? 'Processing...' : 'Redeem & Print'}
                                            </Button>
                                        </Stack>
                                    </form>
                                </Box>
                            </MainCard>
                        </>
                    )}
                </Box>
            </Fade>
        </Box>
    )
}

export default RedeemBooking;