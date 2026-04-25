import { alpha, useTheme } from "@mui/material/styles";
import {
    Box,
    Grid,
    Stack,
    Typography,
    Autocomplete,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    InputAdornment,
    Divider,
    Card,
    CardContent,
} from "@mui/material";

// Project Imports
import MainCard from "components/MainCard";
import useStaffReport from "./hooks/useStaffReport";

// Icons
import {
    DocumentText,
    Profile2User,
    Calendar,
    Wallet,
    SearchNormal1,
    Building,
    PercentageCircle,
    MoneyChange,
    InfoCircle,
    DirectboxReceive,
    ChartSquare,
    Receipt2,
    TrendUp,
    Briefcase,
    StatusUp,
    Export
} from "iconsax-reactjs";

// Specialized Section Header for "Easy UX"
const SectionHeader = ({ icon: Icon, title, subtitle, theme }: any) => (
    <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
        <Box
            sx={{
                width: 52,
                height: 52,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.1)}`
            }}
        >
            <Icon size={32} variant="Bulk" />
        </Box>
        <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.2px' }}>{title}</Typography>
            {subtitle && <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{subtitle}</Typography>}
        </Box>
    </Stack>
);

// Helper for Report Cards
const ReportModule = ({ children, sx }: any) => (
    <Card
        sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 14px 0 rgba(32, 40, 45, 0.04)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 8px 32px 0 rgba(32, 40, 45, 0.08)',
                transform: 'translateY(-2px)',
                borderColor: 'primary.light'
            },
            ...sx
        }}
    >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            {children}
        </CardContent>
    </Card>
);

const StaffReport = () => {
    const theme = useTheme();
    const {
        attUserList,
        setSelectedAttUser,
        fetchStaffList,
        attMonth,
        setAttMonth,
        attYear,
        setAttYear,
        setSelectedStaff,
        pdfData,
        staffList,
        year,
        month,
        userList,
        setSelectedUser,
        isAdmin,
        managerDateRange,
        managerList,
        companyOptions,
        serviceList,
        salesType,
        setSalesType,
        // selectedService,
        setYear,
        setMonth,
        fetchUserList,
        handleBranchChange,
        fetchManagerReportData,
        handleManagerDateChange,
        handleManagerChange,
        setSelectedService,
        fetchAttendanceReportData,
        fetchStaffAttendanceReportData,
        setSelectedInsentiveManager,
        insentiveManagerYear,
        setInsentiveManagerYear,
        insentiveManagerMonth,
        setInsentiveManagerMonth,
        fetchInsentiveManagerReportData,
        weekDays,
        weekDaysPercentage,
        weekEnd,
        weekEndPercentage,
        setWeekDays,
        setWeekDaysPercentage,
        setweekEnd,
        setWeekEndPercentage,
        setAuditorStaffSelectedYear,
        setAuditorStaffSelectedMonth,
        setAuditorStaffSelectedBranch,
        setAuditorStaffSelectedCompany,
        fetchAuditorStaffReportData
    } = useStaffReport();

    return (
        <Box sx={{ maxWidth: 1600, margin: '0 auto', pb: 8 }}>
            {/* ── Hero Header ──────────────────────────────────────── */}
            <MainCard content={false} sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', border: 'none', boxShadow: theme.customShadows?.z1 }}>
                <Box
                    sx={{
                        px: { xs: 3, sm: 6 },
                        py: 6,
                        background: `linear-gradient(135deg, ${theme.palette.primary.darker} 0%, ${theme.palette.primary.main} 100%)`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative Elements */}
                    <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)', filter: 'blur(40px)' }} />
                    <Box sx={{ position: 'absolute', bottom: -100, left: -20, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.1)', filter: 'blur(60px)' }} />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '24px',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.3)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                            }}
                        >
                            <DocumentText size={48} color="#fff" variant="Bold" />
                        </Box>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h2" fontWeight={900} sx={{ color: '#fff', letterSpacing: '-1px', mb: 1 }}>
                                Staff Reports Hub
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400, maxWidth: 600 }}>
                                Professional performance tracking, incentive calculations, and compliance auditing in one centralized dashboard.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </MainCard>

            <Grid container spacing={4}>
                {/* ── Section 1: Manager Incentive Report ───────────────────── */}
                <Grid size={{ xs: 12 }}>
                    <ReportModule>
                        <SectionHeader
                            theme={theme}
                            icon={Wallet}
                            title="Staff Incentive Calculator"
                            subtitle="Calculate and export dynamic incentive reports based on performance metrics"
                        />
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Autocomplete
                                    fullWidth
                                    options={managerList || []}
                                    getOptionLabel={(option) => `${option?.nickName} (${option?.name})`}
                                    onChange={(_, newValue) => {
                                        if (newValue && newValue?.id) setSelectedInsentiveManager(newValue?.id);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Target Manager/Staff"
                                            placeholder="Search by name..."
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Profile2User size={22} color={theme.palette.primary.main} variant="Bulk" />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                <Autocomplete
                                    fullWidth
                                    options={[...Array(10)].map((_, i) => new Date().getFullYear() - i)}
                                    getOptionLabel={(option) => option.toString()}
                                    value={insentiveManagerYear}
                                    onChange={(_, newValue) => newValue && setInsentiveManagerYear(newValue)}
                                    renderInput={(params) => <TextField {...params} label="Select Year" />}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                <Autocomplete
                                    fullWidth
                                    options={[...Array(12)].map((_, i) => i + 1)}
                                    getOptionLabel={(option) => {
                                        const date = new Date();
                                        date.setMonth(option - 1);
                                        return date.toLocaleString('default', { month: 'long' });
                                    }}
                                    value={insentiveManagerMonth}
                                    onChange={(_, newValue) => newValue && setInsentiveManagerMonth(newValue)}
                                    renderInput={(params) => <TextField {...params} label="Select Month" />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                                    <Typography variant="caption" fontWeight={700} color="primary" sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>Calculation Logic</Typography>
                                    <RadioGroup row value={salesType} onChange={(e) => {
                                        const type = parseInt(e.target.value);
                                        setSalesType(type);
                                        setWeekDays("");
                                        setWeekDaysPercentage("");
                                        setweekEnd("");
                                        setWeekEndPercentage("");
                                    }}>
                                        <FormControlLabel value={0} control={<Radio />} label={<Typography variant="body2" fontWeight={600}>All Days Plan</Typography>} />
                                        <FormControlLabel value={1} control={<Radio />} label={<Typography variant="body2" fontWeight={600}>Weekend-Wise Plan</Typography>} />
                                    </RadioGroup>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ p: 4, borderRadius: 4, bgcolor: alpha(theme.palette.secondary.main, 0.02), border: `1px dashed ${theme.palette.divider}` }}>
                                    <Grid container spacing={4}>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                label={salesType === 1 ? "Mon - Fri Amount (₹)" : "Tier 1 Amount (₹)"}
                                                value={weekDays || ''}
                                                onChange={(e) => setWeekDays(e.target.value)}
                                                placeholder="e.g. 5000"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><MoneyChange size={22} color={theme.palette.success.main} variant="Bulk" /></InputAdornment>
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                label={salesType === 1 ? "Mon - Fri Rate (%)" : "Tier 1 Rate (%)"}
                                                value={weekDaysPercentage || ''}
                                                onChange={(e) => setWeekDaysPercentage(e.target.value)}
                                                placeholder="e.g. 10"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><PercentageCircle size={22} color={theme.palette.info.main} variant="Bulk" /></InputAdornment>
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                label={salesType === 1 ? "Sat - Sun Amount (₹)" : "Tier 2 Amount (₹)"}
                                                value={weekEnd || ''}
                                                onChange={(e) => setweekEnd(e.target.value)}
                                                placeholder="e.g. 8000"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><MoneyChange size={22} color={theme.palette.warning.main} variant="Bulk" /></InputAdornment>
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                label={salesType === 1 ? "Sat - Sun Rate (%)" : "Tier 2 Rate (%)"}
                                                value={weekEndPercentage || ''}
                                                onChange={(e) => setWeekEndPercentage(e.target.value)}
                                                placeholder="e.g. 15"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><PercentageCircle size={22} color={theme.palette.error.main} variant="Bulk" /></InputAdornment>
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => fetchInsentiveManagerReportData()}
                                    startIcon={<Export size={24} variant="Bold" />}
                                    sx={{ px: 6, py: 1.8, borderRadius: 3, boxShadow: theme.customShadows?.primary }}
                                >
                                    Generate Incentive Report
                                </Button>
                            </Grid>
                        </Grid>
                    </ReportModule>
                </Grid>

                {/* ── Section 2: Attendance Detail ──────────────────────────── */}
                <Grid size={{ xs: 12 }}>
                    <ReportModule>
                        <SectionHeader
                            theme={theme}
                            icon={ChartSquare}
                            title="Staff Attendance Analytics"
                            subtitle="Detailed breakdown of individual staff attendance and working hours"
                        />
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Autocomplete
                                    fullWidth
                                    options={attUserList || []}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(_, newValue) => {
                                        if (newValue && newValue?.value) {
                                            setSelectedAttUser(newValue?.value);
                                            fetchStaffList(newValue?.value);
                                        } else {
                                            setSelectedAttUser(null);
                                            setSelectedStaff(null);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Branch / User"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Building size={22} color={theme.palette.primary.main} variant="Bulk" />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Autocomplete
                                    fullWidth
                                    options={staffList || []}
                                    getOptionLabel={(option) => `${option?.nickName} (${option?.label})`}
                                    onChange={(_, newValue) => setSelectedStaff(newValue ? newValue.value : null)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Target Staff Member"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Profile2User size={22} color={theme.palette.primary.main} variant="Bulk" />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                                <Autocomplete
                                    fullWidth
                                    options={[...Array(10)].map((_, i) => new Date().getFullYear() - i)}
                                    getOptionLabel={(option) => option.toString()}
                                    value={attYear}
                                    onChange={(_, newValue) => newValue && setAttYear(newValue)}
                                    renderInput={(params) => <TextField {...params} label="Year" />}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                                <Autocomplete
                                    fullWidth
                                    options={[...Array(12)].map((_, i) => i + 1)}
                                    getOptionLabel={(option) => {
                                        const date = new Date();
                                        date.setMonth(option - 1);
                                        return date.toLocaleString('default', { month: 'long' });
                                    }}
                                    value={attMonth}
                                    onChange={(_, newValue) => newValue && setAttMonth(newValue)}
                                    renderInput={(params) => <TextField {...params} label="Month" />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => fetchStaffAttendanceReportData()}
                                    startIcon={<SearchNormal1 size={22} variant="Bold" />}
                                    sx={{ height: 50, borderRadius: 3 }}
                                >
                                    Analyze
                                </Button>
                            </Grid>

                            {pdfData && (
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ mt: 4, borderRadius: 4, overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, boxShadow: theme.customShadows?.z1 }}>
                                        <iframe
                                            title="Attendance PDF Report"
                                            src={pdfData}
                                            width="100%"
                                            style={{ height: "calc(100vh - 200px)", border: 'none' }}
                                        />
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </ReportModule>
                </Grid>

                {/* ── Admin Exclusive Sections ─────────────────────────────── */}
                {isAdmin && (
                    <>
                        {/* Manager Performance Tracker */}
                        <Grid size={{ xs: 12 }}>
                            <ReportModule>
                                <SectionHeader
                                    theme={theme}
                                    icon={StatusUp}
                                    title="Manager Performance Summary"
                                    subtitle="Comprehensive performance grading based on service delivery and efficiency"
                                />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Autocomplete
                                            fullWidth
                                            options={managerList || []}
                                            getOptionLabel={(option) => `${option?.nickName} (${option?.name})`}
                                            onChange={(_, newValue) => newValue?.id && handleManagerChange(newValue.id)}
                                            renderInput={(params) => <TextField {...params} label="Select Manager" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Autocomplete
                                            fullWidth
                                            options={serviceList || []}
                                            getOptionLabel={(option) => option.label}
                                            onChange={(_, newValue) => newValue?.value && setSelectedService(newValue.value)}
                                            renderInput={(params) => <TextField {...params} label="Service Scope" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField
                                                type="date"
                                                fullWidth
                                                label="From Date"
                                                InputLabelProps={{ shrink: true }}
                                                value={managerDateRange[0] ? new Date(managerDateRange[0]).toISOString().split('T')[0] : ''}
                                                onChange={(e) => handleManagerDateChange([new Date(e.target.value), managerDateRange[1]])}
                                            />
                                            <TextField
                                                type="date"
                                                fullWidth
                                                label="To Date"
                                                InputLabelProps={{ shrink: true }}
                                                value={managerDateRange[1] ? new Date(managerDateRange[1]).toISOString().split('T')[0] : ''}
                                                onChange={(e) => handleManagerDateChange([managerDateRange[0], new Date(e.target.value)])}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={() => fetchManagerReportData()}
                                            startIcon={<TrendUp size={22} />}
                                            sx={{ height: 50, borderRadius: 3 }}
                                        >
                                            Export Stats
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ReportModule>
                        </Grid>

                        {/* Branch Salary & Attendance Summary */}
                        <Grid size={{ xs: 12 }}>
                            <ReportModule>
                                <SectionHeader
                                    theme={theme}
                                    icon={Briefcase}
                                    title="Branch Salary Summary"
                                    subtitle="Consolidated salary and attendance overview for branches and companies"
                                />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Autocomplete
                                            fullWidth
                                            options={companyOptions || []}
                                            getOptionLabel={(option) => option.label}
                                            onChange={(_, newValue) => {
                                                handleBranchChange(newValue);
                                                newValue?.value && fetchUserList(newValue.value);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Select Company" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Autocomplete
                                            fullWidth
                                            options={userList || []}
                                            getOptionLabel={(option) => option.label}
                                            onChange={(_, newValue) => setSelectedUser(newValue ? newValue.value : null)}
                                            renderInput={(params) => <TextField {...params} label="Select User" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 6, md: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            options={[...Array(10)].map((_, i) => new Date().getFullYear() - i)}
                                            getOptionLabel={(option) => option.toString()}
                                            value={year}
                                            onChange={(_, newValue) => newValue && setYear(newValue)}
                                            renderInput={(params) => <TextField {...params} label="Year" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 6, md: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            options={[...Array(12)].map((_, i) => i + 1)}
                                            getOptionLabel={(option) => {
                                                const date = new Date();
                                                date.setMonth(option - 1);
                                                return date.toLocaleString('default', { month: 'long' });
                                            }}
                                            value={month}
                                            onChange={(_, newValue) => newValue && setMonth(newValue)}
                                            renderInput={(params) => <TextField {...params} label="Month" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={() => fetchAttendanceReportData()}
                                            startIcon={<DirectboxReceive size={22} />}
                                            sx={{ height: 50, borderRadius: 3 }}
                                        >
                                            Export Summary
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ReportModule>
                        </Grid>

                        {/* Auditor Staff Detail Report */}
                        <Grid size={{ xs: 12 }}>
                            <ReportModule>
                                <SectionHeader
                                    theme={theme}
                                    icon={InfoCircle}
                                    title="Auditor Staff Intelligence"
                                    subtitle="Deep-dive auditing for staff members across companies and branches"
                                />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Autocomplete
                                            fullWidth
                                            options={companyOptions || []}
                                            getOptionLabel={(option) => option.label}
                                            onChange={(_, newValue) => {
                                                handleBranchChange(newValue);
                                                newValue?.value && fetchUserList(newValue.value);
                                                setAuditorStaffSelectedCompany(newValue?.value || null);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Target Company" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Autocomplete
                                            fullWidth
                                            multiple
                                            options={userList || []}
                                            getOptionLabel={(option) => option.label}
                                            onChange={(_, newValue) => setAuditorStaffSelectedBranch(newValue || [])}
                                            renderInput={(params) => <TextField {...params} label="Select Branches" placeholder="Multi-select" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            options={[...Array(10)].map((_, i) => new Date().getFullYear() - i)}
                                            getOptionLabel={(option) => option.toString()}
                                            onChange={(_, newValue) => newValue && setAuditorStaffSelectedYear(newValue)}
                                            renderInput={(params) => <TextField {...params} label="Report Year" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            options={[...Array(12)].map((_, i) => i + 1)}
                                            getOptionLabel={(option) => {
                                                const date = new Date();
                                                date.setMonth(option - 1);
                                                return date.toLocaleString('default', { month: 'long' });
                                            }}
                                            onChange={(_, newValue) => newValue && setAuditorStaffSelectedMonth(newValue)}
                                            renderInput={(params) => <TextField {...params} label="Report Month" />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={() => fetchAuditorStaffReportData()}
                                            startIcon={<InfoCircle size={22} variant="Bold" />}
                                            sx={{ height: 50, borderRadius: 3 }}
                                        >
                                            Export Audit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ReportModule>
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );
};

export default StaffReport;