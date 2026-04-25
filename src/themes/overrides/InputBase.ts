// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - INPUT BASE ||============================== //

export default function InputBase(theme: Theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        sizeSmall: {
          fontSize: '0.75rem'
        },
        input: {
          '&.Mui-disabled': {
            WebkitTextFillColor: theme.vars.palette.text.primary,
            opacity: 0.5
          }
        }
      }
    }
  };
}
