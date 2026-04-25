import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Warning2 } from 'iconsax-reactjs';

// ==============================|| LAST DAILY REPORT PENDING ||============================== //

export default function LastDailyReportPending() {
  const navigate = useNavigate();
  const downSM = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
      <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ 
          width: 120, 
          height: 120, 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'warning.lighter',
          mb: 2
        }}>
          <Warning2 size={64} color="#faad14" variant="Bulk" />
        </Box>
      </Stack>
      <Stack sx={{ width: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Typography align="center" variant={downSM ? 'h4' : 'h3'} fontWeight={800}>
          Daily Report is Pending
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: 'text.secondary', width: { xs: '90%', sm: '70%', md: '50%' }, mt: 2, mb: 1 }}>
          You have not submitted your daily report for the previous day. Please add your pending daily report first to unlock access to the system.
        </Typography>
        <Button 
          variant="contained" 
          color="warning"
          onClick={() => { navigate('/daily-report/add') }}
          sx={{ textTransform: 'none', mt: 4, px: 4, py: 1.5, borderRadius: 2 }}
        >
          Go To Daily Report Page
        </Button>
      </Stack>
    </Stack>
  );
}
