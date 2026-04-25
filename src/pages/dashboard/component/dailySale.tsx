
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
import UseDailySale from "../hooks/useDailySale";

const DailySale = () => {
    const theme = useTheme();
    const {
        slot,
        toDate,
        fromDate,
        isShowCustom,
        dailySaleList,
        branchOptions,
        selectedBranch,
        setSlot,
        setToDate,
        setFromDate,
        fetchDailyReport,
        setSelectedBranch
    } = UseDailySale();

    const primaryMain = theme.palette.primary.main;

    return (
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
                    <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Daily Sales Analysis</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Comprehensive breakdown of branch performance metrics</Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', lg: 'auto' }, alignItems: 'center' }}>
                    <Box sx={{ minWidth: { xs: '100%', sm: '200px' } }}>
                        <Autocomplete
                            multiple
                            options={branchOptions}
                            getOptionLabel={(option) => option.lastName}
                            isOptionEqualToValue={(option: any, value: any) => option.id === value}
                            value={branchOptions.filter((option: any) => selectedBranch.includes(option.id)) || []}
                            onChange={(event, newValue) => {
                                setSelectedBranch(newValue?.map((option: any) => option.id) || [])
                            }}
                            renderInput={(params) => <TextField {...params} label="Select Branch" variant="outlined" size="small" />}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    bgcolor: alpha(theme.palette.background.paper, 0.5)
                                }
                            }}
                        />
                    </Box>

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
                        <ToggleButton value={0}>This Month</ToggleButton>
                        <ToggleButton value={1}>3 Months</ToggleButton>
                        <ToggleButton value={2}>6 Months</ToggleButton>
                        <ToggleButton value={4}>Custom</ToggleButton>
                    </ToggleButtonGroup>
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

            {dailySaleList.length > 0 ? (
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
                                <TableCell sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>No</TableCell>
                                <TableCell sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Branch Name</TableCell>
                                <TableCell align="center" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Customers</TableCell>
                                <TableCell align="center" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Members</TableCell>
                                <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Cash</TableCell>
                                <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>UPI</TableCell>
                                <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.secondary.lighter, 0.8), fontWeight: 700 }}>Card</TableCell>
                                <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.primary.lighter, 0.8), fontWeight: 800, color: 'primary.main' }}>Net Sales</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dailySaleList.map((row: any, index: number) => {
                                const netSales = (row?.totalCash || 0) + (row?.totalUPI || 0) + (row?.totalCard || 0);
                                return (
                                    <TableRow
                                        key={"bill_report" + index}
                                        sx={{
                                            '&:nth-of-type(even)': { bgcolor: alpha(theme.palette.secondary.lighter, 0.2) },
                                            '&:hover': { bgcolor: alpha(theme.palette.primary.lighter, 0.1) },
                                            transition: 'background-color 0.2s ease'
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{row?.user?.lastName || 'N/A'}</TableCell>
                                        <TableCell align="center">{row?.totalCustomer || 0}</TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.main' }}>
                                                {row?.membershipCustomerCount || 0}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="baseline">
                                                <Typography variant="caption" color="text.secondary">({row?.cashCustomerCount})</Typography>
                                                <Typography sx={{ fontFamily: 'monospace', fontWeight: 500 }}>₹{row?.totalCash?.toLocaleString('en-IN')}/-</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="baseline">
                                                <Typography variant="caption" color="text.secondary">({row?.upiCustomerCount})</Typography>
                                                <Typography sx={{ fontFamily: 'monospace', fontWeight: 500 }}>₹{row?.totalUPI?.toLocaleString('en-IN')}/-</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="baseline">
                                                <Typography variant="caption" color="text.secondary">({row?.cardCustomerCount})</Typography>
                                                <Typography sx={{ fontFamily: 'monospace', fontWeight: 500 }}>₹{row?.totalCard?.toLocaleString('en-IN')}/-</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography sx={{
                                                fontFamily: 'monospace',
                                                fontWeight: 700,
                                                color: 'primary.main',
                                                fontSize: '1rem'
                                            }}>
                                                ₹{netSales.toLocaleString('en-IN')}/-
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: 'primary.lighter', fontWeight: 700, color: 'primary.main' }}>
                                <TableCell>Total</TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="baseline">
                                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{dailySaleList.reduce((acc, row) => acc + (row?.totalCustomer || 0), 0)}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="baseline">
                                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'info.main' }}>{dailySaleList.reduce((acc, row) => acc + (row?.membershipCustomerCount || 0), 0)}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailySaleList.reduce((acc, row) => acc + (row?.totalCash || 0), 0).toLocaleString('en-IN')}/-</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailySaleList.reduce((acc, row) => acc + (row?.totalUPI || 0), 0).toLocaleString('en-IN')}/-</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailySaleList.reduce((acc, row) => acc + (row?.totalCard || 0), 0).toLocaleString('en-IN')}/-</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>₹{dailySaleList.reduce((acc, row) => acc + (row?.totalCash || 0) + (row?.totalUPI || 0) + (row?.totalCard || 0), 0).toLocaleString('en-IN')}/-</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ p: 5, textAlign: 'center', opacity: 0.6 }}>
                    <Typography variant="body1">No sales data found for the selected period.</Typography>
                </Box>
            )}
        </MainCard>
    );
}

export default DailySale;