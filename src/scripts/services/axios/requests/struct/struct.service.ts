import { TResponse } from '@/core/types/response.type';

import { api, handleApiError } from '../../axios.service';

import { IStruct } from '@/core/interfaces/struct.interface';
import { IStructInventory } from '@/core/interfaces/struct-inventory.interface';

import { ListStructsDTO } from './dtos/list-structs.dto';
import { ListStructInventoriesDTO } from './dtos/list-struct-inventories.dto';
import { FindStructDTO } from './dtos/find-struct.dto';
import { FindStructInventoryDTO } from './dtos/find-struct-inventory.dto';
import { CreateStructInventoryDTO } from './dtos/create-struct-inventory.dto';
import { SaleStructInventoryDTO } from './dtos/sale-struct-inventory.dto';

export const listStructs = async (input?: ListStructsDTO): Promise<TResponse<IStruct[]>> => {
  return await api()
    .get('structs', { params: input })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const listStructInventories = async (
  input?: ListStructInventoriesDTO,
): Promise<TResponse<IStructInventory[]>> => {
  return await api()
    .get('structs/inventories', { params: input })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const findStruct = async (input: FindStructDTO): Promise<TResponse<IStruct>> => {
  const { id, ...rest } = input;

  return await api()
    .get(`structs/${id}`, { params: rest })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const findStructInventory = async (
  input: FindStructInventoryDTO,
): Promise<TResponse<IStructInventory>> => {
  const { structId, ...rest } = input;

  return await api()
    .get(`structs/inventories/${structId}`, { params: rest })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const createStructInventory = async (
  input: CreateStructInventoryDTO,
): Promise<TResponse<IStructInventory>> => {
  return await api()
    .post('structs/inventories', input)
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const saleStructInventory = async (
  input: SaleStructInventoryDTO,
): Promise<TResponse<IStructInventory>> => {
  const { id, ...rest } = input;

  return await api()
    .post(`structs/inventories/sale/${id}`, rest)
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};
