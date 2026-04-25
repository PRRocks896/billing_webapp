import { useState, useEffect, MouseEvent } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemButton from '@mui/material/ListItemButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// chart options
const pieChartOptions: ApexOptions = {
  chart: { type: 'donut', background: 'transparent' },
  labels: ['Saving', 'Spend', 'Income'],
  legend: {
    show: true,
    position: 'bottom',
    itemMargin: {
      horizontal: 6,
      vertical: 6
    }
  },
  dataLabels: { enabled: false }
};

// ===========================|| CATEGORY - CHART ||=========================== //

function CategoryChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const {
    state: { fontFamily }
  } = useConfig();

  const textPrimary = theme.vars.palette.text.primary;
  const line = theme.vars.palette.divider;
  const backgroundPaper = theme.vars.palette.background.paper;
  const warningMain = theme.vars.palette.warning.main;
  const primaryMain = theme.vars.palette.primary.main;
  const secondaryMain = theme.vars.palette.secondary.main;
  const successMain = theme.vars.palette.success.main;

  const [series] = useState([90, 180, 90]);
  const [options, setOptions] = useState(pieChartOptions);

  useEffect(() => {
    setOptions({
      ...pieChartOptions,
      chart: { ...pieChartOptions.chart, fontFamily: fontFamily },
      colors: [warningMain, primaryMain, successMain],
      xaxis: { labels: { style: { colors: textPrimary } } },
      yaxis: { labels: { style: { colors: textPrimary } } },
      grid: { borderColor: line },
      stroke: { colors: [backgroundPaper] },
      legend: { ...pieChartOptions.legend, labels: { colors: secondaryMain } },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, textPrimary, line, backgroundPaper, warningMain, primaryMain, successMain, secondaryMain]);

  return <ReactApexChart options={options} series={series} type="donut" height={downSM ? 280 : 330} />;
}

// ===========================|| FINANCE - CATEGORY ||=========================== //

export default function CategoryCard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <MainCard content={false} sx={{ p: 2.5 }}>
      <Stack sx={{ gap: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Category</Typography>
          <IconButton
            color="secondary"
            id="wallet-button"
            aria-controls={open ? 'wallet-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            disableRipple
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
        <CategoryChart />
      </Stack>
    </MainCard>
  );
}
