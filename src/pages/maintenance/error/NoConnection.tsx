import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// ==============================|| NO CONNECTION ||============================== //

export default function NoConnection() {
  const downSM = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        bgcolor: 'background.default', 
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'error.lighter',
              mb: 2
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6.5C19.2 4 15.7 2.5 12 2.5C8.3 2.5 4.8 4 2 6.5" stroke="#f5222d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 10.5C16.8 9.2 14.5 8.5 12 8.5C9.5 8.5 7.2 9.2 5.5 10.5" stroke="#f5222d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 14.5C14.2 13.9 13.1 13.5 12 13.5C10.9 13.5 9.8 13.9 9 14.5" stroke="#f5222d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17C11.4477 17 11 17.4477 11 18C11 18.5523 11.4477 19 12 19Z" fill="#f5222d"/>
                <path d="M2.5 2.5L21.5 21.5" stroke="#f5222d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
          </Stack>
          <Stack sx={{ width: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Typography align="center" variant={downSM ? 'h3' : 'h2'} fontWeight={800}>
              Connection Lost
            </Typography>
            <Typography variant="body1" align="center" sx={{ color: 'text.secondary', width: { xs: '85%', sm: '60%', md: '300px' }, mt: 2, mb: 1 }}>
              It seems you're currently offline. Please check your network connection and try again. 
              The application will automatically resume once you're back online.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => window.location.reload()} 
              sx={{ textTransform: 'none', mt: 4, px: 4, py: 1.5, borderRadius: 2 }}
            >
              Try Again
            </Button>
          </Stack>
        </Stack>
    </Box>
  );
}
