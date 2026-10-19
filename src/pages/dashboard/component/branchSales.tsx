import { alpha, useColorScheme, useTheme } from "@mui/material/styles";
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

import UseBranchSale from "../hooks/useBranchSale";
import IconButton from "@mui/material/IconButton";
import { Eye } from "iconsax-reactjs";
import ViewDetailModal from "components/ViewDetailModal";
import { ThemeMode } from "config";
import { useEffect, useState } from "react";
import useConfig from "hooks/useConfig";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

const MONTHS = [
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 1 },
    { label: 'Mar', value: 2 },
    { label: 'Apr', value: 3 },
    { label: 'May', value: 4 },
    { label: 'Jun', value: 5 },
    { label: 'Jul', value: 6 },
    { label: 'Aug', value: 7 },
    { label: 'Sep', value: 8 },
    { label: 'Oct', value: 9 },
    { label: 'Nov', value: 10 },
    { label: 'Dec', value: 11 },
];

// Years from 2022 → current year (auto-extends every new year)
const START_YEAR = 2022;
const YEARS = Array.from(
    { length: new Date().getFullYear() - START_YEAR + 1 },
    (_, i) => {
        const y = START_YEAR + i;
        return { label: String(y), value: y };
    }
).reverse(); // latest year first

const BranchSales = () => {
    const theme = useTheme();
    const { colorScheme } = useColorScheme();
    const {
        year,
        setYear,
        month,
        setMonth,
        labels,
        salesData,
        selectedCity,
        fetchBranch,
        branchOptions,
        selectedBranch,
        setSelectedCity,
        setSelectedBranch,
        cityOptions,
    } = UseBranchSale();

    const {
        state: { fontFamily }
    } = useConfig();

    const textPrimary = theme.vars.palette.text.primary;
    const textSecondary = theme.vars.palette.text.secondary;
    const line = theme.vars.palette.divider;

    const primaryMain = theme.vars.palette.primary.main;
    const infoMain = theme.vars.palette.info.main;
    const warningMain = theme.vars.palette.warning.main;
    const successMain = theme.vars.palette.success.main;

    const downSM = useMediaQuery(theme.breakpoints.down('sm'));

    const areaChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            background: 'transparent',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
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
            type: 'solid',
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
            colors: [primaryMain, warningMain, infoMain, successMain],
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
                            <Autocomplete
                                options={MONTHS}
                                getOptionLabel={(option: any) => option?.label || ''}
                                isOptionEqualToValue={(option: any, value: any) => option.value === value}
                                value={MONTHS.find((option: any) => option.value === month) || null}
                                onChange={(_, newValue) => {
                                    setMonth(newValue?.value || null)
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Month" variant="outlined" size="small" />}
                                sx={{
                                    minWidth: { xs: '100%', sm: '180px', md: '200px' },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        bgcolor: alpha(theme.palette.background.paper, 0.5)
                                    }
                                }}
                            />
                            <Autocomplete
                                options={YEARS}
                                getOptionLabel={(option: any) => option?.label || ''}
                                isOptionEqualToValue={(option: any, value: any) => option.value === value?.value}
                                value={YEARS.find((option: any) => option.value === year) || null}
                                onChange={(_, newValue) => {
                                    setYear(newValue?.value ?? null)
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Year" variant="outlined" size="small" />}
                                sx={{
                                    minWidth: { xs: '100%', sm: '140px', md: '160px' },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        bgcolor: alpha(theme.palette.background.paper, 0.5)
                                    }
                                }}
                            />

                            <Autocomplete
                                options={cityOptions}
                                getOptionLabel={(option: any) => option?.label || ''}
                                isOptionEqualToValue={(option: any, value: any) => option.value === value?.value}
                                value={cityOptions?.find((option: any) => option.value === selectedCity) || null}
                                onChange={(_, newValue) => {
                                    setSelectedCity(newValue?.value || null)
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
                            <Autocomplete
                                options={branchOptions}
                                getOptionLabel={(option: any) => option?.label || ''}
                                isOptionEqualToValue={(option: any, value: any) => option.value === value?.value}
                                value={branchOptions?.find((option: any) => option.value === selectedBranch) || null}
                                onChange={(_, newValue) => {
                                    setSelectedBranch(newValue?.value || null)
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Branch" variant="outlined" size="small" />}
                                sx={{
                                    minWidth: { xs: '100%', sm: '180px', md: '200px' },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        bgcolor: alpha(theme.palette.background.paper, 0.5)
                                    }
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
                <Box id="chart" sx={{ mx: -1 }}>
                    <ReactApexChart
                        options={options}
                        series={salesData}
                        type="bar"
                        height={350}
                    />
                </Box>
            </MainCard>
        </>
    )
}

export default BranchSales;