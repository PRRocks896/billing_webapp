// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ==============================|| HOOKS - RESPONSIVE DIALOG ||============================== //

/**
 * Props for dialogs that contain forms: full-screen on phones (below `sm`), unchanged elsewhere.
 * Not for small confirm dialogs (e.g. `CustomDailogBox`), which should stay compact.
 *
 * Usage: `<Dialog {...useResponsiveDialog()} open={open} onClose={onClose} maxWidth="sm">`
 */
export default function useResponsiveDialog() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return { fullScreen };
}
