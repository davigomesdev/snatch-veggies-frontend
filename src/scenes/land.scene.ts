import event, { eventMain } from '@/scripts/systems/event';

import { EventEnum } from '@/core/enums/event.enum';
import { SceneNameEnum } from '@/core/enums/scene-name.enum';

import { VoxelScene } from '@/scripts/voxel/voxel-scene';

import {
  currentLand,
  findByTokenIdLand,
  findLandData,
} from '@/scripts/services/axios/requests/land/land.service';
import { GameModeEnum } from '@/core/enums/game-mode.enum';

export class LandScene extends VoxelScene {
  public tokenId!: number;

  public constructor() {
    super({ key: SceneNameEnum.LAND });
  }

  public init({ tokenId }: any): void {
    this.tokenId = tokenId;
    this.isVisitor = true;
  }

  public async create(): Promise<void> {
    this.fade(false, 400, 0x000000);

    const land = await currentLand();
    const visitorland = await findByTokenIdLand({
      tokenId: this.tokenId,
    });
    const map = await findLandData({
      tokenId: this.tokenId,
    });

    this.map = map;
    this.land = land.data;
    this.visitorland = visitorland.data;

    super.create();

    this.world.create();
    this.boat.create();

    this.onEvents();
  }

  public override onEvents(): void {
    super.onEvents();

    event.on(EventEnum.RETURN, () => {
      this.destroy();
      this.scene.start(SceneNameEnum.GAME);
    });

    eventMain.emit(EventEnum.MAP_LOADED, SceneNameEnum.LAND);
    event.emit(EventEnum.SET_GAME_MODE, GameModeEnum.MOUSE);
  }
}
