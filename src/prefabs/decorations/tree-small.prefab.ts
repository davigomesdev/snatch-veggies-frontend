import { Block } from '@/scripts/voxel/block';
import { Decoration } from '@/scripts/voxel/decoration';

export class TreeSmallPrefab extends Decoration {
  public constructor(tile: Block) {
    super(tile, 'Tree Small', 'tree-small', { x: 1, y: 1 }, { x: 0, y: 38, z: 10 });
  }
}
