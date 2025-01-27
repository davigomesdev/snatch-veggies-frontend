import { TResponse } from '@/core/types/response.type';

import { api, apiData, handleApiError } from '../../axios.service';

import { FindLandDataDTO } from './dtos/find-land-data.dto';

import { ILand } from '@/core/interfaces/land.interface';
import { TBlockSetter } from '@/core/types/block-setter';
import { FindByTokenIdLandDTO } from './dtos/find-by-token-id-land.dto';

export const currentCreate = async (): Promise<void> => {
  await api()
    .post('lands/current')
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const findByTokenIdLand = async (input: FindByTokenIdLandDTO): Promise<TResponse<ILand>> => {
  return await api()
    .get(`lands/${input.tokenId}`)
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const findLandData = async (input: FindLandDataDTO): Promise<TBlockSetter[][]> => {
  return await apiData()
    .get(`${input.tokenId}.json`)
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const currentLand = async (): Promise<TResponse<ILand>> => {
  return await api()
    .get('lands/current')
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const currentLandList = async (): Promise<TResponse<ILand[]>> => {
  return await api()
    .get('lands/current/list')
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const listLands = async (): Promise<TResponse<ILand[]>> => {
  return await api()
    .get('lands')
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};
