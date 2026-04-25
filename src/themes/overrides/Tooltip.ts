// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TOOLTIP ||============================== //

export default function Tooltip(theme: Theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.vars.palette.secondary.darker,
          color: theme.vars.palette.background.paper
        }
      }
    }
  };
}
