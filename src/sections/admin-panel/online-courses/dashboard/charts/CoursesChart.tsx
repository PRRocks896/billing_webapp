import { useState, useEffect } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

type ChartData = {
  name: string;
  data: number[];
};

// Initial chart options
const baseChartOptions: ApexOptions = {
  chart: { type: 'bar', toolbar: { show: false }, offsetX: -5, background: 'transparent' },
  plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
  yaxis: { labels: { show: false } },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 3, colors: ['transparent'] },
  grid: { strokeDashArray: 4 },
  tooltip: { y: { formatter: (val: number) => `$${val} thousands` } },
  xaxis: {
    categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    axisTicks: { show: false }
  },
  legend: { show: true, position: 'top', horizontalAlign: 'right' }
};

// ==============================|| DASHBOARD - COURSES CHART ||============================== //

export default function CoursesChart({ data }: { data: ChartData[] }) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const [chartSeries, setChartSeries] = useState(data);
  const [chartOptions, setChartOptions] = useState(baseChartOptions);

  const {
    state: { fontFamily }
  } = useConfig();

  const textSecondary = theme.vars.palette.text.secondary;
  const textPrimary = theme.vars.palette.text.primary;
  const primaryMain = theme.vars.palette.primary.main;
  const warningMain = theme.vars.palette.warning.main;
  const line = theme.vars.palette.divider;

  useEffect(() => {
    setChartOptions({
      ...baseChartOptions,
      colors: [primaryMain, warningMain],
      chart: { ...baseChartOptions.chart, fontFamily: fontFamily },
      grid: { ...baseChartOptions.grid, borderColor: line },
      legend: { ...baseChartOptions.legend, labels: { ...baseChartOptions.legend?.labels, colors: textPrimary } },
      xaxis: { ...baseChartOptions.xaxis, labels: { style: { colors: textSecondary } }, axisBorder: { color: line } },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, line, primaryMain, warningMain, textSecondary, textPrimary, fontFamily]);

  useEffect(() => {
    setChartSeries(data);
  }, [data]);

  return <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={190} />;
}
