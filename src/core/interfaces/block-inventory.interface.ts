import { IBlock } from './block.interface';

export interface IBlockInventory {
  id: string;
  landId: string;
  blockId: string;
  amount: number;
  inUse: number;
  block?: IBlock;
}
