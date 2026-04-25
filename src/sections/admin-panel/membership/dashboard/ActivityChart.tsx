import { useState, useEffect } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// chart options
const areaChartOptions: ChartProps = {
  chart: { type: 'area', toolbar: { show: false }, background: 'transparent' },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisTicks: { show: false },
    axisBorder: { show: false }
  },
  yaxis: { max: 600, stepSize: 200 },
  stroke: { curve: 'monotoneCubic', width: 2 },
  dataLabels: { enabled: false },
  legend: {
    show: true,
    fontWeight: 500,
    position: 'top',
    markers: { size: 5 },
    itemMargin: { horizontal: 10, vertical: 4 }
  },
  plotOptions: { bar: { columnWidth: '45%', borderRadius: 4 } }
};

// ==============================|| MEMBERSHIP - DASHBOARD - ACTIVITY CHART ||============================== //

export default function ActivityChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const textSecondary = theme.vars.palette.text.secondary;
  const textPrimary = theme.vars.palette.text.primary;
  const successMain = theme.vars.palette.success.main;
  const successLighter = theme.vars.palette.success.lighter;
  const backgroundPaper = theme.vars.palette.background.paper;
  const line = theme.vars.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [successMain, successLighter],
      xaxis: { ...areaChartOptions.xaxis, labels: { style: { colors: textSecondary } } },
      legend: { ...areaChartOptions.legend, labels: { ...areaChartOptions.legend?.labels, colors: textPrimary } },
      fill: {
        gradient: {
          colorStops: [
            [
              { offset: 0, color: successMain, opacity: 0.2 },
              { offset: 100, color: backgroundPaper, opacity: 0.1 }
            ],
            [
              { offset: 0, color: successLighter, opacity: 0.2 },
              { offset: 100, color: backgroundPaper, opacity: 0.1 }
            ]
          ]
        }
      },
      yaxis: { ...areaChartOptions.yaxis, labels: { style: { colors: [textSecondary] } } },
      grid: { borderColor: line },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, textSecondary, successMain, successLighter, line, backgroundPaper, textPrimary]);

  const [series] = useState([
    {
      name: 'Active',
      data: [20, 230, 280, 220, 120, 90, 250, 460, 580, 590, 480, 200]
    },
    {
      name: 'Inactive',
      data: [80, 450, 550, 450, 250, 200, 250, 300, 250, 200, 350, 450]
    }
  ]);
  return <ReactApexChart options={options} series={series} type="area" height={225} />;
}
