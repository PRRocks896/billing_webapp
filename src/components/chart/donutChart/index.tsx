import { useColorScheme, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ApexOptions } from "apexcharts";
import { ThemeMode } from "config";
import useConfig from "hooks/useConfig";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

// default chart options
const defaultPieChartOptions: ApexOptions = {
    chart: { type: 'donut', background: 'transparent' },
    legend: { show: false },
    dataLabels: { enabled: false }
};

export interface DonutChartProps {
    series?: number[];
    labels?: string[];
    colors?: string[];
    height?: number | string;
    chartType?: 'donut' | 'pie' | 'radialBar';
    customOptions?: ApexOptions;
}

const DonutChart = ({
    series = [31, 26, 23, 20],
    labels = ['Total income', 'Total rent', 'Download', 'Views'],
    colors,
    height,
    chartType = 'donut',
    customOptions
}: DonutChartProps) => {
    const theme = useTheme();
    const { colorScheme } = useColorScheme();
    const {
        state: { fontFamily }
    } = useConfig();

    const downSM = useMediaQuery(theme.breakpoints.down('sm'));
    const defaultHeight = downSM ? 280 : 320;
    const finalHeight = height || defaultHeight;

    const primaryMain = theme.vars.palette.primary.main;
    const errorMain = theme.vars.palette.error.main;
    const warningMain = theme.vars.palette.warning.main;
    const successMain = theme.vars.palette.success.main;
    const backgroundPaper = theme.vars.palette.background.paper;

    const defaultColors = useMemo(() => [primaryMain, warningMain, successMain, errorMain], [primaryMain, warningMain, successMain, errorMain]);

    const options = useMemo<ApexOptions>(() => {
        return {
            ...defaultPieChartOptions,
            ...customOptions,
            chart: {
                ...defaultPieChartOptions.chart,
                type: chartType,
                fontFamily: fontFamily,
                ...(customOptions?.chart || {})
            },
            labels: labels,
            colors: colors || defaultColors,
            stroke: { colors: [backgroundPaper], ...(customOptions?.stroke || {}) },
            theme: {
                mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light',
                ...(customOptions?.theme || {})
            }
        };
    }, [colorScheme, fontFamily, backgroundPaper, chartType, labels, colors, customOptions, defaultColors]);

    // Force remount when series length, labels, or colors change to ensure ApexCharts properly applies updates
    const chartKey = useMemo(() => {
        return `${series.length}-${labels?.join(',')}-${colors?.join(',')}`;
    }, [series.length, labels, colors]);

    return <ReactApexChart key={chartKey} options={options} series={series} type={chartType} height={finalHeight} />;
}

export default DonutChart;