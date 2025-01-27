import { emit } from './socket.config';

import { ClientPacketTypeEnum } from '@/core/enums/packets-type.enum';

import { CreateBlockLandDTO } from './dtos/create-block-land.dto';
import { CreateStructBlockLandDTO } from './dtos/create-struct-block-land.dto';
import { CreateDecorationBlockLandDTO } from './dtos/create-decoration-block-land.dto';
import { CreatePlantBlockLandDTO } from './dtos/create-plant-block-land.dto';
import { MintStructBlockLandDTO } from './dtos/mint-struct-block-land.dto';
import { HarvestPlantBlockLandDTO } from './dtos/harvest-plant-block-land.dto';
import { StealPlantBlockLandDTO } from './dtos/steal-plant-block-land.dto';
import { DeleteStructBlockLandDTO } from './dtos/delete-struct-block-land.dto';
import { DeleteDecorationBlockLandDTO } from './dtos/delete-decoration-block-land.dto';

export const createBlockLand = (input: CreateBlockLandDTO, callback: (data: any) => void): void => {
  emit(ClientPacketTypeEnum.CREATE_BLOCK_LAND, input, callback);
};

export const createStructBlockLand = (
  input: CreateStructBlockLandDTO,
  callback: (data: any) => void,
): void => {
  emit(ClientPacketTypeEnum.CREATE_STRUCT_BLOCK_LAND, input, callback);
};

export const createDecorationBlockLand = (
  input: CreateDecorationBlockLandDTO,
  callback: (data: any) => void,
): void => {
  emit(ClientPacketTypeEnum.CREATE_DECORATION_BLOCK_LAND, input, callback);
};

export const createPlantBlockLand = (
  input: CreatePlantBlockLandDTO,
  callback: (data: any) => void,
): void => {
  emit(ClientPacketTypeEnum.CREATE_PLANT_BLOCK_LAND, input, callback);
};

export const harvestPlantBlockLand = (
  input: HarvestPlantBlockLandDTO,
  callback: (data: any) => void,
): void => {
  emit(ClientPacketTypeEnum.HARVEST_PLANT_BLOCK_LAND, input, callback);
};

export const stealPlantBlockLand = (
  input: StealPlantBlockLandDTO,
  callback: (data: any) => void,
): void => {
  emit(ClientPacketTypeEnum.THEFT_PLANT_BLOCK_LAND, input, callback);
};

export const mintStructBlockLand = (
  input: MintStructBlockLandDTO,
  callback: (data: any) => void,
): void => {
  emit(ClientPacketTypeEnum.MINT_STRUCT_BLOCK_LAND, input, callback);
};

export const deleteStructBlockLand = (
  input: DeleteStructBlockLandDTO,
  callback: (data: any) => void,
): void => {
  emit(ClientPacketTypeEnum.DELETE_STRUCT_BLOCK_LAND, input, callback);
};

export const deleteDecorationBlockLand = (
  input: DeleteDecorationBlockLandDTO,
  callback: (data: any) => void,
): void => {
  emit(ClientPacketTypeEnum.DELETE_DECORATION_BLOCK_LAND, input, callback);
};
