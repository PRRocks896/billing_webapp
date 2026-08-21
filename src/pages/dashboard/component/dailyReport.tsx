
import { alpha, useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";

import MainCard from "components/MainCard";

import UseDailyReport from "../hooks/useDailyReport";
import IconButton from "@mui/material/IconButton";
import { Eye } from "iconsax-reactjs";
import ViewDetailModal from "components/ViewDetailModal";

const DailyReport = ({ companyID = null }: { companyID?: number | null }) => {
    const theme = useTheme();
    const {
        slot,
        toDate,
        isAdmin,
        fromDate,
        cityOptions,
        selectedCity,
        isShowCustom,
        dailyReportList,
        branchOptions,
        selectedBranch,
        selectedExpenses,
        showExpenseDetail,
        setSlot,
        setToDate,
        setFromDate,
        setSelectedCity,
        fetchDailyReport,
        setSelectedBranch,
        toggleIsShowCustom,
        toggleExpenseDetail,
        setSelectedExpenses,
    } = UseDailyReport(companyID);
    const primaryMain = theme.palette.primary.main;

    return (
        <>
            <MainCard sx={{
                borderRadius: '16px',
                boxShadow: theme.customShadows.z1,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '& .MuiCardContent-root': { p: 3 },
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mb: 4, alignItems: { xs: 'flex-start', lg: 'center' }, justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}></Typography>
                        {/* <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Comprehensive breakdown of branch performance metrics</Typography> */}
                    </Box>

                    <Stack direction={{ xs: 'column', xl: 'row' }} spacing={2} sx={{ width: { xs: '100%', lg: 'auto' }, alignItems: { xs: 'stretch', xl: 'center' } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', xl: 'auto' } }}>
                            {(companyID) &&
                                <Autocomplete
                                    options={cityOptions}
                                    getOptionLabel={(option: any) => option?.name || ''}
                                    isOptionEqualToValue={(option: any, value: any) => option.id === value?.id}
                                    value={cityOptions?.find((option: any) => option.id === selectedCity) || null}
                                    onChange={(_, newValue) => {
                                        setSelectedCity(newValue?.id || null)
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Select City" variant="outlined" size="small" />}
                                    sx={{
                                        minWidth: { xs: '100%', sm: '180px', md: '200px' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            bgcolor: alpha(theme.palette.background.paper, 0.5)
                                        }
                                    }}
                                />
                            }
                            {(isAdmin || companyID) &&
                                <Autocomplete
                                    options={branchOptions}
                                    getOptionLabel={(option) => option?.lastName || ''}
                                    isOptionEqualToValue={(option: any, value: any) => option.id === value}
                                    value={branchOptions.find((option: any) => option.id === selectedBranch) || []}
                                    onChange={(event, newValue) => {
                                        if (newValue === null) {
                                            setSelectedBranch(null);
                                            return;
                                        }
                                        setSelectedBranch(newValue?.id || null)
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Select Branch" variant="outlined" size="small" />}
                                    sx={{
                                        minWidth: { xs: '100%', sm: '200px', md: '250px' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            bgcolor: alpha(theme.palette.background.paper, 0.5)
                                        }
                                    }}
                                />
                            }
                        </Stack>

                        <Box sx={{ width: { xs: '100%', xl: 'auto' }, overflowX: 'auto' }}>
                            <ToggleButtonGroup
                                exclusive
                                onChange={(_, newValue) => newValue !== null && setSlot(newValue)}
                                value={slot}
                                size="small"
                                sx={{
                                    bgcolor: alpha(theme.palette.secondary.lighter, 0.5),
                                    p: 0.5,
                                    borderRadius: '12px',
                                    '& .MuiToggleButton-root': {
                                        border: 'none',
                                        borderRadius: '8px',
                                        px: 2,
                                        py: 0.75,
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        '&.Mui-selected': {
                                            bgcolor: 'background.paper',
                                            color: 'primary.main',
                                            boxShadow: theme.customShadows.z1,
                                            '&:hover': { bgcolor: 'background.paper' }
                                        }
                                    }
                                }}
                            >
                                <ToggleButton value={0}>Today</ToggleButton>
                                <ToggleButton value={1}>This Month</ToggleButton>
                                <ToggleButton value={2}>Last Months</ToggleButton>
                                <ToggleButton value={3}>Custom</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Stack>
                </Stack>

                {isShowCustom && (
                    <Box sx={{
                        p: 2.5,
                        mb: 4,
                        bgcolor: alpha(theme.palette.primary.lighter, 0.4),
                        borderRadius: '14px',
                        border: `1px dashed ${primaryMain}`
                    }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Start Date"
                                        format="dd/MM/yyyy"
                                        value={fromDate}
                                        onChange={(newValue) => setFromDate(newValue as Date)}
                                        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="End Date"
                                        format="dd/MM/yyyy"
                                        value={toDate}
                                        onChange={(newValue) => setToDate(newValue as Date)}
                                        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={fetchDailyReport}
                                    sx={{ borderRadius: '10px', fontWeight: 600, boxShadow: theme.customShadows.z1 }}
                                >
                                    Apply
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {dailyReportList.length > 0 ? (
                    <TableContainer component={Paper} sx={{
                        maxHeight: 500,
                        borderRadius: '12px',
                        boxShadow: 'none',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&::-webkit-scrollbar': { width: 6, height: 6 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.divider, 0.2), borderRadius: 3 }
                    }}>
                        <Table stickyHeader aria-label="daily sales table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Date</TableCell>
                                    <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Opening Balance</TableCell>
                                    <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Cash Sales</TableCell>
                                    <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Total Cash</TableCell>
                                    <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Total Expense</TableCell>
                                    <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Next Day Cash</TableCell>
                                    <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Grand Total</TableCell>
                                    <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Cash in Cover</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dailyReportList.map((row: any, index: number) => {
                                    return (
                                        <TableRow
                                            key={"bill_report" + index}
                                            sx={{
                                                '&:nth-of-type(even)': { bgcolor: alpha(theme.palette.secondary.lighter, 0.2) },
                                                '&:hover': { bgcolor: alpha(theme.palette.primary.lighter, 0.1) },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                        >
                                            <TableCell sx={{ fontWeight: 500 }}>{row?.date}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>₹{row?.openingBalance?.toLocaleString('en-IN')}/-</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>₹{row?.cashSales?.toLocaleString('en-IN')}/-</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>₹{row?.totalCash?.toLocaleString('en-IN')}/-</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                ₹{row?.totalExpense?.toLocaleString('en-IN')}/-
                                                <IconButton
                                                    aria-label="show expenses"
                                                    onClick={() => {
                                                        setSelectedExpenses(row.expenses);
                                                        toggleExpenseDetail();
                                                    }}
                                                >
                                                    <Eye size={16} color={theme.palette.primary.main} />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>₹{row?.nextDayCash?.toLocaleString('en-IN')}/-</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>₹{(row?.totalCash - row?.totalExpense - row?.nextDayCash)?.toLocaleString('en-IN')}/-</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>₹{row?.cashInCover?.toLocaleString('en-IN')}/-</TableCell>
                                        </TableRow>
                                    );
                                })}
                                <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: 'primary.lighter', fontWeight: 700, color: 'primary.main' }}>
                                    <TableCell>Total</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailyReportList.reduce((acc, row) => acc + (row?.openingBalance || 0), 0).toLocaleString('en-IN')}/-</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailyReportList.reduce((acc, row) => acc + (row?.cashSales || 0), 0).toLocaleString('en-IN')}/-</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailyReportList.reduce((acc, row) => acc + (row?.totalCash || 0), 0).toLocaleString('en-IN')}/-</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailyReportList.reduce((acc, row) => acc + (row?.totalExpense || 0), 0).toLocaleString('en-IN')}/-</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailyReportList.reduce((acc, row) => acc + (row?.nextDayCash || 0), 0).toLocaleString('en-IN')}/-</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailyReportList.reduce((acc, row) => acc + (row?.totalCash - row?.totalExpense - row?.nextDayCash), 0).toLocaleString('en-IN')}/-</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailyReportList.reduce((acc, row) => acc + (row?.cashInCover || 0), 0).toLocaleString('en-IN')}/-</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ p: 5, textAlign: 'center', opacity: 0.6 }}>
                        <Typography variant="body1">No daily sales data found for the selected period.</Typography>
                    </Box>
                )}
            </MainCard>
            {showExpenseDetail &&
                <ViewDetailModal
                    title={`Expense Detail | Total: ${selectedExpenses?.reduce((acc, row) => acc + (row?.amount || 0), 0).toLocaleString('en-IN')}/-`}
                    open={showExpenseDetail}
                    handleClose={toggleExpenseDetail}
                    handleSubmit={toggleExpenseDetail}
                    detail={selectedExpenses}
                />
            }
        </>
    );
}

export default DailyReport;