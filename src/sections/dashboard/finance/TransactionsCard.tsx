import { useState, MouseEvent, useEffect } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

interface Props {
  color: string;
  data: number[];
}

interface TransactionProps {
  title: string;
  caption: string;
  color: string;
  data: any;
  amount: string;
}

// ===========================|| TRANSACTIONS - CHART ||=========================== //

// chart options
const areaChartOptions: ApexOptions = {
  chart: { type: 'line', background: 'transparent', sparkline: { enabled: true } },
  dataLabels: { enabled: false },
  markers: { hover: { size: 4 } },
  fill: { type: 'solid', colors: ['transparent'] },
  stroke: { curve: 'straight', width: 2 },
  tooltip: { x: { show: false } },
  grid: { show: true, strokeDashArray: 4 }
};

function TransactionsChart({ color, data }: Props) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const {
    state: { fontFamily }
  } = useConfig();

  const line = theme.vars.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series] = useState([{ name: 'Orders', data }]);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [color],
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' },
      grid: { borderColor: line }
    });
  }, [color, colorScheme, fontFamily, line]);

  return <ReactApexChart options={options} series={series} type="area" height={48} />;
}

// ===========================|| FINANCE - TRANSACTIONS CARD ||=========================== //

export default function TransactionCard({ title, caption, color, data, amount }: TransactionProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard content={false} sx={{ p: 2 }}>
      <Stack sx={{ gap: 2 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="subtitle1">{title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {caption}
            </Typography>
          </div>
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

        <TransactionsChart color={color} data={data} />

        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Stack direction="row" sx={{ gap: 0.25, alignItems: 'center' }}>
            <Typography sx={{ fontSize: 'h6', color: 'text.secondary' }}>$</Typography>
            <Typography variant="h4">{amount}</Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Compare to last week
          </Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}
