import Cookies from 'js-cookie';

import axios, { AxiosError, AxiosInstance } from 'axios';
import { refreshTokens, signout } from './requests/auth/auth.service';

export const api = (): AxiosInstance => {
  const accessToken = Cookies.get('accessToken');
  const landId = Cookies.get('landId');

  const api = getAxios(accessToken, landId);

  api.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      if (error?.response?.status === 401) {
        if (error?.response?.data.message === 'Unauthorized') {
          const refreshToken = Cookies.get('refreshToken');
          const originalConfig: any = error.config;
          if (refreshToken) {
            return await refreshTokens(refreshToken)
              .then((tokens) => {
                const { accessToken } = tokens;

                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalConfig.headers['Authorization'] = `Bearer ${accessToken}`;

                api.defaults.headers.common['land-id'] = landId;
                originalConfig.headers['land-id'] = landId;

                return api(originalConfig);
              })
              .catch((error: any) => {
                signout();
                return Promise.reject(error);
              });
          } else {
            signout();
          }
        }
        signout();
      }
      return Promise.reject(error);
    },
  );

  return api;
};

export const apiData = (token?: string): AxiosInstance => {
  return axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_BASE_URL_DATA,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAxios = (token?: string, landId?: string): AxiosInstance => {
  return axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'land-id': landId,
    },
  });
};

export const handleApiError = (error: AxiosError | any): void => {
  const errorMessage = error.response?.data?.message || 'Erro desconhecido';
  throw new Error(errorMessage);
};
