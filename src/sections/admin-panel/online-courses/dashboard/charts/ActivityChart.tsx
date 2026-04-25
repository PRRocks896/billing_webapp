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

// chart options
const areaChartOptions: ApexOptions = {
  chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent' },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  legend: { show: true, position: 'top', horizontalAlign: 'right' },
  tooltip: { shared: true, intersect: false },
  markers: { size: 3, strokeWidth: 2, hover: { size: 6 } },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisBorder: { show: false },
    axisTicks: { show: false }
  }
};

// ==============================|| DASHBOARD - ACTIVITY CHART ||============================== //

export default function ActivityChart({ data }: { data: ChartData[] }) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const [chartSeries, setChartSeries] = useState(data);
  const [chartOptions, setChartOptions] = useState(areaChartOptions);

  const {
    state: { fontFamily }
  } = useConfig();

  const primaryMain = theme.vars.palette.primary.main;
  const successMain = theme.vars.palette.success.main;
  const textPrimary = theme.vars.palette.text.primary;
  const textSecondary = theme.vars.palette.text.secondary;
  const line = theme.vars.palette.divider;

  useEffect(() => {
    setChartOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      legend: { ...areaChartOptions.legend, labels: { ...areaChartOptions.legend?.labels, colors: textPrimary } },
      colors: [primaryMain, successMain],
      xaxis: { ...areaChartOptions.xaxis, labels: { style: { colors: textSecondary } }, axisBorder: { color: line } },
      yaxis: { ...areaChartOptions.yaxis, labels: { style: { colors: textSecondary } } },
      markers: { ...areaChartOptions.markers, colors: [primaryMain, successMain], strokeColors: 'white' },
      grid: { borderColor: line },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, line, primaryMain, successMain, textSecondary, textPrimary, fontFamily]);

  useEffect(() => {
    setChartSeries(data);
  }, [data]);

  return <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={240} />;
}
