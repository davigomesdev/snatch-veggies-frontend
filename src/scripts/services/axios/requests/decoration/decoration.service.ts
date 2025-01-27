import { TResponse } from '@/core/types/response.type';

import { api, handleApiError } from '../../axios.service';

import { IDecoration } from '@/core/interfaces/decoration.interface';
import { IDecorationInventory } from '@/core/interfaces/decoration-inventory.interface';

import { ListDecorationsDTO } from './dtos/list-decorations.dto';
import { ListDecorationInventoriesDTO } from './dtos/list-decoration-inventories.dto';
import { FindDecorationDTO } from './dtos/find-decoration.dto';
import { FindDecorationInventoryDTO } from './dtos/find-decoration-inventory.dto';
import { CreateDecorationInventoryDTO } from './dtos/create-decoration-inventory.dto';

export const listDecorations = async (
  input?: ListDecorationsDTO,
): Promise<TResponse<IDecoration[]>> => {
  return await api()
    .get('decorations', { params: input })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const listDecorationInventories = async (
  input?: ListDecorationInventoriesDTO,
): Promise<TResponse<IDecorationInventory[]>> => {
  return await api()
    .get('decorations/inventories', { params: input })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const findDecoration = async (input: FindDecorationDTO): Promise<TResponse<IDecoration>> => {
  const { id, ...rest } = input;

  return await api()
    .get(`decorations/${id}`, { params: rest })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const findDecorationInventory = async (
  input: FindDecorationInventoryDTO,
): Promise<TResponse<IDecorationInventory>> => {
  const { decorationId, ...rest } = input;

  return await api()
    .get(`decorations/inventories/${decorationId}`, { params: rest })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const createDecorationInventory = async (
  input: CreateDecorationInventoryDTO,
): Promise<void> => {
  return await api()
    .post('decorations/inventories', input)
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};
