import { useEffect, useState, MouseEvent } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import Dot from 'components/@extended/Dot';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// ==============================|| CHART ||============================== //

// chart options
const pieChartOptions: ApexOptions = {
  chart: { type: 'pie', background: 'transparent' },
  tooltip: { enabled: true, fillSeriesColor: false },
  labels: ['Components', 'Widgets', 'Pages', 'Forms', 'Other', 'Apps'],
  legend: { show: false }
};

function ApexPieChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const {
    state: { fontFamily }
  } = useConfig();

  const backColor = theme.vars.palette.background.paper;
  const primaryMain = theme.vars.palette.primary.main;
  const primary200 = theme.vars.palette.primary[200];
  const secondaryMain = theme.vars.palette.secondary.main;
  const secondary500 = theme.vars.palette.secondary[500];
  const secondaryDark = theme.vars.palette.secondary.dark;
  const secondaryDarker = theme.vars.palette.secondary.darker;

  const [options, setOptions] = useState(pieChartOptions);

  const [series] = useState([40, 20, 10, 15, 5, 10]);

  useEffect(() => {
    setOptions({
      ...pieChartOptions,
      chart: { ...pieChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryMain, primary200, secondary500, secondaryMain, secondaryDark, secondaryDarker],
      stroke: { colors: [backColor] },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, backColor, primaryMain, primary200, secondary500, secondaryMain, secondaryDark, secondaryDarker]);

  return <ReactApexChart options={options} series={series} type="pie" height={downSM ? 280 : 316} />;
}

// ==============================|| CHART WIDGETS - PRODUCT OVERVIEW ||============================== //

export default function ProductOverview() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5">Project overview</Typography>
            <IconButton
              color="secondary"
              id="wallet-button"
              aria-controls={open ? 'wallet-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              id="wallet-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{ list: { 'aria-labelledby': 'wallet-button', sx: { p: 1.25, minWidth: 150 } } }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <ListItemButton onClick={handleClose}>Today</ListItemButton>
              <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
              <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
            </Menu>
          </Stack>
        </Grid>
        <Grid size={12}>
          <ApexPieChart />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <MainCard content={false}>
            <Stack sx={{ alignItems: 'center', py: 1.5 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} />
                <Typography>Apps</Typography>
              </Stack>
              <Typography variant="subtitle1">10+</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <MainCard content={false}>
            <Stack sx={{ alignItems: 'center', py: 1.5 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.dark' }} />
                <Typography>Other</Typography>
              </Stack>
              <Typography variant="subtitle1">5+</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <MainCard content={false}>
            <Stack sx={{ alignItems: 'center', py: 1.5 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <Dot size={6} componentDiv sx={{ bgcolor: 'primary.200' }} />
                <Typography>Widgets</Typography>
              </Stack>
              <Typography variant="subtitle1">150+</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <MainCard content={false}>
            <Stack sx={{ alignItems: 'center', py: 1.5 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.main' }} />
                <Typography>Forms</Typography>
              </Stack>
              <Typography variant="subtitle1">50+</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <MainCard content={false}>
            <Stack sx={{ alignItems: 'center', py: 1.5 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <Dot size={6} componentDiv sx={{ bgcolor: 'primary.main' }} />
                <Typography>Components</Typography>
              </Stack>
              <Typography variant="subtitle1">200+</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <MainCard content={false}>
            <Stack sx={{ alignItems: 'center', py: 1.5 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.500' }} />
                <Typography>Pages</Typography>
              </Stack>
              <Typography variant="subtitle1">150+</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={12}>
          <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center' }}>
            <Button variant="outlined" fullWidth color="secondary">
              View all
            </Button>
            <Button variant="contained" fullWidth>
              Create new page
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
