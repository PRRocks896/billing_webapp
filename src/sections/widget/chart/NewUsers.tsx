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
import { ArrowUp } from 'iconsax-reactjs';

// ==============================|| CHART ||============================== //

// chart options
const areaChartOptions: ApexOptions = {
  chart: {
    id: 'new-users-chart',
    type: 'area',
    background: 'transparent',
    sparkline: { enabled: true },
    offsetX: -1
  },
  stroke: { width: 1 },
  dataLabels: { enabled: false },
  series: [{ data: [1, 1, 60, 1, 1, 50, 1, 1, 40, 1, 1, 25, 0] }],
  tooltip: {
    fixed: { enabled: false },
    x: { show: false },
    y: { title: { formatter: () => '' } }
  }
};

function DataChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const successMain = theme.vars.palette.success.main;
  const backgroundPaper = theme.vars.palette.background.paper;

  const [options, setOptions] = useState(areaChartOptions);

  const [series] = useState([{ data: [1, 1, 60, 1, 1, 50, 1, 1, 40, 1, 1, 25, 0] }]);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart },
      colors: [successMain],
      fill: {
        gradient: {
          colorStops: [
            [
              { offset: 0, color: successMain, opacity: 0.2 },
              { offset: 100, color: backgroundPaper, opacity: 0.1 }
            ]
          ]
        }
      },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [backgroundPaper, colorScheme, successMain]);

  return <ReactApexChart options={options} series={series} type="area" height={86} />;
}

// ==============================|| CHART WIDGETS - NEW USERS ||============================== //

export default function NewUsers() {
  const [age, setAge] = useState('30');
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5">New Users</Typography>
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
            <Typography sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
              <ArrowUp size={14} style={{ transform: 'rotate(45deg)' }} />
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
