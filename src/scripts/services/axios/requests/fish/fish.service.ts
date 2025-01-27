import { TResponse } from '@/core/types/response.type';

import { api, handleApiError } from '../../axios.service';

import { IFish } from '@/core/interfaces/fish.interface';
import { IFishInventory } from '@/core/interfaces/fish-inventory.interface';

import { SaleFishInventoryDTO } from './dtos/sale-fish-inventory.dto';
import { ListFishInventoriesDTO } from './dtos/list-fishe-inventories.dto';

export const listFishes = async (): Promise<TResponse<IFish[]>> => {
  return await api()
    .get('fishes')
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const listFishInventories = async (
  input?: ListFishInventoriesDTO,
): Promise<TResponse<IFishInventory[]>> => {
  return await api()
    .get('fishes/inventories', { params: input })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const createFishInventory = async (): Promise<TResponse<IFish>> => {
  return await api()
    .post('fishes/inventories')
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const saleFishInventory = async (input: SaleFishInventoryDTO): Promise<TResponse<IFish>> => {
  const { id, ...rest } = input;

  return await api()
    .post(`fishes/inventories/sale/${id}`, rest)
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};
