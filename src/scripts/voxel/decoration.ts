import event from '../systems/event';

import { TVector2 } from '@/core/types/vector2.type';
import { TVector3 } from '@/core/types/vector3.type';

import { ColorEnum } from '@/core/enums/color.enum';
import { EventEnum } from '@/core/enums/event.enum';
import { GameModeEnum } from '@/core/enums/game-mode.enum';

import { DeleteDecorationBlockLandDTO } from '../services/socket/dtos/delete-decoration-block-land.dto';

import { deleteDecorationBlockLand } from '../services/socket/socket.service';

import { Block } from './block';
import { VoxelScene } from './voxel-scene';
import { VoxelData } from './voxel-data';

import { cart2iso } from '../utils/math.util';

export abstract class Decoration {
  public block: Block;
  public scene: VoxelScene;

  public name: string;
  public position: TVector3;
  public offset: TVector3;
  public size: TVector2;

  public isSelected: boolean = false;
  public sprite: Phaser.GameObjects.Sprite;

  public constructor(block: Block, name: string, sprite: string, size: TVector2, offset: TVector3) {
    this.block = block;
    this.scene = block.world.scene;

    this.name = name;
    this.offset = offset;
    this.position = block.position;
    this.size = size;

    const { x, y } = this.getSpritePosition();

    this.sprite = this.scene.add.sprite(x, y, sprite);
    this.sprite.setDepth(this.block.sprite.depth + offset.z);

    this.sprite.on('pointerover', this.onPointerOver, this);
    this.sprite.on('pointerout', this.onPointerOut, this);
    this.sprite.on('pointerdown', this.onPointerDown, this);

    if (this.scene.gameMode === GameModeEnum.BUILDER) this.enableInteraction();
  }

  public getSpritePosition(): TVector2 {
    const baseX = this.position.x * VoxelData.BLOCK_SIZE;
    const baseY = this.position.y * VoxelData.BLOCK_SIZE;

    let [x, y] = cart2iso(baseX, baseY);

    x = x / 2 + this.block.world.scene.CX;
    y = y / 2 + this.block.world.scene.CY / VoxelData.WIDTH;

    const verticalOffset = (VoxelData.BLOCK_SIZE / 2) * this.position.z + this.offset.y;
    const position: TVector2 = { x: x + this.offset.x, y: y - verticalOffset };

    return position;
  }

  public enableInteraction(): void {
    this.sprite.setInteractive({ pixelPerfect: true });
  }

  public disableInteraction(): void {
    this.sprite.disableInteractive(true);
  }

  public destroy(): void {
    this.block.children = null;
    this.sprite.destroy(true);
  }

  public onPointerOver(): void {
    if (this.scene.isMouseOverHTMLElement()) {
      this.onPointerOut();
      return;
    }

    this.sprite.setTint(ColorEnum.NEUTRAL_300);
    this.scene.input.setDefaultCursor('pointer');
  }

  public onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (pointer.button !== 0 || this.scene.isMouseOverHTMLElement()) return;
    if (this.scene.gameMode === GameModeEnum.BUILDER) {
      const { x, y } = this.block.position;

      const input: DeleteDecorationBlockLandDTO = {
        id: this.scene.land.id,
        blockPos: { x, y },
      };

      deleteDecorationBlockLand(input, () => {
        this.destroy();
        event.emit(EventEnum.UPDATE_DECORATION_INVENTORY);
      });
    }
  }

  public onPointerOut(): void {
    this.sprite.clearTint();
    this.scene.input.setDefaultCursor('default');
  }
}
