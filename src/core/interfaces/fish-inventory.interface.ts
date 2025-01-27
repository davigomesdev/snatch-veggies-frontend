import { IFish } from './fish.interface';

export interface IFishInventory {
  id: string;
  landId: string;
  fishId: string;
  amount: number;
  fish?: IFish;
}
