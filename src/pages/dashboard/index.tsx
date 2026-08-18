import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// assets
import {
    Bill,
    People,
    UserSquare,
    Add
} from "iconsax-reactjs";

// project-imports
import ReportCard from "components/cards/statistics/ReportCard";
import { GRID_COMMON_SPACING } from "config";
import SalesReport from "./component/salesReport";
import MonthlySale from './component/monthlySale';
import moment from 'moment';
import UseDashboard from "./hooks/useDashboard";
import LowSale from './component/lowSale';
import ManagerSale from './component/managerSale';
import AttendanceList from './component/attendanceList';
import DailySale from './component/dailySale';
import ChartContainer from 'components/chart/chartContainer';
import DataChart from 'components/chart/dataChart';
import DonutChart from 'components/chart/donutChart';
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';
import PieChart from 'components/chart/pieChart';
import { Autocomplete, TextField } from '@mui/material';
import DailyReport from './component/dailyReport';

const Dashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {
        user,
        isBranch,
        details,
        allCompany,
        newCustomerData,
        newCustomerLabel,
        repeatCustomerData,
        repeatCustomerLabel,
        branchWiseIncomeData,
        referenceChartData,
        selectedCompanyId,
        dashboardSectionRights,
        handleDateChange,
        setSelectedCompanyId,
        handleNewCustomerDateChange,
        handleReferenceChartDateChange,
        handleBranchWiseIncomeDateChange
    } = UseDashboard();

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    const quickActions = useMemo(() => [
        { label: 'New Bill', icon: <Add />, path: '/bill/add', color: 'primary' },
        { label: 'Add Customer', icon: <UserSquare />, path: '/customer/add', color: 'info' },
    ], []);

    const repeatCustomerMenuItems = useMemo(() => [
        { label: 'Current Month', action: () => handleDateChange(0) },
        { label: 'Last Month', action: () => handleDateChange(1) },
        { label: 'Last 3 Months', action: () => handleDateChange(3) },
        { label: 'Last 6 Months', action: () => handleDateChange(6) },
    ], [handleDateChange]);

    const newCustomerMenuItems = useMemo(() => [
        { label: 'Current Month', action: () => handleNewCustomerDateChange(0) },
        { label: 'Last Month', action: () => handleNewCustomerDateChange(1) },
        { label: 'Last 3 Months', action: () => handleNewCustomerDateChange(3) },
        { label: 'Last 6 Months', action: () => handleNewCustomerDateChange(6) },
    ], [handleNewCustomerDateChange]);

    const referenceChartMenuItems = useMemo(() => [
        { label: 'Current Month', action: () => handleReferenceChartDateChange(0) },
        { label: 'Last Month', action: () => handleReferenceChartDateChange(1) },
        { label: 'Last 3 Months', action: () => handleReferenceChartDateChange(3) },
        { label: 'Last 6 Months', action: () => handleReferenceChartDateChange(6) },
        { label: 'Last 1 Year', action: () => handleReferenceChartDateChange(12) },
    ], [handleReferenceChartDateChange]);

    const branchWiseIncomeMenuItems = useMemo(() => [
        { label: 'Current Month', action: () => handleBranchWiseIncomeDateChange(0) },
        { label: 'Last Month', action: () => handleBranchWiseIncomeDateChange(1) },
        { label: 'Last 3 Months', action: () => handleBranchWiseIncomeDateChange(3) },
        { label: 'Last 6 Months', action: () => handleBranchWiseIncomeDateChange(6) },
        { label: 'Last 1 Year', action: () => handleBranchWiseIncomeDateChange(12) },
    ], [handleBranchWiseIncomeDateChange]);

    const pieChartConfig = useMemo(() => {
        if (!referenceChartData) return { series: [], labels: [], colors: [] };
        const series = referenceChartData.map((item: any) => item.value);
        const labels = referenceChartData.map((item: any) =>
            item.label.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, (str: any) => str.toUpperCase())
        );
        const colors = referenceChartData.map((item: any) => {
            const lbl = item.label;
            if (lbl === 'google') return theme.palette.primary.main;
            if (lbl === 'social') return '#00d1ff';
            if (lbl === 'whatsapp') return '#fca311';
            if (lbl === 'justdial') return '#c2410c';
            if (lbl === 'other') return '#38bdf8';
            if (lbl === 'relative') return '#10b981';
            if (lbl === 'website') return '#8b5cf6';
            return theme.palette.secondary.dark;
        });
        return { series, labels, colors, raw: referenceChartData };
    }, [referenceChartData, theme]);

    const donutChartConfig = useMemo(() => {
        if (!branchWiseIncomeData) return { keys: [], values: [], series: [], labels: [], colors: [] };
        const keys = Object.keys(branchWiseIncomeData);
        const values = Object.values(branchWiseIncomeData) as number[];
        const labels = keys.map(k => k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
        const colors = keys.map(key => {
            switch (key) {
                case 'totalExpanse': return '#dc2626';
                case 'otherExpanse': return '#4680ff';
                case 'totalIncome': return '#2ca87f';
                case 'totalRent': return '#e58a00';
                default: return theme.palette.primary.main;
            }
        });
        return { keys, values, series: values, labels, colors };
    }, [branchWiseIncomeData, theme]);

    const adminReports = useMemo(() => {
        if (isBranch) return null;
        return (
            <>
                {dashboardSectionRights['sales_vs_expense_analysis'] && dashboardSectionRights['sales_vs_expense_analysis']['view'] &&
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>Sales vs Expense Analysis</Typography>
                        <SalesReport companyID={selectedCompanyId} />
                    </Box>
                }
                {dashboardSectionRights['monthly_sales_analysis'] && dashboardSectionRights['monthly_sales_analysis']['view'] &&
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>Monthly Sales Analysis</Typography>
                        <MonthlySale companyID={selectedCompanyId} />
                    </Box>
                }
                {dashboardSectionRights['low_sales_analysis'] && dashboardSectionRights['low_sales_analysis']['view'] &&
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>Low Sales Analysis</Typography>
                        <LowSale companyID={selectedCompanyId} />
                    </Box>
                }
                {dashboardSectionRights['manager_sale_analysis'] && dashboardSectionRights['manager_sale_analysis']['view'] &&
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>Manager Sale Analysis</Typography>
                        <ManagerSale companyID={selectedCompanyId} />
                    </Box>
                }
                {dashboardSectionRights['attendance_list'] && dashboardSectionRights['attendance_list']['view'] &&
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>Attendance List</Typography>
                        <AttendanceList companyID={selectedCompanyId} />
                    </Box>
                }
                {dashboardSectionRights['daily_sales_analysis'] && dashboardSectionRights['daily_sales_analysis']['view'] &&
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>Daily Sales Analysis</Typography>
                        <DailySale companyID={selectedCompanyId} />
                    </Box>
                }
                {dashboardSectionRights['daily_report_analysis'] && dashboardSectionRights['daily_report_analysis']['view'] &&
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>Daily Report Analysis</Typography>
                        <DailyReport companyID={selectedCompanyId} />
                    </Box>
                }
            </>
        );
    }, [isBranch, selectedCompanyId, dashboardSectionRights]);

    return (
        <Stack spacing={GRID_COMMON_SPACING}>
            {/* Header Section */}
            <Box sx={{ mb: 1 }}>
                <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={0.5}>
                            <Typography variant="h2" sx={{ fontWeight: 700 }}>
                                {greeting}, {user?.lastName || 'Admin'}! 👋
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Here&apos;s what&apos;s happening with your business today, {moment().format('MMMM Do, YYYY')}.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        {isBranch ?
                            <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                {quickActions.map((action, index) => (
                                    <Button
                                        key={index}
                                        variant="contained"
                                        color={action.color as any}
                                        startIcon={action.icon}
                                        onClick={() => navigate(action.path)}
                                        sx={{
                                            borderRadius: '10px',
                                            px: 2,
                                            py: 1,
                                            boxShadow: theme.customShadows.z1,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                            </Stack>
                            :
                            <Autocomplete
                                fullWidth
                                options={allCompany}
                                getOptionLabel={(option) => option.companyName}
                                value={allCompany.find((option) => option.id === selectedCompanyId) || null}
                                onChange={(event, value) => {
                                    setSelectedCompanyId(value?.id || null);
                                }}
                                renderInput={(params) => <TextField {...params} label="Company" />}
                            />
                        }
                    </Grid>
                </Grid>
            </Box>

            {/* Statistics Section */}
            <Grid container spacing={GRID_COMMON_SPACING}>
                {dashboardSectionRights['total_customer'] && dashboardSectionRights['total_customer']['view'] &&
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <ReportCard
                            variant="modern"
                            primary={details?.customerCount || 0}
                            secondary="Total Customers"
                            color={theme.palette.primary.main}
                            iconPrimary={People}
                        />
                    </Grid>
                }
                {dashboardSectionRights['bills_generated'] && dashboardSectionRights['bills_generated']['view'] &&
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <ReportCard
                            variant="modern"
                            primary={details?.billCount || 0}
                            secondary="Bills Generated"
                            color={theme.palette.success.main}
                            iconPrimary={Bill}
                        />
                    </Grid>
                }
                {!isBranch &&
                    <>
                        {dashboardSectionRights['repeat_customer'] && dashboardSectionRights['repeat_customer']['view'] &&
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <ChartContainer
                                    title='Repeat Customer'
                                    iconPrimary={<Bill />}
                                    color='primary'
                                    menuItems={repeatCustomerMenuItems}
                                >
                                    <DataChart xaxisLabels={repeatCustomerLabel} data={repeatCustomerData} color={(theme as any).vars?.palette?.success?.main || theme.palette.success.main} label="Repeat Customer" />
                                </ChartContainer>
                            </Grid>
                        }
                        {dashboardSectionRights['new_customer'] && dashboardSectionRights['new_customer']['view'] &&
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <ChartContainer
                                    title='New Customer'
                                    iconPrimary={<Bill />}
                                    color='primary'
                                    menuItems={newCustomerMenuItems}
                                >
                                    <DataChart xaxisLabels={newCustomerLabel} data={newCustomerData} color={(theme as any).vars?.palette?.success?.main || theme.palette.success.main} label="New Customer" />
                                </ChartContainer>
                            </Grid>
                        }
                        {dashboardSectionRights['reference_by'] && dashboardSectionRights['reference_by']['view'] &&
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ChartContainer
                                    title="Reference By"
                                    iconPrimary={<Bill />}
                                    color='primary'
                                    menuItems={referenceChartMenuItems}
                                >
                                    <Grid container spacing={GRID_COMMON_SPACING}>
                                        <Grid size={{ xs: 12, sm: 12 }}>
                                            <PieChart
                                                series={pieChartConfig.series}
                                                labels={pieChartConfig.labels}
                                                colors={pieChartConfig.colors}
                                            />
                                        </Grid>
                                        {pieChartConfig.raw?.map((item: any, index: number) => (
                                            <Grid size={{ xs: 12, sm: 4 }} key={`pie_${index}`}>
                                                <MainCard content={false}>
                                                    <Stack sx={{ alignItems: 'center', py: 1.5 }}>
                                                        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                                                            <Dot size={6} componentDiv sx={{ bgcolor: pieChartConfig.colors[index] }} />
                                                            <Typography>{pieChartConfig.labels[index]}</Typography>
                                                        </Stack>
                                                        <Typography variant="subtitle1">{item.value}</Typography>
                                                    </Stack>
                                                </MainCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </ChartContainer>
                            </Grid>
                        }
                        {dashboardSectionRights['income_&_expense'] && dashboardSectionRights['income_&_expense']['view'] &&
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ChartContainer
                                    title="Income & Expense"
                                    iconPrimary={<Bill />}
                                    color='primary'
                                    menuItems={branchWiseIncomeMenuItems}
                                >
                                    <Grid container spacing={GRID_COMMON_SPACING}>
                                        <Grid size={12}>
                                            <DonutChart
                                                chartType='donut'
                                                series={donutChartConfig.series}
                                                labels={donutChartConfig.labels}
                                                colors={donutChartConfig.colors}
                                            />
                                        </Grid>
                                        {donutChartConfig.keys?.map((keyName: string, index: number) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                                <MainCard content={false} border={false} sx={{ boxShadow: 'none' }}>
                                                    <Stack sx={{ gap: 0.5, alignItems: 'flex-start', px: 1.5, py: 1.2 }}>
                                                        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                                                            <Dot componentDiv sx={{ bgcolor: donutChartConfig.colors[index] }} />
                                                            <Typography>{donutChartConfig.labels[index]}</Typography>
                                                        </Stack>
                                                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            ₹{donutChartConfig.values[index] || 0}
                                                        </Typography>
                                                    </Stack>
                                                </MainCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </ChartContainer>
                            </Grid>
                        }
                    </>
                }
            </Grid>

            {/* Sales Report Section */}
            {adminReports}
        </Stack>
    );
};

export default Dashboard;