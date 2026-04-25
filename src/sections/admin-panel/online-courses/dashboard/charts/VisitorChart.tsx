import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

interface Props {
  data: { data: number[] }[];
}

// chart options
const barChartOptions: ApexOptions = {
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
  xaxis: { categories: [2018, 2019, 2020, 2021, 2022, 2023], axisTicks: { show: false }, axisBorder: { show: false } },
  plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 3, colors: ['transparent'] },
  grid: { show: false }
};

// ==============================|| VISITOR - CHART ||============================== //

export default function VisitorChart({ data }: Props) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const [options, setOptions] = useState(barChartOptions);
  const [series, setSeries] = useState(data);

  const {
    state: { fontFamily }
  } = useConfig();

  const textSecondary = theme.vars.palette.text.secondary;
  const successMain = theme.vars.palette.success.main;

  useEffect(() => {
    setOptions({
      ...barChartOptions,
      chart: { ...barChartOptions.chart, fontFamily: fontFamily },
      xaxis: { ...barChartOptions.xaxis, labels: { style: { colors: textSecondary } } },
      yaxis: { labels: { style: { colors: textSecondary } } },
      colors: [successMain],
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, textSecondary, successMain, fontFamily]);

  useEffect(() => {
    setSeries(data);
  }, [data]);

  return <ReactApexChart options={options} series={series} type="bar" height={233} />;
}
