import { alpha, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import UseCompanyStaffPaymentReport from "./hooks/useCompanyStaffPaymentReport";

import MainCard from "components/MainCard";
import {
    Calendar,
    Building,
    User,
    Money,
    Bank,
    DocumentDownload,
    Filter,
    Wallet,
    Profile2User,
    Briefcase
} from "iconsax-reactjs";

const CompanyStaffPaymentReport = () => {
    const theme = useTheme();
    const {
        year,
        month,
        userList,
        companyList,
        paymentBankList,
        setYear,
        setMonth,
        getReport,
        fetchUserList,
        setSelectedUser,
        setSelectedCompany,
        setSelectedPaymentBank
    } = UseCompanyStaffPaymentReport();

    return (
        <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
            {/* ── Hero Header ──────────────────────────────────────── */}
            <Box
                sx={{
                    px: 3,
                    py: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
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
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                            flexShrink: 0
                        }}
                    >
                        <Bank size={32} color="#fff" variant="Bold" />
                    </Box>
                    <Box>
                        <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                            Salary Payment Sheet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Generate and download bank-ready salary payment reports for your company.
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                <Grid container spacing={4}>
                    {/* ── Configuration Section ───────────────────────────── */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                            <Filter size={24} color={theme.palette.primary.main} variant="Bulk" />
                            <Typography variant="h5" fontWeight={700}>Report Configuration</Typography>
                        </Stack>

                        <Grid container spacing={3}>
                            {/* Time Selection Group */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                                        {["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"].map((m, i) => (
                                            <MenuItem key={m} value={i + 1}>{m}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Autocomplete
                                    fullWidth
                                    options={[...Array(10)].map((_, i) => new Date().getFullYear() - i)}
                                    getOptionLabel={(option) => option.toString()}
                                    isOptionEqualToValue={(option: any, value: any) => option === value}
                                    value={year}
                                    onChange={(_, newValue: any) => setYear(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Year"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Calendar size={20} color={theme.palette.text.disabled} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Entity Group */}
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    options={companyList || []}
                                    getOptionLabel={(option) => option.companyName || ''}
                                    onChange={(_, newValue) => {
                                        setSelectedCompany(newValue?.id);
                                        fetchUserList(newValue?.id);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Company"
                                            placeholder="Choose branch/company..."
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

                            {/* Secondary Information */}
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    options={userList || []}
                                    getOptionLabel={(option: any) => option.label || ''}
                                    onChange={(_, newValue) => setSelectedUser(newValue || [])}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Personnel (Multiple)"
                                            placeholder="Choose staff members..."
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start" sx={{ ml: 1 }}>
                                                            <Profile2User size={20} color={theme.palette.text.disabled} />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    options={paymentBankList || []}
                                    getOptionLabel={(option: any) => option.bankName || ''}
                                    onChange={(_, newValue) => setSelectedPaymentBank(newValue?.id)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Payment Bank"
                                            placeholder="Choose source bank..."
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start" sx={{ ml: 1 }}>
                                                            <Wallet size={20} color={theme.palette.text.disabled} />
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
                                                <Wallet size={18} variant="Bulk" color={theme.palette.secondary.main} />
                                                <Typography>{option.bankName}</Typography>
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
                        maxWidth: 450,
                        borderRadius: '12px',
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        boxShadow: `0 12px 24px ${alpha(theme.palette.secondary.main, 0.35)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: `0 16px 30px ${alpha(theme.palette.secondary.main, 0.45)}`,
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    Get Salary Payment Report
                </Button>
            </Box>
        </MainCard>
    );
};

export default CompanyStaffPaymentReport;