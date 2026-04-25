
import { useEffect, useState } from 'react';

import { useColorScheme, useTheme, alpha } from '@mui/material/styles';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import FormControl from '@mui/material/FormControl';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import MainCard from "components/MainCard";
import { GRID_COMMON_SPACING, ThemeMode } from "config";
import useConfig from 'hooks/useConfig';

import UseSalesReport from "../hooks/useSalesReport";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import useMediaQuery from '@mui/material/useMediaQuery';

const SalesReport = () => {
    const theme = useTheme();
    const { colorScheme } = useColorScheme();

    const {
        slot,
        labels,
        toDate,
        fromDate,
        salesData,
        expenseData,
        isShowCustom,
        setSlot,
        setToDate,
        setFromDate,
        fetchSalesExpenseReport
    } = UseSalesReport();

    const {
        state: { fontFamily }
    } = useConfig();

    const textPrimary = theme.vars.palette.text.primary;
    const textSecondary = theme.vars.palette.text.secondary;
    const line = theme.vars.palette.divider;

    const warningMain = theme.vars.palette.warning.main;
    const primaryMain = theme.vars.palette.primary.main;

    const downSM = useMediaQuery(theme.breakpoints.down('sm'));

    const areaChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            background: 'transparent',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: true },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: labels || [],
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                formatter: (val) => `₹${val.toLocaleString()}`
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            itemMargin: { horizontal: 10 }
        },
        grid: {
            strokeDashArray: 4,
            borderColor: line
        },
        tooltip: {
            fixed: { enabled: false },
            x: { show: true },
            y: { title: { formatter: (seriesName) => `${seriesName}: ` } },
            marker: { show: false }
        }
    };

    const [options, setOptions] = useState(areaChartOptions);

    useEffect(() => {
        setOptions({
            ...areaChartOptions,
            chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
            colors: [primaryMain, warningMain],
            xaxis: {
                ...areaChartOptions.xaxis,
                categories: labels,
                labels: { style: { colors: textSecondary } }
            },
            yaxis: {
                ...areaChartOptions.yaxis,
                labels: { style: { colors: textSecondary } }
            },
            grid: { borderColor: line },
            theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
        });
    }, [labels, colorScheme, fontFamily, textSecondary, textPrimary, line, warningMain, primaryMain, downSM]);

    return (
        <MainCard sx={{
            borderRadius: '16px',
            boxShadow: theme.customShadows.z1,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '& .MuiCardContent-root': { p: 3 }
        }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Performance Metrics</Typography>
                    <Typography variant="caption" color="text.secondary">Detailed view of sales and expenses over time</Typography>
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
                    <ToggleButton value={1}>Week</ToggleButton>
                    <ToggleButton value={2}>Month</ToggleButton>
                    <ToggleButton value={3}>Custom</ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            {isShowCustom && (
                <Box sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.primary.lighter, 0.3), borderRadius: '12px' }}>
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
                                onClick={fetchSalesExpenseReport}
                                sx={{ borderRadius: '8px' }}
                            >
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}

            <Box id="chart" sx={{ mx: -1 }}>
                <ReactApexChart
                    options={options}
                    series={[
                        {
                            name: 'Sales',
                            data: salesData
                        },
                        {
                            name: 'Expense',
                            data: expenseData
                        }
                    ]}
                    type="area"
                    height={350}
                />
            </Box>
        </MainCard>
    )
}

export default SalesReport;