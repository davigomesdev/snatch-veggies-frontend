import event from '../systems/event';

import { differenceInMinutes } from 'date-fns';

import { TVector2 } from '@/core/types/vector2.type';
import { TVector3 } from '@/core/types/vector3.type';

import { ColorEnum } from '@/core/enums/color.enum';
import { EventEnum } from '@/core/enums/event.enum';
import { GameModeEnum } from '@/core/enums/game-mode.enum';

import { MintStructBlockLandDTO } from '../services/socket/dtos/mint-struct-block-land.dto';
import { DeleteStructBlockLandDTO } from '../services/socket/dtos/delete-struct-block-land.dto';

import { deleteStructBlockLand, mintStructBlockLand } from '../services/socket/socket.service';

import { Block } from './block';
import { VoxelScene } from './voxel-scene';
import { VoxelData } from './voxel-data';

import { cart2iso } from '../utils/math.util';

export abstract class Struct {
  public block: Block;
  public scene: VoxelScene;

  public name: string;
  public position: TVector3;
  public offset: TVector3;
  public size: TVector2;

  public isCompleted: boolean;
  public prevClaimDate: Date;
  public duration: number;

  public sprite: Phaser.GameObjects.Sprite;
  private updateEvent: Phaser.Time.TimerEvent;

  public constructor(
    block: Block,
    name: string,
    sprite: string,
    prevClaimDate: Date,
    duration: number,
    size: TVector2,
    offset: TVector3,
  ) {
    this.block = block;
    this.scene = block.world.scene;

    this.name = name;
    this.offset = offset;
    this.position = block.position;
    this.size = size;

    this.duration = duration;
    this.prevClaimDate = prevClaimDate;
    this.isCompleted = false;

    const { x, y } = this.getSpritePosition();

    this.sprite = this.scene.add.sprite(x, y, sprite);
    this.sprite.setDepth(this.block.sprite.depth + offset.z);

    this.sprite.on('pointerover', this.onPointerOver, this);
    this.sprite.on('pointerout', this.onPointerOut, this);
    this.sprite.on('pointerdown', this.onPointerDown, this);

    this.sprite.setInteractive({ pixelPerfect: true });

    this.updateEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.update,
      callbackScope: this,
      loop: true,
    });

    this.update();
  }

  public update(): void {
    const now = new Date();

    const totalMinutes = this.duration;
    const minutesElapsed = differenceInMinutes(now, this.prevClaimDate);

    if (minutesElapsed >= totalMinutes) {
      this.isCompleted = true;
    }
  }

  public mint(): Struct {
    const { x, y } = this.block.position;

    const input: MintStructBlockLandDTO = {
      id: this.scene.land.id,
      blockPos: { x, y },
    };

    mintStructBlockLand(input, (response) => {
      if (response.error) return;

      this.prevClaimDate = new Date();
      this.isCompleted = false;
      this.update();

      event.emit(EventEnum.UPDATE_STRUCT_INVENTORY);
    });

    return this;
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

  public destroy(): void {
    this.block.children = null;
    this.sprite.destroy(true);
    this.updateEvent.remove();
  }

  public onPointerOver(): void {
    if (this.scene.gameMode === GameModeEnum.MOVE) return;

    if (this.scene.isMouseOverHTMLElement() || this.scene.isVisitor) {
      this.sprite.clearTint();
      return;
    }

    this.sprite.setTint(ColorEnum.NEUTRAL_300);
    this.scene.input.setDefaultCursor('pointer');
  }

  public onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (pointer.button !== 0 || this.scene.isMouseOverHTMLElement() || this.scene.isVisitor) return;
    if (this.scene.gameMode === GameModeEnum.BUILDER) {
      const { x, y } = this.block.position;

      const input: DeleteStructBlockLandDTO = {
        id: this.scene.land.id,
        blockPos: { x, y },
      };

      deleteStructBlockLand(input, () => {
        this.destroy();
        event.emit(EventEnum.UPDATE_STRUCT_INVENTORY);
      });
    }

    if (this.scene.gameMode === GameModeEnum.MOUSE) {
      event.emit(EventEnum.ON_CLICK_STRUCT_SELECT, this);
    }
  }

  public onPointerOut(): void {
    if (this.scene.gameMode === GameModeEnum.MOVE) return;

    this.sprite.clearTint();
    this.scene.input.setDefaultCursor('default');
  }
}
