import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';
import { withAlpha } from 'utils/colorUtils';

// ==============================|| CHART ||============================== //

// chart options
const barChartOptions: ApexOptions = {
  chart: { type: 'bar', background: 'transparent', stacked: true, toolbar: { show: false } },
  grid: { strokeDashArray: 4 },
  dataLabels: { enabled: false },
  plotOptions: { bar: { columnWidth: '80%' } },
  xaxis: {
    categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    crosshairs: { width: 1 },
    tickAmount: 11
  },
  tooltip: { fixed: { enabled: false }, x: { show: false } },
  legend: { show: false }
};

function EcommerceDataChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const {
    state: { fontFamily }
  } = useConfig();

  const line = theme.vars.palette.divider;
  const textSecondary = theme.vars.palette.text.secondary;
  const primaryMain = theme.vars.palette.primary.main;
  const primaryLight = theme.vars.palette.primary.light;
  const primary200 = theme.vars.palette.primary[200]!;
  const warningLight = theme.vars.palette.warning.light;

  const [series] = useState([
    { name: 'Deals', data: [44, 55, 41, 67, 52, 53, 13, 23, 20, 8, 13, 27] },
    { name: 'Income Report', data: [13, 23, 20, 8, 13, 27, 21, 7, 25, 13, 22, 8] },
    { name: 'Customer', data: [11, 17, 15, 15, 21, 14, 11, 17, 15, 15, 21, 14] },
    { name: 'Profits', data: [21, 7, 25, 13, 22, 3, 44, 55, 41, 67, 22, 12] }
  ]);

  const [options, setOptions] = useState(barChartOptions);

  useEffect(() => {
    setOptions({
      ...barChartOptions,
      chart: { ...barChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryMain, withAlpha(primaryLight, 0.7), withAlpha(primary200, 0.4), withAlpha(warningLight, 0.3)],
      xaxis: { ...barChartOptions.xaxis, labels: { style: { colors: textSecondary } } },
      yaxis: { labels: { style: { colors: textSecondary } } },
      grid: { ...barChartOptions.grid, borderColor: line },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, textSecondary, line, primaryMain, primaryLight, primary200, warningLight]);

  return <ReactApexChart options={options} series={series} type="bar" height={350} />;
}

// ==============================|| CHART WIDGETS - MONTHLY REPORT ||============================== //

export default function MonthlyReport() {
  const [age, setAge] = useState('30');
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <MainCard>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5">Monthly Report</Typography>
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
        </Grid>
        <Grid size={12}>
          <EcommerceDataChart />
        </Grid>
      </Grid>
    </MainCard>
  );
}
