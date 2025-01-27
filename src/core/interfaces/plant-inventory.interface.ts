import { IPlant } from './plant.interface';

export interface IPlantInventory {
  id: string;
  landId: string;
  plantId: string;
  amount: number;
  inUse: number;
  harvest: number;
  plant?: IPlant;
}
