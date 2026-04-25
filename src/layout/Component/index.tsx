import { lazy, Suspense } from 'react';

// material-ui
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

// project-imports
import ComponentLayoutPage from './ComponentLayout';
import { handlerComponentDrawer, useGetMenuMaster } from 'api/menu';
import Loader from 'components/Loader';

const Header = lazy(() => import('components/pages/Header'));
const FooterBlock = lazy(() => import('components/pages/FooterBlock'));

// ==============================|| MINIMAL LAYOUT ||============================== //

export default function ComponentLayout() {
  const { menuMasterLoading, menuMaster } = useGetMenuMaster();
  if (menuMasterLoading) return <Loader />;

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2.5 } }}>
          <Header
            variant="component"
            enableComponentDrawer={true}
            onComponentDrawerToggle={handlerComponentDrawer}
            isComponentDrawerOpened={menuMaster.isComponentDrawerOpened}
          />
          <Toolbar sx={{ mt: 2 }} />
          <ComponentLayoutPage />
        </Container>
        {/* <FooterBlock /> */}
      </Suspense>
    </>
  );
}
