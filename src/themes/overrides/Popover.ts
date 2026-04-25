// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - POPOVER ||============================== //

export default function Popover(theme: Theme) {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: theme.vars.customShadows.z1
        }
      }
    }
  };
}
