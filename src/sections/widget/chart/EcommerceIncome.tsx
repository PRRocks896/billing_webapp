import { useEffect, useState, MouseEvent } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import { DollarCircle } from 'iconsax-reactjs';

// ==============================|| CHART  ||============================== //

// chart options
const areaChartOptions: ApexOptions = {
  chart: {
    id: 'ecommerce-income-chart',
    type: 'bar',
    background: 'transparent',
    sparkline: { enabled: true },
    toolbar: { show: false },
    offsetX: -4
  },
  dataLabels: { enabled: false },
  plotOptions: { bar: { columnWidth: '80%' } },
  xaxis: { crosshairs: { width: 1 } },
  tooltip: { fixed: { enabled: false }, x: { show: false } }
};

function EcommerceDataChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const {
    state: { fontFamily }
  } = useConfig();

  const [options, setOptions] = useState(areaChartOptions);

  const successMain = theme.vars.palette.success.main;

  const [series] = useState([
    {
      name: 'Users',
      data: [10, 30, 40, 20, 60, 50, 20, 15, 20, 25, 30, 25]
    }
  ]);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [successMain],
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, successMain]);

  return <ReactApexChart options={options} series={series} type="bar" height={103} />;
}

// ==============================|| CHART WIDGET - ECOMMERCE INCOME  ||============================== //

export default function EcommerceIncome() {
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
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
              <DollarCircle />
            </Avatar>
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
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <ListItemButton onClick={handleClose}>Today</ListItemButton>
              <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
              <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
            </Menu>
          </Stack>
        </Grid>
        <Grid size={12}>
          <Stack>
            <Typography variant="subtitle1">$30,200.00</Typography>
            <Typography variant="caption">Income</Typography>
          </Stack>
          <EcommerceDataChart />
        </Grid>
      </Grid>
    </MainCard>
  );
}
