import { alpha, useTheme } from "@mui/material/styles";
import {
    Box,
    Grid,
    Stack,
    Typography,
    Autocomplete,
    TextField,
    Button,
    InputAdornment,
    Divider,
    Card,
    CardContent,
    Chip,
    FormControl,
} from "@mui/material";
import moment from "moment";

// Project Imports
import MainCard from "../../components/MainCard";
import useStaffReport from "./hooks/useStaffReport";

// Icons
import {
    DocumentText,
    Calendar,
    Building,
    Wallet,
    Receipt2,
    Chart1,
    InfoCircle,
    Export,
    SearchNormal1,
    MoneyChange,
    Profile2User,
    ArrowRight,
} from "iconsax-reactjs";

// --- Specialized Section Header ---
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

// --- Helper for Report Cards ---
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

// --- New Date Selection Block with Quick Shortcuts ---
const DateSelectionBlock = ({ value, onChange, label, color = "primary" }: any) => {
    const theme = useTheme();
    const startDate = value?.[0] ? moment(value[0]).format('YYYY-MM-DD') : '';
    const endDate = value?.[1] ? moment(value[1]).format('YYYY-MM-DD') : '';

    const handleQuickSelect = (type: string) => {
        let range: [Date, Date] = [new Date(), new Date()];
        switch (type) {
            case 'today':
                range = [moment().toDate(), moment().toDate()];
                break;
            case 'yesterday':
                range = [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()];
                break;
            case 'week':
                range = [moment().subtract(7, 'days').toDate(), moment().toDate()];
                break;
            case 'month':
                range = [moment().startOf('month').toDate(), moment().endOf('month').toDate()];
                break;
            default:
                break;
        }
        onChange(range);
    };

    const palette = theme.palette as any;

    return (
        <Stack spacing={2}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, ml: 1, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {label}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                <TextField
                    fullWidth
                    type="date"
                    size="small"
                    value={startDate}
                    onChange={(e) => onChange([moment(e.target.value).toDate(), value[1]])}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Calendar size={18} variant="Bulk" color={palette[color].main} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Box sx={{ color: 'text.disabled', display: { xs: 'none', sm: 'block' } }}>
                    <ArrowRight size={16} />
                </Box>
                <TextField
                    fullWidth
                    type="date"
                    size="small"
                    value={endDate}
                    onChange={(e) => onChange([value[0], moment(e.target.value).toDate()])}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Calendar size={18} variant="Bulk" color={palette[color].main} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                {['today', 'yesterday', 'week', 'month'].map((type) => (
                    <Chip
                        key={type}
                        label={type.charAt(0).toUpperCase() + type.slice(1)}
                        size="small"
                        clickable
                        variant="outlined"
                        onClick={() => handleQuickSelect(type)}
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: '8px',
                            '&:hover': { bgcolor: alpha(palette[color].main, 0.08) }
                        }}
                    />
                ))}
            </Stack>
        </Stack>
    );
};

