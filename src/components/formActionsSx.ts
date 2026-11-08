import { SxProps } from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';

/**
 * `sx` for the Cancel / Save footer of add-edit forms.
 * >= 600px: unchanged footer. Phones: the bar sticks to the bottom of the screen (above the home indicator), is opaque, and the
 * two buttons share the width, so Save is always reachable without scrolling a long form.
 */
export const formActionsSx = (theme: Theme): SxProps<Theme> => ({
    p: 3,
    bgcolor: { xs: 'background.paper', sm: alpha(theme.palette.secondary.main, 0.02) },
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2,
    borderRadius: '0 0 16px 16px',
    position: { xs: 'sticky', sm: 'static' },
    bottom: 0,
    zIndex: 10,
    pb: { xs: 'calc(16px + env(safe-area-inset-bottom))', sm: 3 },
    pt: { xs: 2, sm: 3 },
    px: { xs: 2, sm: 3 },
    // phones only: Cancel / Save share the width (scoped to < 600px so desktop button sizes are untouched)
    [theme.breakpoints.down('sm')]: { '& > button': { flex: 1, minWidth: 0 } }
});
