// project-imports
import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - BACKDROP ||============================== //

export default function Backdrop() {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          '&:not(.MuiBackdrop-invisible)': {
            backgroundColor: withAlpha('#000', 0.2)
          }
        }
      }
    }
  };
}
