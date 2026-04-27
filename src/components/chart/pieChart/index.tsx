
import { useColorScheme, useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import useConfig from "hooks/useConfig";
import { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import { ThemeMode } from "config";
import ReactApexChart from "react-apexcharts";

// default chart options
const defaultPieChartOptions: ApexOptions = {
    chart: { type: 'pie', background: 'transparent' },
    tooltip: { enabled: true, fillSeriesColor: false },
    legend: { show: false }
};

export interface PieChartProps {
    series?: number[];
    colors?: string[];
    labels?: string[];
    customOptions?: ApexOptions;
    height?: number | string;
}

const PieChart = ({ 
    series = [40, 20, 10, 15, 5, 10], 
    colors, 
    labels = ['Components', 'Widgets', 'Pages', 'Forms', 'Other', 'Apps'], 
    customOptions,
    height 
}: PieChartProps) => {
    const theme = useTheme();
    const { colorScheme } = useColorScheme();
    const {
        state: { fontFamily }
    } = useConfig();
    
    const downSM = useMediaQuery(theme.breakpoints.down('sm'));
    const finalHeight = height || (downSM ? 280 : 316);
    
    const backColor = theme.vars.palette.background.paper;
    const primaryMain = theme.vars.palette.primary.main;
    const primary200 = theme.vars.palette.primary[200];
    const secondaryMain = theme.vars.palette.secondary.main;
    const secondary500 = theme.vars.palette.secondary[500];
    const secondaryDark = theme.vars.palette.secondary.dark;
    const secondaryDarker = theme.vars.palette.secondary.darker;

    const defaultColors = useMemo(() => [
        primaryMain, primary200, secondary500, secondaryMain, secondaryDark, secondaryDarker
    ], [primaryMain, primary200, secondary500, secondaryMain, secondaryDark, secondaryDarker]);

    const options = useMemo<ApexOptions>(() => {
        return {
            ...defaultPieChartOptions,
            ...customOptions,
            chart: { 
                ...defaultPieChartOptions.chart, 
                fontFamily: fontFamily,
                ...(customOptions?.chart || {}) 
            },
            labels: labels,
            colors: colors || defaultColors,
            stroke: { colors: [backColor], ...(customOptions?.stroke || {}) },
            theme: { 
                mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light',
                ...(customOptions?.theme || {}) 
            }
        };
    }, [colorScheme, fontFamily, backColor, labels, colors, customOptions, defaultColors]);

    const chartKey = useMemo(() => {
        return `${series?.length || 0}-${labels?.join(',')}-${colors?.join(',')}`;
    }, [series?.length, labels, colors]);

    return <ReactApexChart key={chartKey} options={options} series={series} type="pie" height={finalHeight} />;
}

export default PieChart;