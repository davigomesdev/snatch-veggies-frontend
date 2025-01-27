import { IStruct } from './struct.interface';

export interface IStructInventory {
  id: string;
  landId: string;
  structId: string;
  amount: number;
  inUse: number;
  minted: number;
  struct?: IStruct;
}
