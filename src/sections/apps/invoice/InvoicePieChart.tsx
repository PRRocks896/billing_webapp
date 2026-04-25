import { useState, useEffect } from 'react';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import Dot from 'components/@extended/Dot';
import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// chart options
const areaChartOptions: ApexOptions = {
  chart: { width: 350, type: 'donut', stacked: false, zoom: { enabled: false }, background: 'transparent' },
  stroke: { width: 0 },
  labels: ['Pending', 'Paid', 'Overdue', 'Draft'],
  dataLabels: { enabled: false },
  responsive: [{ breakpoint: 480, options: { chart: { width: 200 } } }],
  legend: { show: false },
  tooltip: {
    custom: function ({ series, seriesIndex, w }: any) {
      return `<div class="pie_box">
          <span class="PieDot" style='background-color:${w.globals.colors[seriesIndex]}'></span>
          <span class="fontsize">${w.globals.labels[seriesIndex]}${' '}
          <span class="fontsizeValue">${series[seriesIndex]}%</span></span></div>`;
    }
  }
};

// ==============================|| INVOICE - PIE CHART ||============================== //

export default function InvoicePieChart() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const warningMain = theme.vars.palette.warning.main;
  const successMain = theme.vars.palette.success.main;
  const errorMain = theme.vars.palette.error.main;
  const primaryMain = theme.vars.palette.primary.main;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [warningMain, successMain, errorMain, primaryMain],
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, warningMain, successMain, errorMain, primaryMain]);

  const [series, setSeries] = useState<ApexAxisChartSeries | ApexNonAxisChartSeries | undefined>([44, 55, 41, 17]);

  useEffect(() => {
    setSeries([30, 28, 22, 20]);
  }, []);

  //sx style
  const DotSize = { display: 'flex', alignItems: 'center', gap: 1 };
  const ExpenseSize = { fontSize: '0.875rem', lineHeight: '1.5rem', fontWeight: 500 };

  return (
    <MainCard
      title="Total Expenses"
      secondary={
        <IconButton edge="end" aria-label="comments" color="secondary" sx={{ transform: 'rotate(90deg)' }}>
          <MoreIcon />
        </IconButton>
      }
      sx={{
        '.pie_box': { padding: 2, display: 'flex', gap: 1, alignItems: 'center', width: '100%' },
        '.PieDot': { width: 12, height: 12, borderRadius: '50%' },
        '.fontsize': { fontWeight: 500, fontSize: '0.875rem', lineHeight: '1.375rem', color: 'secondary.main' },
        '.fontsizeValue': { color: 'secondary.dark' }
      }}
    >
      <Grid container spacing={1} sx={{ alignItems: 'center' }}>
        <Grid sx={{ '& .apexcharts-canvas': { margin: '0 auto' } }} size={12}>
          <ReactApexChart options={options} series={series} type="donut" height={downMD ? '100%' : 265} />
        </Grid>
        <Grid size={12}>
          <Grid container>
            <Grid></Grid>
            <Grid sx={DotSize} size="grow">
              <Dot color="warning" size={12} />
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Pending
              </Typography>
            </Grid>
            <Grid sx={ExpenseSize}>$3,202</Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container>
            <Grid></Grid>
            <Grid sx={DotSize} size="grow">
              <Dot color="success" size={12} />
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Paid
              </Typography>
            </Grid>
            <Grid sx={ExpenseSize}>$45,050</Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container>
            <Grid></Grid>
            <Grid sx={DotSize} size="grow">
              <Dot color="error" size={12} />
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Overdue
              </Typography>
            </Grid>
            <Grid sx={ExpenseSize}>$25,000</Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container>
            <Grid></Grid>
            <Grid sx={DotSize} size="grow">
              <Dot sx={{ bgcolor: 'primary.main' }} size={12} />
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Draft
              </Typography>
            </Grid>
            <Grid sx={ExpenseSize}>$7,694</Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
}
