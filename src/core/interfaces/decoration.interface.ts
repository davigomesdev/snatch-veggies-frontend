import { TVector2 } from '../types/vector2.type';

export interface IDecoration {
  id: string;
  index: number;
  name: string;
  price: number;
  limit: number;
  size: TVector2;
  image: string;
}
