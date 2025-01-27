import { Block } from '@/scripts/voxel/block';
import { Decoration } from '@/scripts/voxel/decoration';

export class TreePrefab extends Decoration {
  public constructor(tile: Block) {
    super(tile, 'Tree', 'tree', { x: 1, y: 1 }, { x: 0, y: 55, z: 10 });
  }
}
