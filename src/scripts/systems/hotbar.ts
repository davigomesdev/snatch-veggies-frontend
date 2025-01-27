import event from './event';

import { EventEnum } from '@/core/enums/event.enum';
import { ChildrenTypeEnum } from '@/core/enums/children-type.enum';

import { VoxelScene } from '../voxel/voxel-scene';

export class Hotbar {
  public scene: VoxelScene;

  public item: {
    id: number;
    category: ChildrenTypeEnum | null;
  } | null = null;

  public constructor(scene: VoxelScene) {
    this.scene = scene;
  }

  public setItem(id: number, category: ChildrenTypeEnum | null): void {
    this.item = { id, category };
  }

  public onEvents(): void {
    event.on(EventEnum.SELECT_BLOCK, (id, category) => {
      this.setItem(id, category);
    });

    event.on(EventEnum.SET_GAME_MODE, () => {
      this.item = null;
    });
  }
}
