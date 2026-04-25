import { useEffect, useState } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
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

// assets
import { ArrowDown } from 'iconsax-reactjs';
import useConfig from 'hooks/useConfig';

// ==============================|| CHART ||============================== //

// chart options
const areaChartOptions: ApexOptions = {
  chart: {
    id: 'visitors-chart',
    type: 'rangeBar',
    background: 'transparent',
    sparkline: { enabled: true },
    toolbar: { show: false },
    offsetX: -2
  },
  plotOptions: { bar: { columnWidth: '30%', borderRadius: 5, horizontal: false } },
  yaxis: { show: false },
  grid: { show: false },
  dataLabels: { enabled: false }
};

function DataChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const {
    state: { fontFamily }
  } = useConfig();

  const warningMain = theme.vars.palette.warning.main;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [warningMain],
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, warningMain]);

  const [series] = useState([
    {
      data: [
        { x: 'Rejected', y: [1, 6] },
        { x: 'Pending', y: [3, 7] },
        { x: 'New', y: [4, 8] },
        { x: 'Verified', y: [5, 9] },
        { x: 'Store', y: [4, 8] },
        { x: 'Deleted', y: [4, 7] },
        { x: 'Block', y: [2, 5] }
      ]
    }
  ]);

  return <ReactApexChart options={options} series={series} type="rangeBar" height={86} />;
}

// ==============================|| CHART WIDGETS - VISITORS ||============================== //

export default function Visitors() {
  const [age, setAge] = useState('30');
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5">Visitors</Typography>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
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
          <DataChart />
        </Grid>
        <Grid size={12}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="subtitle1">$30,200</Typography>
            <Typography sx={{ color: 'error.dark', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
              <ArrowDown size={14} style={{ transform: 'rotate(-45deg)' }} />
              30.6%
            </Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <Button fullWidth variant="outlined" color="secondary">
            View more
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
}
