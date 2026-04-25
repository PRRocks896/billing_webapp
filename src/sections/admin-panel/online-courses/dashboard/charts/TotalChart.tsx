import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme } from '@mui/material/styles';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

interface Props {
  color: string;
  data: number[];
}

// chart options
const areaChartOptions: ApexOptions = {
  chart: { type: 'line', zoom: { enabled: false }, sparkline: { enabled: true }, background: 'transparent' },
  plotOptions: { bar: { borderRadius: 0 } },
  dataLabels: { enabled: false },
  markers: { hover: { size: 5 } },
  tooltip: { x: { show: false } },
  grid: { show: false },
  stroke: { width: 2 }
};

// ==============================|| TOTAL CARD - CHART ||============================== //

export function ToatlChart({ color, data }: Props) {
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [color],
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, color]);

  const [series] = useState([{ name: 'Orders', data }]);

  return <ReactApexChart options={options} series={series} type="line" height={43} />;
}