const SalesReport = () => {
    const theme = useTheme();
    const {
        dailyReportRights,
        dailyReportDateRange,
        setDailyReportDateRange,
        dailyBranchList,
        selectedDailyReportBranch,
        setSelectedDailyReportBranch,
        fetchDailyReportData,

        isAdmin,
        dateRange,
        gstDateRange,
        companyOptions,
        paymentList,
        selectedPayment,
        selectedGstPayment,
        salesSectionRights,
        fetchReportDate,
        handleDateChange,
        handleBranchChange,
        handlePaymentChange,
        fetchGstReportData,
        handleGstDateChange,
        handleGstPaymentChange,
        auditoDateRange,
        setAuditorSelectedCompany,
        selectedAuditorPayment,
        setSelectedAuditorPayment,
        handleAuditorDateChange,
        fetchAuditorReportData,
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
                            <Chart1 size={48} color="#fff" variant="Bold" />
                        </Box>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h2" fontWeight={900} sx={{ color: '#fff', letterSpacing: '-1px', mb: 1 }}>
                                Sales Intelligence Hub
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400, maxWidth: 600 }}>
                                Professional financial reporting, tax compliance tracking, and detailed auditing modules for your business growth.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </MainCard>

            <Grid container spacing={4}>
                {/* ── Section 1: Standard Sales Report ───────────────────── */}
                {salesSectionRights?.['primary_sales_data'] && salesSectionRights['primary_sales_data']['view'] &&
                    <Grid size={{ xs: 12 }}>
                        <ReportModule>
                            <SectionHeader
                                theme={theme}
                                icon={Wallet}
                                title="Primary Sales Data"
                                subtitle="Export detailed sales records with branch and payment type filtering"
                            />
                            <Grid container spacing={3} alignItems="flex-end">
                                <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                                    <DateSelectionBlock
                                        label="Select Reporting Range"
                                        value={dateRange}
                                        onChange={handleDateChange}
                                    />
                                </Grid>
                                {isAdmin &&
                                    <>
                                        <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block', ml: 1, textTransform: 'uppercase' }}>COMPANY FILTER</Typography>
                                            <Autocomplete
                                                fullWidth
                                                options={companyOptions || []}
                                                getOptionLabel={(option) => option.label}
                                                onChange={(_, newValue) => handleBranchChange(newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Select Company"
                                                        placeholder="All Companies"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start">
                                                                        <Building size={20} variant="Bulk" color={theme.palette.primary.main} />
                                                                    </InputAdornment>
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 3.5 }}>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block', ml: 1, textTransform: 'uppercase' }}>PAYMENT TYPES</Typography>
                                            <Autocomplete
                                                fullWidth
                                                multiple
                                                options={paymentList || []}
                                                getOptionLabel={(option) => option.label}
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                                value={selectedPayment}
                                                onChange={(_, newValue) => handlePaymentChange(newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Payment Types"
                                                        placeholder="Search..."
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start">
                                                                        <MoneyChange size={20} variant="Bulk" color={theme.palette.success.main} />
                                                                    </InputAdornment>
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </>
                                }
                                {salesSectionRights['primary_sales_data'] && salesSectionRights['primary_sales_data']['download'] &&
                                    <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={fetchReportDate}
                                            startIcon={<Export size={24} variant="Bold" />}
                                            sx={{ py: 2, borderRadius: 3, fontWeight: 700, boxShadow: theme.customShadows.primary }}
                                        >
                                            Generate & Export Primary Sales Data
                                        </Button>
                                    </Grid>
                                }
                            </Grid>
                        </ReportModule>
                    </Grid>
                }

                {/* ── Section 2: GST Compliance Report ───────────────────── */}
                {salesSectionRights?.['tax_&_gst_hub'] && salesSectionRights['tax_&_gst_hub']['view'] &&
                    <Grid size={{ xs: 12 }}>
                        <ReportModule sx={{ bgcolor: alpha(theme.palette.primary.lighter, 0.2) }}>
                            <SectionHeader
                                theme={theme}
                                icon={Receipt2}
                                title="Tax & GST Hub"
                                subtitle="Generate government-mandated tax reports for financial compliance"
                            />
                            <Grid container spacing={3} alignItems="flex-end">
                                <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                                    <DateSelectionBlock
                                        label="Tax Compliance Period"
                                        value={gstDateRange}
                                        onChange={handleGstDateChange}
                                        color="primary"
                                    />
                                </Grid>
                                {isAdmin && (
                                    <Grid size={{ xs: 12, sm: 6, md: 7 }}>
                                        <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700, mb: 1, display: 'block', ml: 1, textTransform: 'uppercase' }}>PAYMENT FILTER</Typography>
                                        <Autocomplete
                                            fullWidth
                                            multiple
                                            options={paymentList || []}
                                            getOptionLabel={(option) => option.label}
                                            isOptionEqualToValue={(option, value) => option.value === value.value}
                                            value={selectedGstPayment}
                                            onChange={(_, newValue) => handleGstPaymentChange(newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Filter Payment Type"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <>
                                                                <InputAdornment position="start">
                                                                    <Profile2User size={20} variant="Bulk" color={theme.palette.primary.main} />
                                                                </InputAdornment>
                                                                {params.InputProps.startAdornment}
                                                            </>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                )}
                                {salesSectionRights?.['tax_&_gst_hub'] && salesSectionRights['tax_&_gst_hub']['download'] &&
                                    <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={fetchGstReportData}
                                            startIcon={<Export size={24} variant="Bold" />}
                                            sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}
                                        >
                                            Generate Compliance GST Report
                                        </Button>
                                    </Grid>
                                }
                            </Grid>
                        </ReportModule>
                    </Grid>
                }
                {/* ── Section 3: Financial Auditor Report ────────────────── */}
                {salesSectionRights?.['professional_audit_logs'] && salesSectionRights['professional_audit_logs']['view'] &&
                    <Grid size={{ xs: 12 }}>
                        <ReportModule>
                            <SectionHeader
                                theme={theme}
                                icon={InfoCircle}
                                title="Professional Audit Logs"
                                subtitle="Deep-dive auditing tools for internal financial verification and reporting"
                            />
                            <Grid container spacing={3} alignItems="flex-end">
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <DateSelectionBlock
                                        label="Internal Audit Window"
                                        value={auditoDateRange}
                                        onChange={handleAuditorDateChange}
                                        color="primary"
                                    />
                                </Grid>

                                {isAdmin && (
                                    <>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700, mb: 1, display: 'block', ml: 1, textTransform: 'uppercase' }}>AUDIT COMPANY</Typography>
                                            <Autocomplete
                                                fullWidth
                                                options={companyOptions || []}
                                                getOptionLabel={(option) => option.label}
                                                onChange={(_, newValue) => setAuditorSelectedCompany(newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Review Company"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start">
                                                                        <SearchNormal1 size={20} variant="Bulk" color={theme.palette.primary.main} />
                                                                    </InputAdornment>
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700, mb: 1, display: 'block', ml: 1, textTransform: 'uppercase' }}>AUDIT PAYMENTS</Typography>
                                            <Autocomplete
                                                fullWidth
                                                multiple
                                                options={paymentList || []}
                                                getOptionLabel={(option) => option.label}
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                                value={selectedAuditorPayment}
                                                onChange={(_, newValue) => setSelectedAuditorPayment(newValue)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Audit Payment Types"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start">
                                                                        <Wallet size={20} variant="Bulk" color={theme.palette.primary.main} />
                                                                    </InputAdornment>
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </>
                                )}
                                {salesSectionRights['professional_audit_logs'] && salesSectionRights['professional_audit_logs']['download'] &&
                                    <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={fetchAuditorReportData}
                                            startIcon={<DocumentText size={24} variant="Bold" />}
                                            sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}
                                        >
                                            Export Detailed Audit Logs
                                        </Button>
                                    </Grid>
                                }
                            </Grid>
                        </ReportModule>
                    </Grid>
                }
                {dailyReportRights.view &&
                    <Grid size={{ xs: 12 }}>
                        <ReportModule>
                            <SectionHeader
                                theme={theme}
                                icon={InfoCircle}
                                title="Export Daily Reports"
                                subtitle="Generate branch summaries"
                            />
                            <Grid container spacing={3} alignItems="flex-end">
                                <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                                    <FormControl fullWidth>
                                        <TextField
                                            type="date"
                                            label="Select Date"
                                            value={dailyReportDateRange}
                                            onChange={(e) => setDailyReportDateRange(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4, md: 5 }}>
                                    <Autocomplete
                                        freeSolo
                                        fullWidth
                                        id="branchID"
                                        getOptionLabel={(option) => option.lastName || option.branchName || ''}
                                        options={dailyBranchList || []}
                                        onChange={(_event, value) => setSelectedDailyReportBranch(value || null)}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                {option.lastName || option.branchName}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Branch" />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4, md: 'auto' }}>
                                    {dailyReportRights.download &&
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={fetchDailyReportData}
                                            sx={{ minWidth: 120, height: 50, px: 3, boxShadow: 'none' }}
                                        >
                                            Export PDF
                                        </Button>
                                    }
                                </Grid>
                            </Grid>
                        </ReportModule>
                    </Grid>
                }
            </Grid>
        </Box>
    );
}; export default SalesReport;
