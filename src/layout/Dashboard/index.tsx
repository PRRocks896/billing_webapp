import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project-imports
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import HorizontalBar from './Drawer/HorizontalBar';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Loader from 'components/Loader';
import AddCustomer from 'sections/apps/customer/AddCustomer';
import LastDailyReportPending from 'pages/maintenance/error/LastDailyReportPending';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { DRAWER_WIDTH, MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import AuthGuard from 'utils/route-guard/AuthGuard';
import { useBuyNowLink } from 'hooks/buyNowLink';

// assets
import { ShoppingCart } from 'iconsax-reactjs';
import useAuth from 'hooks/useAuth';
import UseManager from 'hooks/useManager';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const { loading, user, isAdmin } = useAuth();
  const location = useLocation();
  const downXL = useMediaQuery((theme: any) => theme.breakpoints.down('xl'));
  const downLG = useMediaQuery((theme: any) => theme.breakpoints.down('lg'));

  const { buyNowLink } = useBuyNowLink();

  const {
    state: { container, menuOrientation }
  } = useConfig();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // set media wise responsive drawer
  useEffect(() => {
    if (menuOrientation !== MenuOrientation.MINI_VERTICAL) {
      handlerDrawerOpen(!downXL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  UseManager({ user, isAdmin });

  if (menuMasterLoading) return <Loader />;

  let isPendingDailyReport = false;
  let isAddingDailyReport = false;
  if (!isAdmin) {
    isPendingDailyReport = user?.isPendingDailyReport === true;
    isAddingDailyReport = location.pathname.includes('/daily-report');
  }

  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', width: '100%' }}>
        {loading && <Loader />}
        <Header />
        {!isHorizontal ? <Drawer /> : <HorizontalBar />}

        <Box component="main" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, flexGrow: 1, p: { xs: 1, sm: 3 } }}>
          <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit', mb: isHorizontal ? 2 : 'inherit' }} />
          <Container
            maxWidth={container && !downXL ? 'xl' : false}
            sx={{
              ...(container && !downXL && { px: { xs: 0, sm: 3 } }),
              position: 'relative',
              minHeight: 'calc(100vh - 124px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Breadcrumbs />
            {isPendingDailyReport && !isAddingDailyReport ? (
              <LastDailyReportPending />
            ) : (
              <Outlet />
            )}
            {/* <Footer /> */}
          </Container>
          {/* <Link style={{ textDecoration: 'none' }} href={buyNowLink} target="_blank">
            <Button
              variant="contained"
              color="error"
              startIcon={<ShoppingCart />}
              sx={{ zIndex: 1199, position: 'fixed', bottom: 50, right: 30 }}
            >
              Buy Now
            </Button>
          </Link> */}
        </Box>
        <AddCustomer />
      </Box>
    </AuthGuard>
  );
}
