
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { useTheme, alpha, useColorScheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import MainCard from "components/MainCard";
import { ThemeMode } from "config";
import useConfig from "hooks/useConfig";
import UseManagerSale from "../hooks/useManagerSale";

const ManagerSale = () => {
    const theme = useTheme();
    const { colorScheme } = useColorScheme();
    const {
        slot,
        toDate,
        labels,
        fromDate,
        salesData,
        isShowCustom,
        setSlot,
        setToDate,
        setFromDate,
        fetchManagerSalesReport
    } = UseManagerSale();

    const {
        state: { fontFamily }
    } = useConfig();

    const textSecondary = theme.vars.palette.text.secondary;
    const line = theme.vars.palette.divider;
    const primaryMain = theme.vars.palette.primary.main;
    const warningMain = theme.vars.palette.warning.main;

    const barChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            background: 'transparent',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '35%',
                distributed: true,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `₹${val.toLocaleString()}`,
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: [theme.palette.text.primary]
            }
        },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: labels || [],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: textSecondary, fontFamily }
            }
        },
        yaxis: {
            labels: {
                show: true,
                style: { colors: textSecondary, fontFamily },
                formatter: (val) => `₹${val.toLocaleString()}`
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.25,
                // gradientToColors: [alpha(primaryMain, 0.7), alpha(warningMain, 0.7)],
                inverseColors: true,
                opacityFrom: 0.85,
                opacityTo: 0.85,
                stops: [50, 0, 100]
            }
        },
        legend: { show: false },
        grid: {
            strokeDashArray: 4,
            borderColor: line
        },
        tooltip: {
            theme: colorScheme === ThemeMode.DARK ? 'dark' : 'light',
            y: {
                formatter: (val) => `₹${val.toLocaleString()}`,
                title: { formatter: () => 'Total Sales: ' }
            }
        }
    };

    const [options, setOptions] = useState(barChartOptions);

    useEffect(() => {
        setOptions({
            ...barChartOptions,
            chart: { ...barChartOptions.chart, fontFamily: fontFamily },
            colors: [primaryMain, warningMain, theme.palette.info.main, theme.palette.success.main, theme.palette.error.main],
            xaxis: {
                ...barChartOptions.xaxis,
                categories: labels,
                labels: { style: { colors: textSecondary } }
            },
            yaxis: {
                ...barChartOptions.yaxis,
                labels: { style: { colors: textSecondary } }
            },
            grid: { borderColor: line },
            theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
        });
    }, [labels, colorScheme, fontFamily, textSecondary, line, primaryMain, warningMain]);

    return (
        <MainCard sx={{
            borderRadius: '16px',
            boxShadow: theme.customShadows.z1,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '& .MuiCardContent-root': { p: 3 },
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Manager Revenue Performance</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Real-time sales tracking per branch manager</Typography>
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
                <Box sx={{ p: 2.5, mb: 3, bgcolor: alpha(theme.palette.primary.lighter, 0.4), borderRadius: '14px', border: `1px dashed ${primaryMain}` }}>
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
                                onClick={fetchManagerSalesReport}
                                sx={{ borderRadius: '10px', fontWeight: 600, boxShadow: theme.customShadows.z1 }}
                            >
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
            <Box id="chart" sx={{ mx: -1, mt: 2 }}>
                <ReactApexChart
                    options={options}
                    series={[
                        {
                            name: 'Revenue',
                            data: salesData
                        }
                    ]}
                    type="bar"
                    height={350}
                />
            </Box>
        </MainCard>
    )
}

export default ManagerSale;