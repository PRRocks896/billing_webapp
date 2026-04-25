import { useState, useEffect } from 'react';

// material-ui
import { useColorScheme } from '@mui/material/styles';
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

interface Props {
  color: string;
}

// ==============================|| CHART ||============================== //

// chart options
const areaChartOptions: ApexOptions = {
  chart: { id: 'ecommerce-radial', type: 'radialBar', background: 'transparent' },
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 0,
        size: '60%',
        background: 'transparent',
        imageOffsetX: 0,
        imageOffsetY: 0,
        position: 'front'
      },
      track: { strokeWidth: '50%' },
      dataLabels: {
        show: true,
        name: { show: false },
        value: { offsetY: 7, fontSize: '20px', fontWeight: '700', show: true }
      }
    }
  }
};

function EcommerceDataChart({ color }: Props) {
  const { colorScheme } = useColorScheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const [options, setOptions] = useState(areaChartOptions);
  const [series] = useState([30]);

  useEffect(() => {
    setOptions({
      ...areaChartOptions,
      chart: { ...areaChartOptions.chart, fontFamily: fontFamily },
      colors: [color],
      plotOptions: {
        ...areaChartOptions.plotOptions,
        radialBar: {
          ...areaChartOptions.plotOptions?.radialBar,
          track: { ...areaChartOptions.plotOptions?.radialBar?.track, background: withAlpha(color, 0.5) },
          dataLabels: { ...areaChartOptions.plotOptions?.radialBar?.dataLabels, value: { color: color } }
        }
      },
      theme: { mode: colorScheme === ThemeMode.DARK ? 'dark' : 'light' }
    });
  }, [colorScheme, fontFamily, color]);

  return <ReactApexChart options={options} series={series} type="radialBar" height={140} />;
}

// ==============================|| CHART WIDGET - ECOMMERCE RADIAL  ||============================== //

export default function EcommerceRadial({ color }: { color: string }) {
  return (
    <MainCard content={false} sx={{ height: '100%' }}>
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center', height: 1, px: 2 }}>
        <Box sx={{ width: 135 }}>
          <EcommerceDataChart color={color} />
        </Box>
        <Stack>
          <Typography>Total Earning</Typography>
          <Typography variant="subtitle1">$45,890</Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}
