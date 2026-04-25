import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

interface ChartProp {
  name: string;
  data: number[];
}
interface Props {
  data: ChartProp[];
}

// chart options
const lineChartOptions: ApexOptions = {
  chart: { type: 'line', zoom: { enabled: false }, toolbar: { show: false }, background: 'transparent' },
  xaxis: { categories: [2018, 2019, 2020, 2021, 2022, 2023], axisTicks: { show: false }, axisBorder: { show: false } },
  yaxis: { stepSize: 200 },
  plotOptions: { bar: { borderRadius: 0 } },
  dataLabels: { enabled: false },
  tooltip: { x: { show: false } },
  grid: { show: false }
};

// ==============================|| EARNING - CHART ||============================== //

export default function EarningChart({ data }: Props) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const [options, setOptions] = useState(lineChartOptions);

  const {
    state: { fontFamily }
  } = useConfig();

  const textSecondary = theme.vars.palette.text.secondary;
  const warningMain = theme.vars.palette.warning.main;

  useEffect(() => {
    setOptions({
      ...lineChartOptions,
      chart: { ...lineChartOptions.chart, fontFamily: fontFamily },
      xaxis: { ...lineChartOptions.xaxis, labels: { style: { colors: textSecondary } } },
      yaxis: { ...lineChartOptions.yaxis, labels: { style: { colors: textSecondary } } },
      colors: [warningMain],
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, textSecondary, warningMain, fontFamily]);

  const [series, setSeries] = useState(data);

  useEffect(() => {
    setSeries(data);
  }, [data]);

  return <ReactApexChart options={options} series={series} type="line" height={212} />;
}
