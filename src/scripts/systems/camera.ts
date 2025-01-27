import event from './event';

import { EventEnum } from '@/core/enums/event.enum';
import { GameModeEnum } from '@/core/enums/game-mode.enum';

import { VoxelScene } from '../voxel/voxel-scene';

export class Camera {
  public static readonly ZOOM_MIN = 0.8;
  public static readonly ZOOM_MAX = 5;

  public scene: VoxelScene;
  public isDragging: boolean = false;

  public constructor(scene: VoxelScene) {
    this.scene = scene;
    const mainCamera = this.scene.cameras.main;

    this.scene.input.on('wheel', (_: any, _1: any, _2: any, dy: number) => {
      const currentZoom = mainCamera.zoom;
      const zoomSpeed = 0.001;
      const newZoom = Math.max(
        Math.min(currentZoom * (1 - dy * zoomSpeed), Camera.ZOOM_MAX),
        Camera.ZOOM_MIN,
      );

      mainCamera.setZoom(newZoom);
      mainCamera.centerOn(mainCamera.midPoint.x, mainCamera.midPoint.y);
    });

    this.scene.input.on('pointerup', () => {
      this.isDragging = false;
    });

    this.scene.input.on('pointerdown', () => {
      if (this.scene!.mouse.isRightDown() || this.scene!.gameMode === GameModeEnum.MOVE) {
        this.isDragging = true;
      }
    });

    this.scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        this.scene.cameras.main.scrollX -= (p.x - p.prevPosition.x) / this.scene.cameras.main.zoom;
        this.scene.cameras.main.scrollY -= (p.y - p.prevPosition.y) / this.scene.cameras.main.zoom;
      }
    });

    this.onEvents();
  }

  private onEvents(): void {
    event.on(EventEnum.SET_ZOOM, (value) => {
      const mainCamera = this.scene.cameras.main;
      const currentZoom = mainCamera.zoom;

      const newZoom = Math.max(Math.min(currentZoom + value, Camera.ZOOM_MAX), Camera.ZOOM_MIN);

      mainCamera.setZoom(newZoom);
      mainCamera.centerOn(mainCamera.midPoint.x, mainCamera.midPoint.y);
    });
  }
}
