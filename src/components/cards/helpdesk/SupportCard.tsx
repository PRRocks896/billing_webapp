import { useEffect, useState } from 'react';

// material-ui
import { useTheme, PaletteColor, useColorScheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';

interface Props {
  color: string;
  data: number[];
}

const getResolvedColor = (color: string, theme: any): string => {
  const [paletteKey, shade] = color.split('.');

  // Check if the palette key exists in theme.vars.palette and has the shade
  if (
    paletteKey in theme.vars.palette &&
    theme.vars.palette[paletteKey as keyof typeof theme.vars.palette] &&
    theme.vars.palette[paletteKey as keyof typeof theme.vars.palette][shade as keyof PaletteColor]
  ) {
    return theme.vars.palette[paletteKey as keyof typeof theme.vars.palette][shade as keyof PaletteColor];
  }

  // Fallback to a default color or return the input color if not found in the palette
  return color;
};

const areaChartOptions: ApexOptions = {
  chart: { id: 'new-stack-chart', type: 'area', stacked: true, sparkline: { enabled: true }, background: 'transparent', offsetX: 0 },
  plotOptions: { bar: { borderRadius: 0, barHeight: '100%' } },
  dataLabels: { enabled: false },
  markers: { hover: { size: 5 } },
  stroke: { curve: 'smooth', width: 2 },
  yaxis: { show: false },
  tooltip: { x: { show: false } },
  grid: { show: false }
};

// ==============================|| CHART ||============================== //

function SupportCardChart({ color, data }: Props) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const resolvedColor = getResolvedColor(color, theme);
  const [options, setOptions] = useState(areaChartOptions);
  const backgroundPaper = theme.vars.palette.background.paper;

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      fill: {
        gradient: {
          colorStops: [
            [
              { offset: 0, color: resolvedColor, opacity: 0.5 },
              { offset: 100, color: backgroundPaper, opacity: 0.5 }
            ]
          ]
        }
      },
      yaxis: { ...areaChartOptions.yaxis, min: 0, max: Math.max(...data) * 1.1 },
      colors: [resolvedColor],
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [resolvedColor, colorScheme, backgroundPaper, fontFamily, data]);

  const [series] = useState([{ name: 'Orders', data }]);

  return <ReactApexChart options={options} series={series} type="area" height={100} />;
}

interface SupportCardProps {
  title: string;
  count: number;
  details: string;
  color?: any;
  openValue: number;
  runningValue: number;
  solvedValue: number;
  chartData: number[];
}

// ==============================|| SUPPORT CARD ||============================== //

export default function SupportCard({ title, count, details, color, openValue, runningValue, solvedValue, chartData }: SupportCardProps) {
  const { colorScheme } = useColorScheme();
  const textColor = () => (colorScheme === 'dark' ? 'text.primary' : 'background.paper');

  return (
    <MainCard content={false}>
      <Stack sx={{ px: 3, pt: 3 }}>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          {count}
        </Typography>
        <Typography variant="body1" sx={{ color: color }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: 'secondary.darker', my: 2 }}>
          {details}
        </Typography>
      </Stack>
      <SupportCardChart color={color} data={chartData} />
      <Stack direction="row" sx={{ justifyContent: 'space-around', p: 3, bgcolor: color }}>
        <Stack sx={{ alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: textColor }}>
            {openValue}
          </Typography>
          <Typography variant="body1" sx={{ color: textColor }}>
            Open
          </Typography>
        </Stack>
        <Divider flexItem orientation="vertical" sx={{ bgcolor: textColor }} />
        <Stack sx={{ alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: textColor }}>
            {runningValue}
          </Typography>
          <Typography variant="body1" sx={{ color: textColor }}>
            Running
          </Typography>
        </Stack>
        <Divider flexItem orientation="vertical" sx={{ bgcolor: textColor }} />
        <Stack sx={{ alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: textColor }}>
            {solvedValue}
          </Typography>
          <Typography variant="body1" sx={{ color: textColor }}>
            Solved
          </Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}
