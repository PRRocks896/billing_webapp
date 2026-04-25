// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import UserCard from './UserCard';

interface Props {
  title: string;
}

// ==============================|| SKELETON - EMPTY STATE ||============================== //

export default function EmptyUserCard({ title }: Props) {
  return (
    <Box sx={{ p: { xs: 2.5, sm: 6 }, height: `calc(100vh - 192px)`, bgcolor: 'transparent' }}>
      <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ ml: -9, mb: { xs: -8, sm: -5 } }}>
          <Box sx={{ position: 'relative' }}>
            <UserCard />
          </Box>
          <Box sx={{ position: 'relative', top: -120, left: 72 }}>
            <UserCard />
          </Box>
        </Box>
        <Stack sx={{ gap: 1 }}>
          <Typography align="center" variant="h4">
            {title}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
