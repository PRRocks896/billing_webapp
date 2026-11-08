// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - CARD CONTENT ||============================== //

export default function CardContent(theme: Theme) {
  return {
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24
          },
          // phones: tighter padding so content gets the width
          [theme.breakpoints.down('sm')]: {
            padding: 16,
            '&:last-child': {
              paddingBottom: 16
            }
          }
        }
      }
    }
  };
}
