import { alpha, useTheme } from "@mui/material/styles";
import UseRekycStaff from "../hooks/useRekycStaff";
import MainCard from "components/MainCard";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ArrowLeft, People, Briefcase, Personalcard, ShieldTick, Wallet, DocumentText } from "iconsax-reactjs";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FileUpload from "components/FileUpload";
import InputAdornment from '@mui/material/InputAdornment';

const RekycStaff = () => {
    const theme = useTheme();
    const {
        staffData,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
    } = UseRekycStaff();

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <MainCard
                    content={false}
                    sx={{
                        overflow: 'visible',
                        border: (t) => `1px solid ${t.palette.divider}`,
                        borderRadius: '16px',
                        boxShadow: (t: any) => t.customShadows?.z1 || 1,
                    }}
                >
                    {/* ── Hero Header ──────────────────────────────────────── */}
                    <Box
                        sx={(t) => ({
                            px: 3,
                            py: 3.5,
                            background: `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.08)} 0%, ${alpha(t.palette.secondary.main, 0.04)} 100%)`,
                            borderBottom: `1px solid ${t.palette.divider}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                            borderTopLeftRadius: '16px',
                            borderTopRightRadius: '16px',
                        })}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                                sx={(t) => ({
                                    width: 48,
                                    height: 48,
                                    borderRadius: '14px',
                                    background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 8px 16px ${alpha(t.palette.primary.main, 0.3)}`,
                                })}
                            >
                                <People size={24} color="#fff" variant="Bold" />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
                                    Staff Re-KYC Update
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Manage and securely upload staff KYC compliance documents
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleBack}
                            startIcon={<ArrowLeft size={16} />}
                            sx={{ borderRadius: '10px', px: 2 }}
                        >
                            Back to List
                        </Button>
                    </Box>

                    <Box sx={{ p: 4, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                        <Grid container spacing={3}>

                            {/* ── Aadhaar Card ────────────────────────────────────── */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box sx={{ p: 3, height: '100%', bgcolor: 'background.paper', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, transition: 'all 0.3s ease', '&:hover': { boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.08)}`, borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                            <Personalcard size={22} variant="Bulk" />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700}>Aadhaar Details</Typography>
                                            <Typography variant="caption" color="text.secondary">Primary Identity Document</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack spacing={2.5}>
                                        <Controller
                                            name="aadhaarCard"
                                            control={control}
                                            rules={{
                                                required: 'Aadhaar Number is required',
                                                pattern: {
                                                    value: /^[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}$/,
                                                    message: 'Please enter a valid Aadhaar Number'
                                                }
                                            }}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label="Aadhaar Number"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><Personalcard size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="aadhaarCardPdf"
                                            control={control}
                                            rules={{ required: 'Aadhaar Document is required' }}
                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                <FileUpload
                                                    value={value}
                                                    onChange={onChange}
                                                    accept="image/*, application/pdf"
                                                    maxSize={2097152} // 2MB
                                                    label="Upload Aadhaar Document"
                                                    multiple={true}
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* ── PAN Card ───────────────────────────────────────── */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box sx={{ p: 3, height: '100%', bgcolor: 'background.paper', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, transition: 'all 0.3s ease', '&:hover': { boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.08)}`, borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                            <Wallet size={22} variant="Bulk" />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700}>PAN Details</Typography>
                                            <Typography variant="caption" color="text.secondary">Tax & Financial Identity</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack spacing={2.5}>
                                        <Controller
                                            name="panNo"
                                            control={control}
                                            rules={{
                                                required: 'PAN Number is required',
                                                pattern: {
                                                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                                                    message: 'Please enter a valid PAN Number'
                                                }
                                            }}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label="PAN Number"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><Wallet size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="panPdf"
                                            control={control}
                                            rules={{ required: 'PAN Document is required' }}
                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                <FileUpload
                                                    value={value}
                                                    onChange={onChange}
                                                    accept="image/*, application/pdf"
                                                    maxSize={2097152} // 2MB
                                                    label="Upload PAN Document"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* ── UAN Details ────────────────────────────────────── */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box sx={{ p: 3, height: '100%', bgcolor: 'background.paper', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, transition: 'all 0.3s ease', '&:hover': { boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.08)}`, borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                            <Briefcase size={22} variant="Bulk" />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700}>UAN Details</Typography>
                                            <Typography variant="caption" color="text.secondary">Provident Fund Account</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack spacing={2.5}>
                                        <Controller
                                            name="uanNumber"
                                            control={control}
                                            rules={{
                                                required: 'UAN Number is required',
                                                pattern: {
                                                    value: /^[0-9]{12}$/,
                                                    message: 'Please enter a valid UAN Number'
                                                }
                                            }}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label="UAN Number"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><Briefcase size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="uanDoc"
                                            control={control}
                                            rules={{ required: 'UAN Document is required' }}
                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                <FileUpload
                                                    value={value}
                                                    onChange={onChange}
                                                    accept="image/*, application/pdf"
                                                    maxSize={2097152} // 2MB
                                                    label="Upload UAN Document"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* ── Voter ID Details ───────────────────────────────── */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box sx={{ p: 3, height: '100%', bgcolor: 'background.paper', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, transition: 'all 0.3s ease', '&:hover': { boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.08)}`, borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                            <ShieldTick size={22} variant="Bulk" />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700}>Voter ID Details</Typography>
                                            <Typography variant="caption" color="text.secondary">Secondary Identity Document</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack spacing={2.5}>
                                        <Controller
                                            name="voterIdNumber"
                                            control={control}
                                            rules={{
                                                required: 'Voter ID Number is required',
                                                pattern: {
                                                    value: /^[A-Z]{3}[0-9]{7}$/,
                                                    message: 'Please enter a valid Voter ID Number'
                                                }
                                            }}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label="Voter ID Number"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><ShieldTick size={18} color={theme.palette.text.disabled} /></InputAdornment> }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="voterIdPdf"
                                            control={control}
                                            rules={{ required: 'Voter ID Document is required' }}
                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                <FileUpload
                                                    value={value}
                                                    onChange={onChange}
                                                    accept="image/*, application/pdf"
                                                    maxSize={2097152} // 2MB
                                                    label="Upload Voter ID Document"
                                                    multiple={true}
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* ── Other Documents ────────────────────────────────── */}
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, transition: 'all 0.3s ease', '&:hover': { boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.08)}`, borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, display: 'flex' }}>
                                            <DocumentText size={22} variant="Bulk" />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700}>Other Documents</Typography>
                                            <Typography variant="caption" color="text.secondary">Any additional KYC or compliance documents</Typography>
                                        </Box>
                                    </Stack>
                                    <Box>
                                        <Controller
                                            name="otherDocument"
                                            control={control}
                                            // rules={{ required: 'Other Document is required' }}
                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                <FileUpload
                                                    value={value}
                                                    onChange={onChange}
                                                    accept="image/*, application/pdf"
                                                    maxSize={2097152} // 2MB
                                                    label="Upload Additional Documents"
                                                    multiple={true}
                                                // error={!!error}
                                                // helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                        </Grid>
                    </Box>

                    {/* ── Footer Actions ───────────────────────────────────── */}
                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.secondary.main, 0.02), borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end', gap: 2, borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                        <Button variant="outlined" color="secondary" onClick={handleBack} sx={{ minWidth: 100, borderRadius: 2 }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                minWidth: 160,
                                borderRadius: 2,
                                fontWeight: 700,
                                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
                                '&:hover': {
                                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isSubmitting ? 'Saving...' : 'Submit Re-KYC'}
                        </Button>
                    </Box>
                </MainCard>
            </form>
        </>
    )
}

export default RekycStaff;