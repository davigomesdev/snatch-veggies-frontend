import { TVector3 } from '@/core/types/vector3.type';

import { TChildrenSetter } from '@/core/types/block-setter';

import { Block } from '@/scripts/voxel/block';
import { World } from '@/scripts/voxel/world';

export class WaterDirtPrefab extends Block {
  public constructor(wolrd: World, position: TVector3, children: TChildrenSetter | null) {
    super(wolrd, 'water-dirt', position, children);
    this.sprite.play('water-dirt', true);
  }
}
