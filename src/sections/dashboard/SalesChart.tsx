import { useEffect, useState, ChangeEvent } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// chart options
const columnChartOptions: ApexOptions = {
  chart: { type: 'bar', height: 430, background: 'transparent', toolbar: { show: false } },
  plotOptions: { bar: { columnWidth: '30%', borderRadius: 4 } },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 8, colors: ['transparent'] },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  yaxis: {
    title: { text: '$ (thousands)' }
  },
  fill: { opacity: 1 },
  tooltip: {
    y: {
      formatter(val: number) {
        return `$ ${val} thousands`;
      }
    }
  },
  legend: { show: false }
};

const initialSeries = [
  { name: 'Income', data: [180, 90, 135, 114, 120, 145] },
  { name: 'Cost Of Sales', data: [120, 45, 78, 150, 168, 99] }
];

// ==============================|| DASHBOARD - SALES COLUMN CHART ||============================== //

export default function SalesChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const [age, setAge] = useState('30');
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [legend, setLegend] = useState({
    income: true,
    cos: true
  });

  const { income, cos } = legend;

  const {
    state: { fontFamily }
  } = useConfig();

  const textPrimary = theme.vars.palette.text.primary;
  const textSecondary = theme.vars.palette.text.secondary;
  const line = theme.vars.palette.divider;

  const warningMain = theme.vars.palette.warning.main;
  const primaryMain = theme.vars.palette.primary.main;
  const secondaryMain = theme.vars.palette.secondary.main;

  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [series, setSeries] = useState(initialSeries);
  const [options, setOptions] = useState(columnChartOptions);

  const handleLegendChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLegend({ ...legend, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    if (income && cos) {
      setSeries(initialSeries);
    } else if (income) {
      setSeries([{ name: 'Income', data: [180, 90, 135, 114, 120, 145] }]);
    } else if (cos) {
      setSeries([{ name: 'Cost Of Sales', data: [120, 45, 78, 150, 168, 99] }]);
    } else {
      setSeries([]);
    }
  }, [income, cos]);

  useEffect(() => {
    setOptions({
      ...columnChartOptions,
      chart: { ...columnChartOptions.chart, fontFamily: fontFamily },
      colors: !(income && cos) && cos ? [primaryMain] : [warningMain, primaryMain],
      xaxis: {
        ...columnChartOptions.xaxis,
        labels: { style: { colors: textSecondary } }
      },
      yaxis: {
        ...columnChartOptions.yaxis,
        labels: { style: { colors: textSecondary } },
        title: { ...(columnChartOptions.yaxis as ApexYAxis)?.title, style: { color: textPrimary } }
      },
      grid: { borderColor: line },
      plotOptions: { ...columnChartOptions.plotOptions, bar: { columnWidth: downSM ? '60%' : '30%' } },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, textSecondary, textPrimary, secondaryMain, line, warningMain, primaryMain, income, cos, downSM]);

  return (
    <MainCard>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Sales Report</Typography>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <Select id="demo-simple-select" value={age} onChange={handleChange}>
              <MenuItem value={10}>Today</MenuItem>
              <MenuItem value={20}>Weekly</MenuItem>
              <MenuItem value={30}>Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
        <Stack>
          <Typography variant="h6" color="secondary">
            Net Profit
          </Typography>
          <Typography variant="h4">$1560</Typography>
        </Stack>
        <FormControl component="fieldset" sx={{ width: 136 }}>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox color="warning" checked={income} onChange={handleLegendChange} name="income" />}
              label="Income"
            />
            <FormControlLabel control={<Checkbox checked={cos} onChange={handleLegendChange} name="cos" />} label="Cost of Sales" />
          </FormGroup>
        </FormControl>
      </Stack>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height={360} />
      </div>
    </MainCard>
  );
}
