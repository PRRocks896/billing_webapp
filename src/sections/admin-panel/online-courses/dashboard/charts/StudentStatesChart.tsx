import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

const pieChartOptions: ApexOptions = {
  chart: { type: 'donut', height: 299, background: 'transparent' },
  labels: ['Total Signups', 'Active Student'],
  dataLabels: { enabled: false },
  legend: { show: true, position: 'bottom' }
};

// ==============================|| STUDENT STATES - CHART ||============================== //s

export function ApexDonutChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const [options, setOptions] = useState(pieChartOptions);

  const {
    state: { fontFamily }
  } = useConfig();

  const primaryDark = theme.vars.palette.primary.dark;
  const primaryLight = theme.vars.palette.primary.light;
  const textPrimary = theme.vars.palette.text.primary;
  const line = theme.vars.palette.divider;

  const backgroundPaper = theme.vars.palette.background.paper;
  const series = [70, 30];

  useEffect(() => {
    setOptions({
      ...pieChartOptions,
      chart: { ...pieChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryDark, primaryLight],
      grid: { borderColor: line },
      stroke: { colors: [backgroundPaper] },
      legend: { ...pieChartOptions.legend, labels: { ...pieChartOptions.legend?.labels, colors: textPrimary } },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, primaryDark, primaryLight, line, backgroundPaper, textPrimary, fontFamily]);

  return <ReactApexChart options={options} series={series} type="donut" height={280} />;
}
