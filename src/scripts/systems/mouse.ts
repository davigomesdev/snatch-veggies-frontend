import { VoxelScene } from '../voxel/voxel-scene';

export class Mouse {
  protected scene: VoxelScene;

  public constructor(scene: VoxelScene) {
    this.scene = scene;
  }

  public isLeftDown(): boolean {
    return this.scene.input.mousePointer.leftButtonDown();
  }

  public isRightDown(): boolean {
    return this.scene.input.mousePointer.rightButtonDown();
  }

  public isLeftRelease(): boolean {
    return this.scene.input.mousePointer.leftButtonReleased();
  }

  public isRightRelease(): boolean {
    return this.scene.input.mousePointer.rightButtonReleased();
  }

  public setCursor(src?: string) {
    this.scene.game.canvas.style.cursor = src ? `url(${src}), auto` : '';
  }
}
