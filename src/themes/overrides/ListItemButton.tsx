// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - LIST ITEM BUTTON ||============================== //

export default function ListItemButton(theme: Theme) {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: theme.vars.palette.secondary.main,
          borderRadius: 8,
          marginTop: 2,
          marginBottom: 2,
          '@media (pointer: coarse)': { minHeight: 44 }, // touch target
          '&.Mui-selected': {
            color: theme.vars.palette.primary.main,
            '& .MuiListItemIcon-root': {
              color: theme.vars.palette.primary.main
            }
          }
        }
      }
    }
  };
}
