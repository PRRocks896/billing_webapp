import { Link } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import { APP_DEFAULT_PATH } from 'config';

// assets
import error500 from 'assets/images/maintenance/img-error-500.svg';

// ==============================|| ERROR 500 ||============================== //

export default function Error500() {
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 3 }}>
      <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 325 }}>
          <CardMedia component="img" src={error500} alt="error 500" sx={{ height: 1 }} />
        </Box>
      </Stack>
      <Stack sx={{ width: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Typography align="center" variant={downSM ? 'h2' : 'h1'}>
          Internal Server Error
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', width: { xs: '73%', sm: '70%' }, mt: 1 }}>
          Server error 500. we fixing the problem. please try again at a later stage.
        </Typography>
        <Button component={Link} to={APP_DEFAULT_PATH} variant="contained" sx={{ textTransform: 'none', mt: 4 }}>
          Back To Home
        </Button>
      </Stack>
    </Stack>
  );
}
