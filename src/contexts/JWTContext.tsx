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

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          const response: any = await fetchLoggedInUserData();
          if (response && response.success) {
            const { accessModules, ...rest } = response.data;
            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true,
                user: rest,
                accessModules
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

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    const response: any = await verifyOTP({ phoneNumber, otp });
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
    const module = accessModules.find((module: any) => module?.px_module?.path === pathName || (pathName.includes(module?.px_module?.path)));
    if (!module) {
      return { add: false, edit: false, delete: false, view: false };
    }
    return { add: module.add, edit: module.edit, delete: module.delete, view: module.view };
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
    <JWTContext value={{ ...state, loading: state.loading!, isAdmin, startLoading, stopLoading, logout, sendOtp, verifyOtp, accessRights }}>
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
