import { ITokens } from '@/core/interfaces/tokens.interface';
import { TResponse } from '@/core/types/response.type';

import Cookies from 'js-cookie';
import { api, handleApiError } from '../../axios.service';

import { SignInDTO } from './dtos/signin.dto';
import { RequestNonceDTO } from './dtos/request-nonce.dto';

export const signin = async (input: SignInDTO): Promise<ITokens> => {
  return await api()
    .post('auth/signin', input)
    .then(async (res) => {
      const { accessToken, refreshToken, expiresIn } = res.data;

      Cookies.set('accessToken', accessToken, {
        path: '/',
        expires: expiresIn / (60 * 60 * 24),
      });

      Cookies.set('refreshToken', refreshToken, {
        path: '/',
        expires: expiresIn / (60 * 60 * 24),
      });

      return res.data;
    })
    .catch(handleApiError);
};

export const requestNonce = async (
  input: RequestNonceDTO,
): Promise<TResponse<{ nonce: string }>> => {
  return await api()
    .post('auth/request-nonce', input)
    .then(async (res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const refreshTokens = async (refreshToken: string): Promise<ITokens> => {
  return await api()
    .post('auth/refresh', { refreshToken })
    .then(async (res) => {
      const { accessToken, refreshToken, expiresIn } = res.data;

      Cookies.set('accessToken', accessToken, {
        path: '/',
        expires: expiresIn / (60 * 60 * 24),
      });

      Cookies.set('refreshToken', refreshToken, {
        path: '/',
        expires: expiresIn / (60 * 60 * 24),
      });

      return res.data;
    })
    .catch(handleApiError);
};

export const signout = (): void => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};
