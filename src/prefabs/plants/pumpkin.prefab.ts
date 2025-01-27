import { Block } from '@/scripts/voxel/block';
import { Plant } from '@/scripts/voxel/plant';

export class PumpkinPrefab extends Plant {
  public constructor(tile: Block, plantingDate: Date) {
    super(tile, 'Pumpkin', 'pumpkin', plantingDate, 20, { x: 0, y: 13 });
  }
}
