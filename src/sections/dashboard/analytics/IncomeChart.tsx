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
  chart: { height: 355, type: 'area', background: 'transparent', toolbar: { show: false } },
  dataLabels: { enabled: false },
  stroke: { curve: 'straight', width: 1 },
  tooltip: {
    y: {
      formatter(val: number) {
        return `$ ${val}`;
      }
    }
  },
  grid: {
    show: true,
    strokeDashArray: 0,
    position: 'back',
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } }
  }
};

interface Props {
  slot: Slot;
  quantity: Quantity;
}

export type Quantity = 'By volume' | 'By margin' | 'By sales';
export type Slot = 'month' | 'week';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const dataMap: Record<Quantity, Record<Slot, number[]>> = {
  'By volume': {
    month: [100, 40, 60, 40, 40, 40, 80, 40, 40, 50, 40, 40],
    week: [100, 20, 60, 20, 20, 80, 20]
  },
  'By margin': {
    month: [120, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35],
    week: [51, 40, 28, 51, 42, 109, 100]
  },
  'By sales': {
    month: [90, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35],
    week: [21, 40, 28, 51, 42, 109, 100]
  }
};

// ==============================|| ANALYTICS - INCOME LINE CHART ||============================== //

export default function IncomeAreaChart({ slot, quantity }: Props) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const {
    state: { fontFamily }
  } = useConfig();

  const textSecondary = theme.vars.palette.text.secondary;
  const line = theme.vars.palette.divider;
  const primaryMain = theme.vars.palette.primary.main;
  const primary700 = theme.vars.palette.primary[700]!;
  const backgroundPaper = theme.vars.palette.background.paper;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryMain, primary700],
      fill: {
        gradient: {
          colorStops: [
            [
              { offset: 0, color: primaryMain, opacity: 0.2 },
              { offset: 100, color: backgroundPaper, opacity: 0.1 }
            ]
          ]
        }
      },
      xaxis: {
        ...areaChartOptions.xaxis,
        categories: slot === 'month' ? months : weeks,
        labels: { style: { colors: textSecondary } },
        axisBorder: { show: true, color: line },
        tickAmount: slot === 'month' ? 11 : 7
      },
      yaxis: { labels: { style: { colors: textSecondary } } },
      grid: { ...areaChartOptions.grid, borderColor: line },

      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [backgroundPaper, colorScheme, fontFamily, textSecondary, line, primaryMain, primary700, slot]);

  const [series, setSeries] = useState([{ name: 'Income', data: [0, 86, 28, 115, 48, 210, 136] }]);

  useEffect(() => {
    setSeries([{ name: 'Income', data: dataMap[quantity][slot] }]);
  }, [quantity, slot]);

  return <ReactApexChart options={options} series={series} type="area" height={355} />;
}
