import React, { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOADING, LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project-imports
import Loader from 'components/Loader';


// types
import { AuthProps, JWTContextType } from 'types/auth';
import { KeyedObject } from 'types/root';
import { loginViaPhone, verifyOTP, logOut, fetchLoggedInUserData } from 'service/auth';
import MainCard from 'components/MainCard';
import Box from '@mui/material/Box';
import CircularLoader from 'components/CircularLoader';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const chance = new Chance();

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  loading: false
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return true; //decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
  } else {
    localStorage.removeItem('serviceToken');
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const isAdmin: boolean = useMemo(() => {
    if (!state.isLoggedIn) {
      return false;
    }
    if (state.user && state.user.px_role && state.user.px_role.name && ['super admin', 'admin'].includes(state.user.px_role.name.toLowerCase())) {
      return true;
    }
    return false;
  }, [state]);

  const isBranch: boolean = useMemo(() => {
    if (!state.isLoggedIn) {
      return false;
    }
    if (state.user && state.user.px_role && state.user.px_role.name && ['branch'].includes(state.user.px_role.name.toLowerCase())) {
      return true;
    }
    return false;
  }, [state]);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          const response: any = await fetchLoggedInUserData();
          if (response && response.success) {
            const { accessModules, accessSectionModules, ...rest } = response.data;
            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true,
                user: rest,
                accessModules,
                accessSectionModules
              }
            });
          } else {
            dispatch({
              type: LOGOUT
            });
          }
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        // dispatch({
        //   type: LOGOUT
        // });
      }
    };

    init();
  }, []);

  const logout = async () => {
    setSession(null);
    await logOut({ id: state.user?.id });
    dispatch({ type: LOGOUT });
  };

  const sendOtp = async (phoneNumber: string) => {
    return await loginViaPhone({ phoneNumber });

    // if(response && response.)
  };

  const verifyOtp = async (phoneNumber: string, otp: string, isCheckSession = false) => {
    const response: any = await verifyOTP({ phoneNumber, otp, isCheckSession });
    if (response && response.success) {
      const { token, accessModules, ...rest } = response.data;
      setSession(token);
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user: rest,
          accessModules
        }
      });
    }
  };

  const startLoading = useCallback(() => {
    dispatch({
      type: LOADING,
      payload: {
        loading: true
      }
    });
  }, []);

  const stopLoading = useCallback(() => {
    dispatch({
      type: LOADING,
      payload: {
        loading: false
      }
    })
  }, []);

  const accessRights = useCallback((pathName: string): { add: boolean; edit: boolean; delete: boolean; view: boolean } => {
    if (!state.isLoggedIn) {
      return { add: false, edit: false, delete: false, view: false };
    }
    if (isAdmin) {
      return { add: true, edit: true, delete: true, view: true };
    }

    const accessModules = state.accessModules || [];

    // Strip leading/trailing slashes and split into segments.
    const toSegments = (path: string) =>
      path.replace(/^\/|\/$/g, '').split('/').filter(Boolean);

    const requestedSegments = toSegments(pathName);

    /**
     * Match strategy:
     * Module path segments must appear as a complete, contiguous sub-sequence
     * anywhere within the requested path segments.
     *
     * Examples (module path → pathName):
     *   "inquiry"                      → "/inquiry-management/inquiry"        ✅ (found at index 1)
     *   "inquiry"                      → "/inquiry-management/franchise-inquiry" ❌ (no segment == "inquiry")
     *   "/inquiry-management/inquiry"  → "/inquiry-management/inquiry"        ✅ (exact)
     *   "/inquiry-management/inquiry"  → "/inquiry-management/franchise-inquiry" ❌ (contiguous check fails)
     */
    const isMatch = (modulePath: string): boolean => {
      if (!modulePath) return false;

      const moduleSegments = toSegments(modulePath);
      const mLen = moduleSegments.length;
      const rLen = requestedSegments.length;

      if (mLen > rLen) return false;

      // Slide a window of size mLen over requestedSegments
      for (let i = 0; i <= rLen - mLen; i++) {
        if (moduleSegments.every((seg, j) => seg === requestedSegments[i + j])) {
          return true;
        }
      }
      return false;
    };

    // When multiple modules match, prefer the most-specific (longest path) one.
    const matchedModule = accessModules
      .filter((m: any) => isMatch(m?.px_module?.path))
      .sort((a: any, b: any) =>
        (b?.px_module?.path?.length ?? 0) - (a?.px_module?.path?.length ?? 0)
      )[0];

    if (!matchedModule) {
      return { add: false, edit: false, delete: false, view: false };
    }

    return {
      add: matchedModule.add,
      edit: matchedModule.edit,
      delete: matchedModule.delete,
      view: matchedModule.view
    };
  }, [state, isAdmin]);

  const accessSectionRights = useCallback((sectionSlug: string): { view: boolean; download: boolean; upload: boolean } => {
    if (isAdmin) {
      return {
        view: true,
        download: true,
        upload: true
      }
    }
    if (!state.isLoggedIn) {
      return { view: false, download: false, upload: false };
    }
    const accessSectionModules = state.accessSectionModules || [];
    const matchedModule = accessSectionModules
      .filter((m: any) => m?.px_module_section?.key === sectionSlug)
      .sort((a: any, b: any) =>
        (b?.px_module_section?.key?.length ?? 0) - (a?.px_module_section?.key?.length ?? 0)
      )[0];
    if (!matchedModule) {
      return { view: false, download: false, upload: false };
    }
    return {
      view: matchedModule.view,
      download: matchedModule.download,
      upload: matchedModule.upload
    };
  }, [state, isAdmin]);

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  // if (state.loading) {
  //   return (
  //     <Box sx={{ height: 'calc(100vh - 100px)' }}>
  //       <CircularLoader />
  //     </Box>
  //   );
  // }

  return (
    <JWTContext value={{ ...state, isBranch, loading: state.loading!, isAdmin, startLoading, stopLoading, logout, sendOtp, verifyOtp, accessRights, accessSectionRights }}>
      {children}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.snackbar + 1000 }}
        open={!!state.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </JWTContext>
  );
};

export default JWTContext;
