import { ReactElement } from 'react';

// third-party
import firebase from 'firebase/compat/app';

// ==============================|| TYPES - AUTH  ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

type AccessModules = {
  id: number,
  roleID: number,
  moduleID: number,
  add: boolean,
  edit: boolean,
  delete: boolean,
  view: boolean,
  px_module: {
    name: string,
    icon: string,
    path: string,
    id: number
  },
  px_role: {
    name: string,
    id: number
  }
}

type AccessSectionModules = {
  id: number;
  roleID: number;
  moduleSectionID: number;
  view: boolean;
  download: boolean;
  upload: boolean;
  px_module_section: {
    id: number;
    moduleID: number;
    name: string;
    key: string;
    px_module: {
      id: number;
      name: string;
      icon: string;
      path: string;
    }
  };
  px_role: {
    id: number;
    name: string;
  };
}

type UserProfile = {
  "id": number,
  "cityID": number,
  "roleID": number,
  "companyID": number,
  "firstName": string,
  "lastName": string,
  "branchName": string,
  "userName": string,
  "email": string,
  "slug": string,
  "isWebDisplay": boolean,
  "phoneNumber": string,
  "phoneNumber2": string,
  "address": string,
  "countryCode": string,
  "billTitle": string,
  "billCode": string,
  "gstNo": string,
  "isShowGst": boolean,
  "areaName": string | null,
  "description": string | null,
  "mapUrl": string | null,
  "images": string | null,
  "thumbnilImage": string | null,
  "cardImage": string | null,
  "iconImage": string | null,
  "iFrameMap": string | null,
  "feedbackUrl": string,
  "reviewUrl": string,
  "isWebLogin": boolean,
  "isAppLogin": boolean,
  "roomID": string | null,
  "isPendingDailyReport": boolean,
  "px_role": {
    "name": string
  },
  "px_company": {
    "companyName": string,
    "displayName": string,
    "billCode": string,
    "cashBillCode": string,
    "CGST": string,
    "SGST": string
  },
  "px_city": {
    "id": number,
    "name": string
  }
};

export interface AuthProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null;
  token?: string | null;
  accessModules?: AccessModules[] | [];
  accessSectionModules?: AccessSectionModules[] | [];
  loading?: boolean;
}

export interface AuthActionProps {
  type: string;
  payload?: any;
}

export type FirebaseContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => Promise<void>;
  login: () => void;
  firebaseRegister: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  firebaseEmailPasswordSignIn: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  firebaseGoogleSignIn: () => Promise<firebase.auth.UserCredential>;
  firebaseTwitterSignIn: () => Promise<firebase.auth.UserCredential>;
  firebaseFacebookSignIn: () => Promise<firebase.auth.UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};

export type AWSCognitoContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<unknown>;
  resetPassword: (verificationCode: string, newPassword: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
  codeVerification: (verificationCode: string) => Promise<any>;
  resendConfirmationCode: () => Promise<any>;
};

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
}

export interface JWTDataProps {
  userId: string;
}

export type JWTContextType = {
  loading: boolean;
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  isAdmin: boolean;
  logout: () => void;
  sendOtp: (phone: string) => Promise<any>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  accessRights: (pathName: string) => { add: boolean; edit: boolean; delete: boolean; view: boolean };
  accessSectionRights: (sectionSlug: string) => { view: boolean; download: boolean; upload: boolean };
  startLoading: () => void;
  stopLoading: () => void;
};

export type Auth0ContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => void;
  login: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};
