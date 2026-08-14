import { openSnackbar } from 'api/snackbar';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { removeStorageToken } from './helper';

export const getBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname.includes('localhost')) {
    return import.meta.env.VITE_APP_API_URL;
  } else if (hostname.includes('dev')) {
    return import.meta.env.VITE_APP_API_DEV;
  } else {
    return import.meta.env.VITE_APP_API_PROD;
  }
};

const axiosServices = axios.create({ baseURL: getBaseUrl() || 'http://localhost:3010/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = accessToken;
    }
    config.headers['x-api-key'] = import.meta.env.VITE_APP_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.responseType === 'blob') {
      return response;
    }
    return response.data;
  },
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/login')) {
      // redirectWithBasePath('/maintenance/500');
      redirectWithBasePath('/');
      removeStorageToken();
    }
    if (error.response.status === 404) {
      // openSnackbar({
      //   open: true,
      //   message: error.response.statusText || error.response.data.message || 'Not Found',
      //   variant: 'alert',
      //   severity: 'error',
      //   alert: {
      //     color: 'error'
      //   }
      // });
      if (error.config.responseType === 'blob') {
        return error.response;
      }
      return error.response.data;
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

// ==============================|| DYNAMIC API METHODS ||============================== //

export const get = async (url: string, params: any = {}, config: AxiosRequestConfig = {}) => {
  return await axiosServices.get(url, { ...config, params });
};

export const post = async (url: string, data: any = {}, config: AxiosRequestConfig = {}) => {
  return await axiosServices.post(url, data, config);
};

export const put = async (url: string, data: any = {}, config: AxiosRequestConfig = {}) => {
  return await axiosServices.put(url, data, config);
};

export const del = async (url: string, config: AxiosRequestConfig = {}) => {
  return await axiosServices.delete(url, config);
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

export const getpdf = async (url: string, data: any = {}, fileName: string = 'document.pdf', download: boolean = true, config: AxiosRequestConfig = {}) => {
  const response: any = await axiosServices.post(url, data, { ...config, responseType: 'blob' });
  if (response.status === 200) {
    if (download) {
      downloadBlob(response.data, fileName);
    } else {
      return response;
    }
  } else {
    openSnackbar({
      open: true,
      message: response.statusText || 'Failed to generate PDF',
      variant: 'alert',
      severity: 'error',
      alert: {
        color: 'error'
      }
    });
  }
  return response;
};

export const getxlsx = async (url: string, data: any = {}, fileName: string = 'document.xlsx', download: boolean = true, config: AxiosRequestConfig = {}) => {
  const response: any = await axiosServices.post(url, data, { ...config, responseType: 'blob' });
  if (response.status === 200) {
    if (download) {
      downloadBlob(response.data, fileName);
    }
  } else {
    openSnackbar({
      open: true,
      message: response.statusText || 'Failed to generate Excel report',
      variant: 'alert',
      severity: 'error',
      alert: {
        color: 'error'
      }
    });
  }
  return response;
};

// Deprecated fetchers maintained for backward compatibility if needed, 
// or remove if unused. For now keeping them as wrappers or removing them 
// if the user intended a full replacement. The prompt asked to "create" these new ones.
// I will keep existing fetcher exports but mark them as wrappers around the new ones for consistency
// or just leave them below if they are heavily used. 
// However, the existing 'fetcher' and 'fetcherPost' were specific SWR-like wrappers.
// I will leave existing fetchers to avoid breaking changes, but append the new methods.

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.get(url, { ...config });
  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.post(url, { ...config });
  return res.data;
};

export function redirectWithBasePath(path: string) {
  window.location.pathname = path;
}
