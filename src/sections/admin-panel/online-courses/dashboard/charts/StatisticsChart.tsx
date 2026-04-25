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

// ==============================|| STATISTICS - CHART ||============================== //

// chart options
const areaChartOptions: ApexOptions = {
  chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent' },
  stroke: { curve: 'smooth', width: 2 },
  dataLabels: { enabled: false },
  legend: { show: true, position: 'top', horizontalAlign: 'right' },
  tooltip: { shared: true, intersect: false, y: { formatter: (val: number) => `$${val}` } },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      formatter: function (value: number) {
        return `$${value}`;
      }
    }
  }
};

// ==============================|| DASHBOARD - STATISTICS CARD ||============================== //

export default function StatisticsChart({ data }: { data: ChartData[] }) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const [chartSeries, setChartSeries] = useState(data);
  const [chartOptions, setChartOptions] = useState(areaChartOptions);

  const {
    state: { fontFamily }
  } = useConfig();

  const textSecondary = theme.vars.palette.text.secondary;
  const textPrimary = theme.vars.palette.text.primary;
  const line = theme.vars.palette.divider;
  const primaryMain = theme.vars.palette.primary.main;
  const successMain = theme.vars.palette.success.main;
  const backgroundPaper = theme.vars.palette.background.paper;

  useEffect(() => {
    setChartOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryMain, successMain],
      fill: {
        gradient: {
          colorStops: [
            [
              { offset: 0, color: primaryMain, opacity: 0.2 },
              { offset: 100, color: backgroundPaper, opacity: 0 }
            ],
            [
              { offset: 0, color: successMain, opacity: 0.2 },
              { offset: 100, color: backgroundPaper, opacity: 0 }
            ]
          ]
        }
      },
      legend: { labels: { colors: textPrimary } },
      xaxis: { ...areaChartOptions.xaxis, labels: { style: { colors: textSecondary } } },
      yaxis: {
        ...(areaChartOptions.yaxis as ApexYAxis),
        labels: { ...(areaChartOptions.yaxis as ApexYAxis)?.labels, style: { colors: textSecondary } }
      },
      grid: { borderColor: line },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, backgroundPaper, fontFamily, primaryMain, successMain, textSecondary, textPrimary, line]);

  useEffect(() => {
    setChartSeries(data);
  }, [data]);

  return <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={260} />;
}
