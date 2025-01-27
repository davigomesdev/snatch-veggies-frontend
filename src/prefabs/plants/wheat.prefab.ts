import { Block } from '@/scripts/voxel/block';
import { Plant } from '@/scripts/voxel/plant';

export class WheatPrefab extends Plant {
  public constructor(tile: Block, plantingDate: Date) {
    super(tile, 'Wheat', 'wheat', plantingDate, 3, { x: 0, y: 16 });
  }
}
