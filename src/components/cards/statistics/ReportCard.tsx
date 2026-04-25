// material-ui
import { useTheme, alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import MainCard from 'components/MainCard';

// types
import { GenericCardProps } from 'types/root';

interface ReportCardProps extends GenericCardProps {
  variant?: 'default' | 'modern';
}

// ==============================|| STATISTICS - REPORT CARD ||============================== //

export default function ReportCard({ primary, secondary, iconPrimary, color, variant = 'default' }: ReportCardProps) {
  const theme = useTheme();
  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary size={variant === 'modern' ? 32 : 44} /> : null;

  if (variant === 'modern') {
    return (
      <MainCard
        sx={{
          overflow: 'hidden',
          position: 'relative',
          height: '100%',
          background: alpha(color || theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(color || theme.palette.primary.main, 0.1)}`,
          backdropFilter: 'blur(10px)',
          '&:before': {
            content: '""',
            position: 'absolute',
            width: 150,
            height: 150,
            background: `linear-gradient(140deg, ${alpha(color || theme.palette.primary.main, 0.15)} 0%, transparent 50%)`,
            borderRadius: '50%',
            top: -75,
            right: -75
          }
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${color || theme.palette.primary.main} 0%, ${alpha(color || theme.palette.primary.main, 0.7)} 100%)`,
                color: '#fff',
                boxShadow: `0 4px 12px 0 ${alpha(color || theme.palette.primary.main, 0.3)}`
              }}
            >
              {primaryIcon}
            </Box>
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {primary}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500, opacity: 0.8 }}>
              {secondary}
            </Typography>
          </Stack>
        </Stack>
      </MainCard>
    );
  }

  return (
    <MainCard>
      <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid>
          <Stack sx={{ gap: 0.25 }}>
            <Typography variant="h3">{primary}</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {secondary}
            </Typography>
          </Stack>
        </Grid>
        <Grid sx={{ color: color || 'primary.main' }}>{primaryIcon}</Grid>
      </Grid>
    </MainCard>
  );
}
