// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - DIALOG ||============================== //

// MUI derives the `maxWidth` of dialog papers (`sm`, `md`, `lg`) from `theme.breakpoints.values`. The responsive work moved those
// breakpoints (sm 768 -> 600, md 1024 -> 900, lg 1266 -> 1200), so the previous dialog widths are pinned here to keep desktop unchanged.
const LEGACY_PAPER_WIDTH = { Sm: 768, Md: 1024, Lg: 1266 } as const;

export default function Dialog(theme: Theme) {
  const paperWidth = (width: number) => ({
    maxWidth: width,
    '&.MuiDialog-paperScrollBody': {
      [theme.breakpoints.down(width + 64)]: { maxWidth: 'calc(100% - 64px)' }
    }
  });

  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          // phones: smaller outer margin so dialogs use the screen (full-screen dialogs keep their own zero margin)
          [theme.breakpoints.down('sm')]: {
            '&:not(.MuiDialog-paperFullScreen)': {
              margin: 16,
              maxHeight: 'calc(100% - 32px)',
              '&.MuiDialog-paperFullWidth': { width: 'calc(100% - 32px)' }
            }
          }
        },
        paperWidthSm: paperWidth(LEGACY_PAPER_WIDTH.Sm),
        paperWidthMd: paperWidth(LEGACY_PAPER_WIDTH.Md),
        paperWidthLg: paperWidth(LEGACY_PAPER_WIDTH.Lg)
      }
    }
  };
}
