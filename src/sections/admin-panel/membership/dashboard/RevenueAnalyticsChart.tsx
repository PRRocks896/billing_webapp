import { useState, useEffect } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// chart options
const areaChartOptions: ApexOptions = {
  chart: { type: 'area', toolbar: { show: false }, offsetY: 16, background: 'transparent' },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      formatter: function (value: number) {
        return `$${value}K`;
      }
    }
  },
  dataLabels: { enabled: false },
  stroke: { width: 1 },
  legend: {
    show: true,
    position: 'bottom',
    offsetY: 20,
    fontWeight: 500,
    labels: { useSeriesColors: false },
    markers: { size: 4 },
    itemMargin: { horizontal: 10, vertical: 4 }
  },
  plotOptions: { bar: { columnWidth: '45%', borderRadius: 4 } },
  grid: { strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } }
};

// ==============================|| MEMBERSHIP - DASHBOARD - REVENUE ANALYTICS CHART ||============================== //

export default function RevenueAnalyticsChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const {
    state: { fontFamily }
  } = useConfig();

  const primaryMain = theme.vars.palette.primary.main;
  const textPrimary = theme.vars.palette.text.primary;
  const textSecondary = theme.vars.palette.text.secondary;
  const warningMain = theme.vars.palette.warning.main;
  const backgroundPaper = theme.vars.palette.background.paper;
  const line = theme.vars.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryMain, warningMain],
      xaxis: { ...areaChartOptions.xaxis, labels: { style: { colors: textSecondary } } },
      fill: {
        gradient: {
          colorStops: [
            [
              { offset: 0, color: primaryMain, opacity: 0.2 },
              { offset: 100, color: backgroundPaper, opacity: 0.1 }
            ],
            [
              { offset: 0, color: warningMain, opacity: 0.2 },
              { offset: 100, color: backgroundPaper, opacity: 0.1 }
            ]
          ]
        }
      },
      yaxis: {
        ...(areaChartOptions.yaxis as ApexYAxis),
        labels: { ...(areaChartOptions.yaxis as ApexYAxis)?.labels, style: { colors: [textSecondary] } }
      },
      grid: { ...areaChartOptions.grid, borderColor: line },
      legend: { ...areaChartOptions.legend, labels: { ...areaChartOptions.legend?.labels, colors: textPrimary } },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, primaryMain, textPrimary, warningMain, backgroundPaper, line, textSecondary, fontFamily]);

  const [series] = useState([
    {
      name: 'Revenue',
      data: [4, 2.5, 8, 3.6, 4.4, 1.8, 11, 9.7, 12, 8.5, 11.5, 6]
    },
    {
      name: 'Earning',
      data: [1, 3.5, 3.7, 4.5, 5.4, 4.7, 5.2, 6.5, 5.8, 6.2, 6.7, 8.2]
    }
  ]);

  return <ReactApexChart options={options} series={series} type="area" height={370} />;
}
