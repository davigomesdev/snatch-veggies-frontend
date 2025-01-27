import { TResponse } from '@/core/types/response.type';

import { api, handleApiError } from '../../axios.service';

import { IUser } from '@/core/interfaces/user.interface';

import { DepositCoinUserDTO } from './dtos/deposit-coin-user.dto';
import { WithdrawCoinUserDTO } from './dtos/withdraw-coin-user.dto';

export const currentUser = async (): Promise<TResponse<IUser>> => {
  return await api()
    .get('users/current')
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const depositCoinUser = async (input: DepositCoinUserDTO): Promise<void> => {
  await api().post('users/deposit', input).catch(handleApiError);
};

export const withdrawCoinUser = async (input: WithdrawCoinUserDTO): Promise<void> => {
  await api().post('users/withdraw', input).catch(handleApiError);
};
