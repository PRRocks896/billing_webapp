import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// chart options
const barChartOptions: ApexOptions = {
  chart: { type: 'bar', height: 250, width: '100%', background: 'transparent', stacked: true, toolbar: { show: false } },
  xaxis: { axisBorder: { show: false }, axisTicks: { show: false }, labels: { show: false } },
  yaxis: { labels: { show: false } },
  tooltip: { x: { show: false } },
  legend: { show: true, position: 'bottom', horizontalAlign: 'left', offsetX: 10, markers: { size: 7 } },
  dataLabels: { enabled: false },
  grid: { show: false },
  stroke: { colors: ['transparent'], width: 1 }
};

// ==============================|| ACQUISITION CHANNELS - CHART ||============================== //

export default function AcquisitionChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const {
    state: { fontFamily }
  } = useConfig();

  const secondaryDarker = theme.vars.palette.secondary.darker;
  const secondaryMain = theme.vars.palette.secondary.main;
  const primaryMain = theme.vars.palette.primary.main;
  const primary200 = theme.vars.palette.primary[200]!;

  const [series] = useState([
    { name: 'Direct', data: [21, 17, 15, 13, 15, 13, 16, 13, 8, 14, 11, 9, 7, 5, 3, 3, 7] },
    { name: 'Referral', data: [28, 30, 20, 26, 18, 27, 22, 28, 20, 21, 15, 14, 12, 10, 8, 18, 16] },
    { name: 'Social', data: [50, 51, 60, 54, 53, 48, 55, 40, 44, 42, 44, 44, 42, 40, 42, 32, 16] }
  ]);

  const [options, setOptions] = useState(barChartOptions);
  useEffect(() => {
    setOptions({
      ...barChartOptions,
      chart: { ...barChartOptions.chart, fontFamily: fontFamily },
      colors: [secondaryDarker, primaryMain, primary200],
      legend: { ...barChartOptions.legend, labels: { colors: secondaryMain } },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, secondaryDarker, secondaryMain, primaryMain, primary200]);

  return <ReactApexChart options={options} series={series} type="bar" height={250} />;
}
