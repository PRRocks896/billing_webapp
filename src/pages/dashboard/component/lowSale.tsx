import { alpha, useColorScheme, useTheme } from "@mui/material/styles";

import UseLowSale from "../hooks/useLowSale";
import MainCard from "components/MainCard";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import useConfig from "hooks/useConfig";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { ThemeMode } from "config";
import ReactApexChart from "react-apexcharts";

const LowSale = ({ companyID = null }: { companyID?: number | null }) => {
    const theme = useTheme();
    const { colorScheme } = useColorScheme();
    const {
        date,
        labels,
        salesData,
        setDate,
        fetchLowSaleReport
    } = UseLowSale(companyID);

    const {
        state: { fontFamily }
    } = useConfig();

    const textPrimary = theme.vars.palette.text.primary;
    const textSecondary = theme.vars.palette.text.secondary;
    const line = theme.vars.palette.divider;

    const primaryMain = theme.vars.palette.primary.main;

    const downSM = useMediaQuery(theme.breakpoints.down('sm'));

    const areaChartOptions: ApexOptions = {
        chart: {
            type: 'area',
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
                colorStops: [
                    {
                        offset: 0,
                        color: theme.vars.palette.primary.main,
                        opacity: 0.9
                    },
                    {
                        offset: 100,
                        color: theme.vars.palette.error.main,
                        opacity: 0.9
                    }
                ]
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
            colors: [primaryMain],
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
    }, [labels, colorScheme, fontFamily, textSecondary, textPrimary, line, primaryMain, downSM]);

    return (
        <MainCard sx={{
            borderRadius: '16px',
            boxShadow: theme.customShadows.z1,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '& .MuiCardContent-root': { p: 3 }
        }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Low Sales Report</Typography>
                    <Typography variant="caption" color="text.secondary">Detailed view of Low sales over time</Typography>
                </Box>
            </Stack>
            <Box sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.primary.lighter, 0.3), borderRadius: '12px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Select Date"
                                format="dd/MM/yyyy"
                                value={date}
                                onChange={(newValue) => setDate(newValue as Date)}
                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={fetchLowSaleReport}
                            sx={{ borderRadius: '8px' }}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box id="chart" sx={{ mx: -1 }}>
                <ReactApexChart
                    options={options}
                    series={[{
                        name: 'Low Sales',
                        data: salesData
                    }]}
                    type="area"
                    height={350}
                />
            </Box>
        </MainCard>
    )
}

export default LowSale;