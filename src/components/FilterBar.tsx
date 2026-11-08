import { ReactNode, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// assets
import { ArrowDown2, ArrowUp2, Filter } from 'iconsax-reactjs';

// ==============================|| FILTER BAR ||============================== //

interface FilterBarProps {
  children: ReactNode;
  /** Number of filters currently applied; shown on the phone toggle button. */
  activeCount?: number;
  title?: string;
  /** Start expanded on phones. Default false. */
  defaultOpen?: boolean;
}

/**
 * Wraps a page's filter controls. At 600px and above it renders the children unchanged; on phones the filters collapse
 * behind a full-width "Filters" button so the list stays visible.
 */
export default function FilterBar({ children, activeCount = 0, title = 'Filters', defaultOpen = false }: FilterBarProps) {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(defaultOpen);

  if (!isPhone) return <>{children}</>;

  return (
    <Box sx={{ mb: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        startIcon={<Filter size={18} />}
        endIcon={open ? <ArrowUp2 size={16} /> : <ArrowDown2 size={16} />}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        sx={{ justifyContent: 'space-between' }}
      >
        {activeCount > 0 ? `${title} (${activeCount})` : title}
      </Button>
      <Collapse in={open} unmountOnExit={false}>
        <Box sx={{ pt: 2 }}>{children}</Box>
      </Collapse>
    </Box>
  );
}
