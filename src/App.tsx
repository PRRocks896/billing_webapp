import { RouterProvider } from 'react-router-dom';

// project-imports
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Customization from 'components/customization';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import Metrics from 'metrics';
import NoConnection from 'pages/maintenance/error/NoConnection';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

import useNoInternet from 'hooks/useNoInternet';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

export default function App() {
  const { isOnline } = useNoInternet();

  return (
    <>
      <ThemeCustomization>
        {/* <RTLLayout> */}
        <Locales>
          <ScrollTop>
            <AuthProvider>
              <>
                <Notistack>
                  <RouterProvider router={router} />
                  <Customization />
                  <Snackbar />
                </Notistack>
                {!isOnline && <NoConnection />}
              </>
            </AuthProvider>
          </ScrollTop>
        </Locales>
        {/* </RTLLayout> */}
      </ThemeCustomization>
      {/* <Metrics /> */}
    </>
  );
}
