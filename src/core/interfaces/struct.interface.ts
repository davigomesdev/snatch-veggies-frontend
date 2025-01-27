import { TVector2 } from '../types/vector2.type';

export interface IStruct {
  id: string;
  index: number;
  name: string;
  itemName: string;
  price: number;
  profit: number;
  limit: number;
  exp: number;
  duration: number;
  size: TVector2;
  isVisible: boolean;
  image: string;
  itemImage: string;
}
