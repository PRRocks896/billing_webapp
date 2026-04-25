import { Fragment, useLayoutEffect, useState } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Refresh, Logout } from 'iconsax-reactjs';

// project-imports
import NavGroup from './NavGroup';
import NavItem from './NavItem';
import { useGetMenu, useGetMenuMaster } from 'api/menu';
import { MenuOrientation, HORIZONTAL_MAX_ITEM } from 'config';
import useConfig from 'hooks/useConfig';
import menuItem from 'menu-items';
// import { MenuFromAPI } from 'menu-items/dashboard';
import useAuth from 'hooks/useAuth';

// types
import { NavItemType } from 'types/menu';

// function isFound(arr: any, str: string) {
//   return arr.items.some((element: any) => {
//     if (element.id === str) {
//       return true;
//     }
//     return false;
//   });
// }

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const {
    state: { menuOrientation }
  } = useConfig();
  const { menuLoading } = useGetMenu();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedID, setSelectedID] = useState<string | undefined>('');
  const [selectedItems, setSelectedItems] = useState<string | undefined>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<{ items: NavItemType[] }>({ items: [] });

  // let dashboardMenu = MenuFromAPI();
  useLayoutEffect(() => {
    // if (menuLoading && !isFound(menuItem, 'group-dashboard-loading')) {
    //   menuItem.items.splice(0, 0, dashboardMenu);
    //   setMenuItems({ items: [...menuItem.items] });
    // } else if (!menuLoading && dashboardMenu?.id !== undefined && !isFound(menuItem, 'group-dashboard')) {
    //   menuItem.items.splice(0, 1, dashboardMenu);
    setMenuItems({ items: [...menuItem.items] });
    // } else {
    //   setMenuItems({ items: [...menuItem.items] });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuLoading]);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems: NavItemType[] = [];
  let lastItemId: string;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id!;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <Fragment key={item.id}>
              {menuOrientation !== MenuOrientation.HORIZONTAL && <Divider sx={{ my: 0.5 }} />}
              <NavItem item={item} level={1} isParents setSelectedID={setSelectedID} />
            </Fragment>
          );
        }
        return (
          <NavGroup
            key={item.id}
            selectedID={selectedID}
            setSelectedID={setSelectedID}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem!}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block',
        alignItems: 'center'
      }}
    >
      {navGroups}
      <NavItem
        item={{
          id: 'group-hard-refresh',
          title: 'Hard Refresh',
          type: 'item',
          icon: Refresh,
          url: '/hard',
          children: []
        }}
        setSelectedID={setSelectedID}
        isParents={false}
        onClick={() => {
          window.location.reload();
        }}
        level={menuItems.items.length + 1}
      />
      <NavItem
        item={{
          id: 'group-logout',
          title: 'Logout',
          type: 'item',
          icon: Logout,
          url: '/logout',
          children: []
        }}
        setSelectedID={setSelectedID}
        isParents={false}
        onClick={handleLogout}
        level={menuItems.items.length + 1}
      />
    </Box>
  );
}
