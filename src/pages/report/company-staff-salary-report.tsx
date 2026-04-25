import { alpha, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import MainCard from "components/MainCard";
import {
    Calendar,
    Building,
    Briefcase,
    DocumentDownload,
    Filter
} from "iconsax-reactjs";

import UseCompanyStaffSalaryReport from "./hooks/useCompanyStaffSalaryReport";
import CompanyStaffPaymentReport from "./company-staff-payment";

const CompanyStaffSalaryReport = () => {
    const theme = useTheme();
    const {
        year,
        month,
        companyList,
        setYear,
        setMonth,
        getReport,
        setSelectedCompany
    } = UseCompanyStaffSalaryReport();

    return (
        <>
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
                            <Briefcase size={32} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                Company Salary Report
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Generate and download comprehensive salary reports for company staff.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Grid container spacing={4}>
                        {/* ── Filters Section ─────────────────────────────────── */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <Filter size={24} color={theme.palette.primary.main} variant="Bulk" />
                                <Typography variant="h5" fontWeight={700}>Report Configuration</Typography>
                            </Stack>
                            <Grid container spacing={3}>
                                {/* Month Selector */}
                                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="month-label">Select Month</InputLabel>
                                        <Select
                                            labelId="month-label"
                                            label="Select Month"
                                            value={month || ''}
                                            onChange={(e) => setMonth(Number(e.target.value))}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <Calendar size={20} color={theme.palette.text.disabled} />
                                                </InputAdornment>
                                            }
                                        >
                                            {[
                                                "Jan", "Feb", "March", "Apr", "May", "June",
                                                "July", "Aug", "Sept", "Oct", "Nov", "Dec"
                                            ].map((m, i) => (
                                                <MenuItem key={m} value={i + 1}>{m}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Year Input */}
                                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Year"
                                        placeholder="e.g. 2024"
                                        value={year}
                                        onChange={(e) => {
                                            if (e.target.value.length < 5) {
                                                setYear(e.target.value);
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Calendar size={20} color={theme.palette.text.disabled} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>

                                {/* Company Autocomplete */}
                                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                    <Autocomplete
                                        fullWidth
                                        options={companyList || []}
                                        getOptionLabel={(option) => option.companyName || ''}
                                        onChange={(_event, value) => setSelectedCompany(value ? value.id : null)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Company"
                                                placeholder="Type company name..."
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <InputAdornment position="start" sx={{ ml: 1 }}>
                                                                <Building size={20} color={theme.palette.text.disabled} />
                                                            </InputAdornment>
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    )
                                                }}
                                            />
                                        )}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Building size={18} variant="Bulk" color={theme.palette.primary.main} />
                                                    <Typography>{option.companyName}</Typography>
                                                </Stack>
                                            </li>
                                        )}
                                    />
                                </Grid>
                            </Grid>
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
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={getReport}
                        startIcon={<DocumentDownload size={22} variant="Bold" />}
                        sx={{
                            maxWidth: 400,
                            borderRadius: '12px',
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: `0 16px 30px ${alpha(theme.palette.primary.main, 0.45)}`,
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Get Salary Report
                    </Button>
                </Box>
            </MainCard>
            <br />
            <CompanyStaffPaymentReport />
        </>
    );
}

export default CompanyStaffSalaryReport;