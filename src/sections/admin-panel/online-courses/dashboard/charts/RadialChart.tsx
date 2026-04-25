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
const radialChartOptions: ApexOptions = {
  chart: { type: 'radialBar', offsetY: -40, background: 'transparent' },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: { size: '70%', background: 'transparent' },
      track: { strokeWidth: '50%' },
      dataLabels: { name: { show: false }, value: { offsetY: -30, fontSize: '24px' } }
    }
  },
  stroke: { lineCap: 'round', width: 20 }
};

// ==============================|| INVITE GOAL - CHART ||============================== //

export default function RadialBarChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const {
    state: { fontFamily }
  } = useConfig();

  const secondary200 = theme.vars.palette.secondary[200];
  const textPrimary = theme.vars.palette.text.primary;
  const primaryMain = theme.vars.palette.primary.main;

  const [options, setOptions] = useState(radialChartOptions);

  useEffect(() => {
    setOptions({
      ...radialChartOptions,
      chart: { ...radialChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryMain],
      plotOptions: {
        ...radialChartOptions.plotOptions,
        radialBar: {
          ...radialChartOptions.plotOptions?.radialBar,
          track: { background: secondary200 },
          dataLabels: {
            ...radialChartOptions.plotOptions?.radialBar?.dataLabels,
            value: { ...radialChartOptions.plotOptions?.radialBar?.dataLabels?.value, color: textPrimary }
          }
        }
      },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, primaryMain, secondary200, textPrimary]);

  const [series] = useState([75.55]);

  return <ReactApexChart options={options} series={series} type="radialBar" height={350} />;
}
