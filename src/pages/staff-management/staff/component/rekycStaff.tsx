import { alpha, useTheme } from "@mui/material/styles";
import UseRekycStaff from "../hooks/useRekycStaff";
import MainCard from "components/MainCard";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ArrowLeft, People } from "iconsax-reactjs";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FileUpload from "components/FileUpload";

const RekycStaff = () => {
    const theme = useTheme();
    const {
        staffData,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
        getValues,
        setValue,
    } = UseRekycStaff();
    return (
        <>
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
                        py: 3,
                        background: `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.1)} 0%, ${alpha(t.palette.primary.light, 0.05)} 100%)`,
                        borderBottom: `1px solid ${t.palette.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
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
                                boxShadow: `0 8px 14px ${alpha(t.palette.primary.main, 0.35)}`,
                            })}
                        >
                            <People size={24} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
                                Staff Re-KYC
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Here you can update staff documents
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
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="uanNumber"
                                control={control}
                                rules={{
                                    required: 'UAN Number is required'
                                }}
                                render={({ field, fieldState: { error } }) => {
                                    return (
                                        <TextField
                                            {...field}
                                            label='UAN Number'
                                            fullWidth
                                            margin="normal"
                                            type="number"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="uanDoc"
                                control={control}
                                rules={{
                                    required: 'UAN Document is required'
                                }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <FileUpload
                                        value={value}
                                        onChange={onChange}
                                        accept="image/*"
                                        maxSize={2097152} // 2MB
                                        label="UAN Document"
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="aadhaarCard"
                                control={control}
                                rules={{
                                    required: 'Aadhaar Card is required'
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label='Aadhaar Card'
                                        fullWidth
                                        margin="normal"
                                        type="number"
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="aadhaarCardPdf"
                                control={control}
                                rules={{
                                    required: 'Aadhaar Card Pdf is required'
                                }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <FileUpload
                                        value={value}
                                        onChange={onChange}
                                        accept="image/*"
                                        maxSize={2097152} // 2MB
                                        label="Aadhaar Card Pdf"
                                        multiple={true}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="panNo"
                                control={control}
                                rules={{
                                    required: 'Pan Card is required'
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label='Pan Card'
                                        fullWidth
                                        margin="normal"
                                        type="text"
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="panPdf"
                                control={control}
                                rules={{
                                    required: 'Pan Card Pdf is required'
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <FileUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        accept="image/*"
                                        maxSize={2097152} // 2MB
                                        label="Pan Card Pdf"
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="voterIdNumber"
                                control={control}
                                rules={{
                                    required: 'Voter ID Number is required'
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label='Voter ID Number'
                                        fullWidth
                                        margin="normal"
                                        type="text"
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="voterIdPdf"
                                control={control}
                                rules={{
                                    required: 'Voter ID Pdf is required'
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <FileUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        accept="image/*"
                                        maxSize={2097152} // 2MB
                                        label="Voter ID Pdf"
                                        multiple={true}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="otherDocument"
                                control={control}
                                rules={{
                                    required: 'Other Document is required'
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <FileUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        accept="image/*"
                                        maxSize={2097152} // 2MB
                                        label="Other Document"
                                        multiple={true}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
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
                        {isSubmitting ? 'Saving...' : 'Save Re-KYC'}
                    </Button>
                </Box>
            </MainCard>
        </>
    )
}

export default RekycStaff;