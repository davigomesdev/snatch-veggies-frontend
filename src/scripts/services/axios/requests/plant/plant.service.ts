import { TResponse } from '@/core/types/response.type';

import { api, handleApiError } from '../../axios.service';

import { IPlant } from '@/core/interfaces/plant.interface';
import { IPlantInventory } from '@/core/interfaces/plant-inventory.interface';

import { ListPlantsDTO } from './dtos/list-plants.dto';
import { ListPlantInventoriesDTO } from './dtos/list-plant-inventories.dto';
import { FindPlantDTO } from './dtos/find-plant.dto';
import { FindPlantInventoryDTO } from './dtos/find-plant-inventory.dto';
import { CreatePlantInventoryDTO } from './dtos/create-plant-inventory.dto';
import { SalePlantInventoryDTO } from './dtos/sale-plant-inventory.dto';

export const listPlants = async (input?: ListPlantsDTO): Promise<TResponse<IPlant[]>> => {
  return await api()
    .get('plants', { params: input })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const listPlantInventories = async (
  input?: ListPlantInventoriesDTO,
): Promise<TResponse<IPlantInventory[]>> => {
  return await api()
    .get('plants/inventories', { params: input })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const findPlant = async (input: FindPlantDTO): Promise<TResponse<IPlant>> => {
  const { id, ...rest } = input;

  return await api()
    .get(`plants/${id}`, { params: rest })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const findPlantInventory = async (
  input: FindPlantInventoryDTO,
): Promise<TResponse<IPlantInventory>> => {
  const { plantId, ...rest } = input;

  return await api()
    .get(`plants/inventories/${plantId}`, { params: rest })
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const createPlantInventory = async (
  input: CreatePlantInventoryDTO,
): Promise<TResponse<IPlantInventory>> => {
  return await api()
    .post('plants/inventories', input)
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};

export const salePlantInventory = async (
  input: SalePlantInventoryDTO,
): Promise<TResponse<IPlantInventory>> => {
  const { id, ...rest } = input;

  return await api()
    .post(`plants/inventories/sale/${id}`, rest)
    .then((res) => {
      return res.data;
    })
    .catch(handleApiError);
};
