// action - state management
import { REGISTER, LOGIN, LOGOUT, LOADING } from './actions';

// types
import { AuthProps, AuthActionProps } from 'types/auth';

// initial state
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  accessModules: [],
  loading: false
};

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = initialState, action: AuthActionProps) => {
  switch (action.type) {
    case LOGIN: {
      const { user, accessModules } = action.payload!;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
        accessModules
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null,
        accessModules: []
      };
    }
    case LOADING: {
      const { loading } = action.payload!;
      return {
        ...state,
        loading
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
