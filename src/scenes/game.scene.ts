import event, { eventMain } from '@/scripts/systems/event';

import { VoxelScene } from '@/scripts/voxel/voxel-scene';

import { EventEnum } from '@/core/enums/event.enum';
import { GameModeEnum } from '@/core/enums/game-mode.enum';
import { SceneNameEnum } from '@/core/enums/scene-name.enum';

import { currentLand, findLandData } from '@/scripts/services/axios/requests/land/land.service';

export class GameScene extends VoxelScene {
  public constructor() {
    super({ key: SceneNameEnum.GAME });
  }

  public async create(): Promise<void> {
    this.fade(false, 400, 0x000000);

    this.land = (await currentLand()).data;
    this.map = await findLandData({
      tokenId: this.land.tokenId,
    });

    super.create();

    this.world.create();
    this.boat.create();

    this.onEvents();
  }

  public override onEvents(): void {
    super.onEvents();

    event.on(EventEnum.VISIT, (tokenId) => {
      this.destroy();
      this.scene.start(SceneNameEnum.LAND, { tokenId });
    });

    eventMain.emit(EventEnum.MAP_LOADED, SceneNameEnum.GAME);
    event.emit(EventEnum.SET_GAME_MODE, GameModeEnum.MOUSE);
  }
}
