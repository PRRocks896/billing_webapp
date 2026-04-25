import { useState, useEffect } from 'react';

// material-ui
import { useColorScheme } from '@mui/material/styles';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

export interface DataChartProps {
    color?: string;
    height?: number | string;
    data?: any[];
    label?: string;
    chartType?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
    customOptions?: ApexOptions;
    xaxisLabels?: string[];
}

// default chart options
const defaultChartOptions: ApexOptions = {
    chart: {
        id: 'standalone-data-chart',
        type: 'bar',
        background: 'transparent',
        sparkline: { enabled: true },
        toolbar: { show: false },
        offsetX: -2
    },
    dataLabels: { enabled: false },
    plotOptions: { bar: { borderRadius: 2, columnWidth: '80%' } },
    xaxis: { crosshairs: { width: 1 } },
    tooltip: { fixed: { enabled: false }, x: { show: true }, y: { formatter: (value: any) => `${value}` } }
};

// ==============================|| CHART - DATA CHART ||============================== //

export default function DataChart({
    color = '#1890ff',
    height = 50,
    data = [10, 30, 40, 20, 60, 50, 20, 15, 20, 25, 30, 25],
    label = 'Users',
    chartType = 'bar',
    customOptions,
    xaxisLabels
}: DataChartProps) {
    const { colorScheme } = useColorScheme();

    const {
        state: { fontFamily }
    } = useConfig();

    const [options, setOptions] = useState<ApexOptions>(defaultChartOptions);
    const series = [{ name: label, data }];

    useEffect(() => {
        setOptions((prevState) => ({
            ...defaultChartOptions,
            ...customOptions,
            chart: {
                ...defaultChartOptions.chart,
                type: chartType,
                fontFamily: fontFamily,
                ...(customOptions?.chart || {})
            },
            colors: customOptions?.colors || [color],
            xaxis: {
                ...defaultChartOptions.xaxis,
                ...(xaxisLabels ? { categories: xaxisLabels } : {}),
                ...(customOptions?.xaxis || {})
            },
            theme: {
                mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light',
                ...(customOptions?.theme || {})
            }
        }));
    }, [color, fontFamily, colorScheme, chartType, customOptions, xaxisLabels]);

    // key ensures chart re-renders properly if it starts empty and gets a single data point
    return <ReactApexChart key={data.length} options={options} series={series} type={chartType} height={height} />;
}
