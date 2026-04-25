import React from 'react';

// material-ui
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { Add } from 'iconsax-reactjs';

interface FilterChipProps {
  label: React.ReactNode;
  onRemove?: () => void;
  sx?: any;
}

export default function FilterChip({ label, onRemove, sx }: FilterChipProps) {
  const chipSize = useMediaQuery((theme: any) => theme.breakpoints.down('lg')) ? 'small' : undefined;

  return (
    <Stack direction="row" sx={{ alignItems: 'center' }}>
      <Chip
        size={chipSize}
        label={label}
        sx={{ borderRadius: '4px', ...sx }}
        slotProps={{ root: { sx: { color: 'secondary.main', bgcolor: 'transparent', textTransform: 'capitalize' } } }}
      />
      {onRemove && (
        <IconButton
          color="secondary"
          size="small"
          disableRipple
          sx={{ '&:hover': { bgcolor: 'transparent', color: 'error.main' }, ml: -1.5, '&::after': { content: 'none' } }}
          onClick={onRemove}
        >
          <Add style={{ transform: 'rotate(45deg)' }} />
        </IconButton>
      )}
    </Stack>
  );
}
