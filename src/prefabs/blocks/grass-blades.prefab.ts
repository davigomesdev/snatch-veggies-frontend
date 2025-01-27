import { TVector3 } from '@/core/types/vector3.type';

import { TChildrenSetter } from '@/core/types/block-setter';

import { Block } from '@/scripts/voxel/block';
import { World } from '@/scripts/voxel/world';

export class GrassBladesPrefab extends Block {
  public constructor(world: World, position: TVector3, children: TChildrenSetter | null) {
    super(world, 'grass-blades', position, children);
  }
}
