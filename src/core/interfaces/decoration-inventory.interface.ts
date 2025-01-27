import { IDecoration } from './decoration.interface';

export interface IDecorationInventory {
  id: string;
  landId: string;
  decorationId: string;
  amount: number;
  inUse: number;
  decoration?: IDecoration;
}
