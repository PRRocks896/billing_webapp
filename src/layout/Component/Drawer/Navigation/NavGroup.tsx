import { Activity } from 'react';

// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import NavItem from './NavItem';

// types
import { NavItemType } from 'types/menu';

interface Props {
  item: NavItemType;
}

// ==============================|| NAVIGATION - GROUP ||============================== //

export default function NavGroup({ item }: Props) {
  const navCollapse = item.children?.map((menu) => {
    switch (menu.type) {
      case 'item':
        return <NavItem key={menu.id} item={menu} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        <Activity mode={item.title ? 'visible' : 'hidden'}>
          <Typography variant="h5" sx={{ color: 'text.primary', mb: 1.5 }}>
            <SafeFormattedMessage id={item.title} />
          </Typography>
        </Activity>
      }
      sx={{ mb: 1 }}
    >
      {navCollapse}
    </List>
  );
}
