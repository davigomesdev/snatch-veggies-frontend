import { Block } from '@/scripts/voxel/block';
import { Decoration } from '@/scripts/voxel/decoration';

export class HousePrefab extends Decoration {
  public constructor(tile: Block) {
    super(tile, 'House', 'house', { x: 9, y: 7 }, { x: 0, y: 75, z: 10 });
  }
}
