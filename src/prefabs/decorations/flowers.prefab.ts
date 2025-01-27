import { Block } from '@/scripts/voxel/block';
import { Decoration } from '@/scripts/voxel/decoration';

export class FlowersPrefab extends Decoration {
  public constructor(tile: Block) {
    super(tile, 'Flowers', 'flowers', { x: 1, y: 1 }, { x: 0, y: 10, z: 10 });
  }
}
