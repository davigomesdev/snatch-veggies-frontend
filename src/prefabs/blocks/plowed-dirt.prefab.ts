import event from '@/scripts/systems/event';

import { TVector3 } from '@/core/types/vector3.type';

import { TChildrenSetter } from '@/core/types/block-setter';

import { EventEnum } from '@/core/enums/event.enum';
import { GameModeEnum } from '@/core/enums/game-mode.enum';

import { Block } from '@/scripts/voxel/block';
import { World } from '@/scripts/voxel/world';

export class PlowedDirtPrefab extends Block {
  public constructor(world: World, position: TVector3, children: TChildrenSetter | null) {
    super(world, 'plowed-dirt', position, children, 'outline-slab', true);
  }

  public override enableInteraction(): void {
    if (this.scene.isVisitor && this.children === null) return;
    super.enableInteraction();
  }

  public override onPointerDown(pointer: Phaser.Input.Pointer): void {
    super.onPointerDown(pointer);

    if (pointer.button !== 0 || this.scene.isMouseOverHTMLElement()) return;

    if (this.scene.gameMode !== GameModeEnum.MOUSE) return;

    this.setOutline(true);
    this.setSelect(true);

    event.emit(EventEnum.ON_CLICK_BLOCK_SELECT, this);
  }
}
