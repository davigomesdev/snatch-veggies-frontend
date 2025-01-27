import event from '../systems/event';

import { TVector2 } from '@/core/types/vector2.type';

import { ColorEnum } from '@/core/enums/color.enum';
import { EventEnum } from '@/core/enums/event.enum';
import { GameModeEnum } from '@/core/enums/game-mode.enum';

import { VoxelScene } from './voxel-scene';
import { VoxelData } from './voxel-data';

import { cart2iso } from '../utils/math.util';

export class Boat {
  public scene: VoxelScene;
  public sprite = {} as Phaser.GameObjects.Sprite;

  public constructor(scene: VoxelScene) {
    this.scene = scene;
  }

  public create(): void {
    const { x, y } = this.getSpritePosition();

    this.sprite = this.scene.add.sprite(x, y, 'boat');
    this.sprite.play('boat', true);

    this.sprite.setInteractive({ pixelPerfect: true });

    this.sprite.on('pointerover', this.onPointerOver, this);
    this.sprite.on('pointerout', this.onPointerOut, this);
    this.sprite.on('pointerdown', this.onPointerDown, this);
  }

  public getSpritePosition(): TVector2 {
    const baseX = -10 * VoxelData.BLOCK_SIZE;
    const baseY = 20 * VoxelData.BLOCK_SIZE;

    let [x, y] = cart2iso(baseX, baseY);

    x = x / 2 + this.scene.CX;
    y = y / 2 + this.scene.CY / VoxelData.WIDTH;

    const verticalOffset = (VoxelData.BLOCK_SIZE / 2) * 0;
    const position: TVector2 = { x: x, y: y - verticalOffset };

    return position;
  }

  public onPointerOver(): void {
    if (this.scene.gameMode === GameModeEnum.MOVE) return;

    if (
      this.scene.isMouseOverHTMLElement() ||
      this.scene.gameMode !== GameModeEnum.MOUSE ||
      this.scene.isVisitor
    ) {
      this.sprite.clearTint();
      return;
    }

    this.sprite.setTint(ColorEnum.NEUTRAL_300);
    this.scene.input.setDefaultCursor('pointer');
  }

  public onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (pointer.button !== 0 || this.scene.isMouseOverHTMLElement() || this.scene.isVisitor) return;
    if (this.scene.gameMode !== GameModeEnum.MOUSE) return;

    if (this.scene.world.selectedBlocks.length > 0) {
      this.scene.world.selectedBlocks.map((block) => block.setSelect(false));
      this.scene.world.selectedBlocks = [];
    }

    event.emit(EventEnum.ON_CLICK_BOAT_SELECT);
  }

  public onPointerOut(): void {
    if (this.scene.gameMode === GameModeEnum.MOVE) return;

    this.sprite.clearTint();
    this.scene.input.setDefaultCursor('default');
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
