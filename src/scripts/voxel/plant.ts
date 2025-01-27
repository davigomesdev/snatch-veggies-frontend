import event from '../systems/event';

import { differenceInMinutes } from 'date-fns';

import { TVector2 } from '@/core/types/vector2.type';
import { TVector3 } from '@/core/types/vector3.type';

import { EventEnum } from '@/core/enums/event.enum';

import { HarvestPlantBlockLandDTO } from '../services/socket/dtos/harvest-plant-block-land.dto';
import { StealPlantBlockLandDTO } from '../services/socket/dtos/steal-plant-block-land.dto';

import { harvestPlantBlockLand, stealPlantBlockLand } from '../services/socket/socket.service';

import { Block } from './block';
import { VoxelScene } from './voxel-scene';
import { VoxelData } from './voxel-data';

import { cart2iso } from '../utils/math.util';
import { findByTokenIdLand } from '../services/axios/requests/land/land.service';

export abstract class Plant {
  public scene: VoxelScene;
  public block: Block;

  public name: string;
  public position: TVector3;
  public offset: TVector2;

  public isCompleted: boolean;
  public plantingDate: Date;
  public duration: number;

  public sprite: Phaser.GameObjects.Sprite;
  private updateEvent: Phaser.Time.TimerEvent;

  public constructor(
    block: Block,
    name: string,
    sprite: string,
    plantingDate: Date,
    duration: number,
    offset: TVector2,
  ) {
    this.block = block;
    this.scene = block.scene;

    this.name = name;
    this.offset = offset;
    this.position = block.position;

    this.plantingDate = plantingDate;
    this.duration = duration;
    this.isCompleted = false;

    const { x, y } = this.getSpritePosition();

    this.sprite = this.scene.add.sprite(x, y, sprite);
    this.sprite.setDepth(this.block.sprite.depth + offset.y);

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
    const minutesElapsed = differenceInMinutes(now, this.plantingDate);

    if (minutesElapsed >= totalMinutes) {
      this.sprite.setFrame(2);
      this.updateEvent.remove();
      this.isCompleted = true;
      return;
    }

    const progress = minutesElapsed / totalMinutes;

    if (progress < 1 / 3) {
      this.sprite.setFrame(0);
    } else if (progress < 2 / 3) {
      this.sprite.setFrame(1);
    } else {
      this.sprite.setFrame(2);
    }
  }

  public harvest(): Plant {
    const { x, y } = this.block.position;

    const input: HarvestPlantBlockLandDTO = {
      id: this.scene.land.id,
      blockPos: { x, y },
    };

    harvestPlantBlockLand(input, (reponse) => {
      if (reponse.error) return;

      this.block.children = null;
      this.block.setSelect(false);
      this.destroy();
      event.emit(EventEnum.UPDATE_LAND_INVENTORY);
    });

    return this;
  }

  public theft(): Plant {
    const { x, y } = this.block.position;

    const input: StealPlantBlockLandDTO = {
      id: this.scene.land.id,
      landId: this.scene.visitorland.id,
      blockPos: { x, y },
    };

    stealPlantBlockLand(input, async (reponse) => {
      if (!reponse.error) {
        this.block.children = null;
        this.block.setSelect(false);
        this.block.disableInteraction();
        this.destroy();
        event.emit(EventEnum.UPDATE_PLANTATION_INVENTORY);
      }

      this.scene.visitorland = (
        await findByTokenIdLand({
          tokenId: this.scene.visitorland.tokenId,
        })
      ).data;
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
    this.sprite.destroy(true);
    this.updateEvent.remove();
  }
}
