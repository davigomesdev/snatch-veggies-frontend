import { TVector2 } from '@/core/types/vector2.type';

export interface CreatePlantBlockLandDTO {
  id: string;
  blockPos: TVector2;
  plantIndex: number;
}
