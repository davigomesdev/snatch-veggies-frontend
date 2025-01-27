import { TVector2 } from '@/core/types/vector2.type';

export interface CreateBlockLandDTO {
  id: string;
  blockPos: TVector2;
  blockIndex: number;
}
