import { Block } from '@/scripts/voxel/block';
import { Decoration } from '@/scripts/voxel/decoration';

export class FlowerPrefab extends Decoration {
  public constructor(tile: Block) {
    super(tile, 'Flower', 'flower', { x: 1, y: 1 }, { x: 0, y: 8, z: 8 });
  }
}
