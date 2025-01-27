import { SceneNameEnum } from '@/core/enums/scene-name.enum';

import { VoxelScene } from '@/scripts/voxel/voxel-scene';

import { images, spritesheets } from '@/assets/assets';

export class PreloadScene extends VoxelScene {
  public constructor() {
    super({ key: SceneNameEnum.PRELOAD });
  }

  public preload(): void {
    this.input.mouse?.disableContextMenu();
    this.cameras.main.setBackgroundColor(0x000000);

    const width = 0.1 * this.W;

    const x = this.CX - width / 2;
    const y = this.CY;

    const bar = this.add.rectangle(x, y, 1, 5, 0xdddddd).setOrigin(0, 0.5);
    this.add.rectangle(x, y, width, 0, 0x666666).setOrigin(0, 0.5);

    this.load.on('progress', (progress: number) => {
      bar.width = progress * width;
    });

    for (const image of images) {
      this.load.image(image.key, image.path);
    }

    for (const spritesheet of spritesheets) {
      this.load.spritesheet(spritesheet.key, spritesheet.path, {
        frameWidth: spritesheet.width,
        frameHeight: spritesheet.height,
      });
    }
  }

  public override create(): void {
    this.fade(true, 100, 0x000000);
    this.addEvent(100, () => {
      this.scene.start(SceneNameEnum.GAME);
    });
  }
}
