import { Block } from '@/scripts/voxel/block';
import { Decoration } from '@/scripts/voxel/decoration';

export class StemPrefab extends Decoration {
  public constructor(tile: Block) {
    super(tile, 'Stem', 'stem', { x: 1, y: 1 }, { x: 0, y: 8, z: 8 });
  }
}
