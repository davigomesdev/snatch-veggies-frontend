import { TResponse } from '@/core/types/response.type';

import { api, handleApiError } from '../../axios.service';

import { IBlock } from '@/core/interfaces/block.interface';
import { IBlockInventory } from '@/core/interfaces/block-inventory.interface';

import { ListBlocksDTO } from './dtos/list-blocks.dto';
import { ListBlockInventoriesDTO } from './dtos/list-block-inventories.dto';
import { FindBlockDTO } from './dtos/find-block.dto';
import { FindBlockInventoryDTO } from './dtos/find-block-inventory.dto';
import { CreateBlockInventoryDTO } from './dtos/create-block-inventory.dto';

export const listBlocks = async (input?: ListBlocksDTO): Promise<TResponse<IBlock[]>> => {
  return await api()
    .get('blocks', { params: input })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const listBlockInventories = async (
  input?: ListBlockInventoriesDTO,
): Promise<TResponse<IBlockInventory[]>> => {
  return await api()
    .get('blocks/inventories', { params: input })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const findBlock = async (input: FindBlockDTO): Promise<TResponse<IBlock>> => {
  const { id, ...rest } = input;

  return await api()
    .get(`blocks/${id}`, { params: rest })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const findBlockInventory = async (
  input: FindBlockInventoryDTO,
): Promise<TResponse<IBlockInventory>> => {
  const { blockId, ...rest } = input;

  return await api()
    .get(`blocks/inventories/${blockId}`, { params: rest })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const createBlockInventory = async (
  input: CreateBlockInventoryDTO,
): Promise<TResponse<IBlockInventory>> => {
  return await api()
    .post('blocks/inventories', input)
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};
