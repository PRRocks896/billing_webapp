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
    Setting2,
    UserSquare,
    Add,
    Chart21,
    ArrowUp,
    ArrowDown
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

const Dashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {
        user,
        isAdmin,
        details,
        newCustomerData,
        newCustomerLabel,
        repeatCustomerData,
        repeatCustomerLabel,
        branchWiseIncomeData,
        handleDateChange,
        handleNewCustomerDateChange,
        handleBranchWiseIncomeDateChange
    } = UseDashboard();

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    const quickActions = [
        { label: 'New Bill', icon: <Add />, path: '/bill/add', color: 'primary' },
        { label: 'Add Customer', icon: <UserSquare />, path: '/customer/add', color: 'info' },
        // { label: 'View Reports', icon: <Chart21 />, path: '/report/daily-report', color: 'success' },
    ];

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
                    </Grid>
                </Grid>
            </Box>

            {/* Statistics Section */}
            <Grid container spacing={GRID_COMMON_SPACING}>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <ReportCard
                        variant="modern"
                        primary={details?.customerCount || 0}
                        secondary="Total Customers"
                        color={theme.palette.primary.main}
                        iconPrimary={People}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <ReportCard
                        variant="modern"
                        primary={details?.billCount || 0}
                        secondary="Bills Generated"
                        color={theme.palette.success.main}
                        iconPrimary={Bill}
                    />
                </Grid>
                {isAdmin &&
                    <>
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <ChartContainer
                                title='Repeat Customer'
                                iconPrimary={<Bill />}
                                color='primary'
                                menuItems={[
                                    { label: 'Last Month', action: () => handleDateChange(1) },
                                    { label: 'Last 3 Months', action: () => handleDateChange(3) },
                                    { label: 'Last 6 Months', action: () => handleDateChange(6) },
                                ]}
                            >
                                <DataChart xaxisLabels={repeatCustomerLabel} data={repeatCustomerData} color={theme.vars.palette.success.main} label="Repeat Customer" />
                            </ChartContainer>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <ChartContainer
                                title='New Customer'
                                iconPrimary={<Bill />}
                                color='primary'
                                menuItems={[
                                    { label: 'Last Month', action: () => handleNewCustomerDateChange(1) },
                                    { label: 'Last 3 Months', action: () => handleNewCustomerDateChange(3) },
                                    { label: 'Last 6 Months', action: () => handleNewCustomerDateChange(6) },
                                ]}
                            >
                                <DataChart xaxisLabels={newCustomerLabel} data={newCustomerData} color={theme.vars.palette.success.main} label="New Customer" />
                            </ChartContainer>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <ChartContainer
                                title="Income & Expense"
                                iconPrimary={<Bill />}
                                color='primary'
                                menuItems={[
                                    { label: 'Last Month', action: () => handleBranchWiseIncomeDateChange(1) },
                                    { label: 'Last 3 Months', action: () => handleBranchWiseIncomeDateChange(3) },
                                    { label: 'Last 6 Months', action: () => handleBranchWiseIncomeDateChange(6) },
                                    { label: 'Last 1 Year', action: () => handleBranchWiseIncomeDateChange(12) },
                                ]}
                            >
                                <Grid container spacing={GRID_COMMON_SPACING}>
                                    <Grid size={12}>
                                        <DonutChart
                                            chartType='donut'
                                            series={Object.values(branchWiseIncomeData)}
                                            labels={Object.keys(branchWiseIncomeData).map(k => k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))}
                                            colors={Object.keys(branchWiseIncomeData).map(key => {
                                                switch (key) {
                                                    case 'totalExpanse': return theme.palette.error.main;
                                                    case 'otherExpanse': return theme.palette.error.light;
                                                    case 'totalIncome': return theme.palette.success.main;
                                                    case 'totalRent': return theme.palette.success.light;
                                                    default: return theme.palette.primary.main;
                                                }
                                            })}
                                        />
                                    </Grid>
                                    {Object.keys(branchWiseIncomeData)?.map((item: any, index: number) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                                            <MainCard content={false} border={false} sx={{ bgcolor: 'secondary.lighter', boxShadow: 'none' }}>
                                                <Stack sx={{ gap: 0.5, alignItems: 'flex-start', p: 2 }}>
                                                    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                                                        <Dot componentDiv sx={{
                                                            bgcolor: `${item === 'totalExpanse' ? theme.palette.error.main :
                                                                    item === 'otherExpanse' ? theme.palette.error.light :
                                                                        item === 'totalIncome' ? theme.palette.success.main :
                                                                            item === 'totalRent' ? theme.palette.success.light :
                                                                                theme.palette.primary.main
                                                                }`
                                                        }} />
                                                        <Typography>{Object.keys(branchWiseIncomeData)[index].replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
                                                    </Stack>

                                                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        ₹{Object.values(branchWiseIncomeData)[index] || 0}
                                                        {/* <Typography
                                                            variant="caption"
                                                            sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.25 }}
                                                        >
                                                            {item.isProfit !== false ? <ArrowUp size={14} /> : <ArrowDown size={14} />} +${item.change}
                                                        </Typography> */}
                                                    </Typography>
                                                </Stack>
                                            </MainCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            </ChartContainer>
                        </Grid>
                    </>
                }
            </Grid>

            {/* Sales Report Section */}
            {isAdmin && (
                <>
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                            Sales vs Expense Analysis
                        </Typography>
                        <SalesReport />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                            Monthly Sales Analysis
                        </Typography>
                        <MonthlySale />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                            Low Sales Analysis
                        </Typography>
                        <LowSale />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                            Manager Sale Analysis
                        </Typography>
                        <ManagerSale />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                            Attendance List
                        </Typography>
                        <AttendanceList />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                            Daily Sales Analysis
                        </Typography>
                        <DailySale />
                    </Box>
                </>
            )}
        </Stack>
    )
}

export default Dashboard;