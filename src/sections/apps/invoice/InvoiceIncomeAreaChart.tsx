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
  chart: { height: 350, type: 'line', background: 'transparent', stacked: false, toolbar: { show: false } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], axisBorder: { show: false } },
  fill: {
    type: 'gradient',
    gradient: { shade: 'light', type: 'vertical', opacityFrom: [0, 1], opacityTo: [0.2, 1], stops: [0, 100] }
  },
  plotOptions: { bar: { columnWidth: '50%' } },
  legend: { show: false },
  stroke: { width: [0, 2], curve: 'smooth' },
  markers: { size: [0, 3], strokeWidth: [0, 2], hover: { size: 5 } },
  dataLabels: { enabled: false }
};

// ==============================|| INVOICE - INCOME AREA CHART ||============================== //

export default function InvoiceIncomeAreaChart({ series }: { series: any }) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const textSecondary = theme.vars.palette.text.secondary;
  const line = theme.vars.palette.divider;
  const warningMain = theme.vars.palette.warning.main;
  const backgroundPaper = theme.vars.palette.background.paper;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [warningMain, warningMain],
      xaxis: { ...areaChartOptions.xaxis, labels: { style: { colors: textSecondary } } },
      yaxis: { labels: { style: { colors: textSecondary } } },
      fill: {
        ...areaChartOptions.fill,
        type: 'gradient',
        gradient: { ...areaChartOptions.fill?.gradient, gradientToColors: [warningMain] }
      },
      markers: { ...areaChartOptions.markers, colors: backgroundPaper, strokeColors: warningMain },
      grid: { borderColor: line },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [backgroundPaper, colorScheme, fontFamily, textSecondary, line, warningMain]);

  return <ReactApexChart options={options} series={series} type="line" height={262} />;
}
