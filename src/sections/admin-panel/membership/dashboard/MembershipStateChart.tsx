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
const initialChartOptions: ApexOptions = {
  chart: { type: 'radialBar', sparkline: { enabled: true }, offsetX: 0, offsetY: 0, background: 'transparent' },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: { strokeWidth: '80%', show: true, margin: 0 },
      dataLabels: { name: { show: false }, value: { offsetY: -2, fontSize: '20px' } }
    }
  },
  labels: ['Average Results']
};

// ==============================|| MEMBERSHIP - DASHBOARD - MEMBERSHIP STATE CHART ||============================== //

export default function MembershipStateChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const [options, setOptions] = useState(initialChartOptions);
  const {
    state: { fontFamily }
  } = useConfig();

  const primaryLighter = theme.vars.palette.primary.lighter;
  const primaryMain = theme.vars.palette.primary.main;

  useEffect(() => {
    setOptions({
      ...initialChartOptions,
      chart: { ...initialChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryMain],
      plotOptions: {
        radialBar: {
          ...initialChartOptions.plotOptions?.radialBar,
          track: { background: primaryLighter }
        }
      },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, primaryLighter, primaryMain, fontFamily]);

  const [series] = useState([75]);

  return <ReactApexChart options={options} series={series} type="radialBar" height={400} />;
}
