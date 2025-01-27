import { BlockTypeEnum } from '../enums/block-type.enum';

export interface IBlock {
  id: string;
  index: number;
  name: string;
  price: number;
  limit: number;
  type: BlockTypeEnum;
  image: string;
}
