import event from '../systems/event';

import { ColorEnum } from '@/core/enums/color.enum';
import { EventEnum } from '@/core/enums/event.enum';
import { GameModeEnum } from '@/core/enums/game-mode.enum';

import { TVector2 } from '@/core/types/vector2.type';
import { TBlockSetter } from '@/core/types/block-setter';

import { Block } from './block';
import { VoxelData } from './voxel-data';
import { VoxelScene } from './voxel-scene';

import { iso2cart } from '../utils/math.util';

export class World {
  public scene: VoxelScene;

  public selectedBlocks: Block[] = [];
  public graphics = {} as Phaser.GameObjects.Graphics;

  public layer0: Block[][] = Array.from({ length: VoxelData.HEIGHT }, () => []);
  public layer1: Block[][] = Array.from({ length: VoxelData.HEIGHT }, () => []);

  public constructor(scene: VoxelScene) {
    this.scene = scene;
  }

  public create(): void {
    this.graphics = this.drawGrid();

    this.setAnim('water-dirt', 4);
    this.setAnim('boat', 4);
    this.setAnim('chicken-idle', 4);
    this.setAnim('chicken-scratch', 4);

    this.generateWorld(this.scene.map);
  }

  public generateWorld(blocksSetter: TBlockSetter[][]): void {
    for (let y = 0; y < VoxelData.HEIGHT; y++) {
      for (let x = 0; x < VoxelData.WIDTH; x++) {
        const setter = blocksSetter[y][x];

        const block0 = new VoxelData.BLOCK_TYPES[3](this, { x, y, z: 0 }, null);
        const block1 = new VoxelData.BLOCK_TYPES[setter.id](this, { x, y, z: 1 }, setter.children);

        setter.id !== 0 ? block0.setVisible(true) : block0.setVisible(false);

        this.layer0[y][x] = block0;
        this.layer1[y][x] = block1;
      }
    }
  }

  public drawGrid(): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();

    graphics.setVisible(false);
    graphics.lineStyle(1, ColorEnum.WHITE, 0.3);

    for (let y = 0; y < VoxelData.HEIGHT; y++)
      for (let x = 0; x < VoxelData.WIDTH; x++) {
        const isoX = (x - 1 - (y - 1)) * (VoxelData.BLOCK_SIZE / 2) + this.scene.CX;
        const isoY =
          (x - 1 + (y - 1)) * (VoxelData.BLOCK_SIZE / 4) + this.scene.CY / VoxelData.WIDTH;

        graphics.beginPath();
        graphics.moveTo(isoX, isoY);
        graphics.lineTo(isoX + VoxelData.BLOCK_SIZE / 2, isoY + VoxelData.BLOCK_SIZE / 4);
        graphics.lineTo(isoX, isoY + VoxelData.BLOCK_SIZE / 2);
        graphics.lineTo(isoX - VoxelData.BLOCK_SIZE / 2, isoY + VoxelData.BLOCK_SIZE / 4);
        graphics.closePath();
        graphics.strokePath();
      }

    return graphics;
  }

  public getBlock(x: number, y: number): Block | null {
    const safeX = Math.floor(x);
    const safeY = Math.floor(y);

    return safeX >= 0 && safeX < VoxelData.WIDTH && safeY >= 0 && safeY < VoxelData.HEIGHT
      ? this.layer1[safeY][safeX]
      : null;
  }

  public getBlockByCartPos(x: number, y: number): Block | null {
    const tileX = Math.floor(x / VoxelData.BLOCK_SIZE);
    const tileY = Math.floor(y / VoxelData.BLOCK_SIZE);

    return this.getBlock(tileX, tileY);
  }

  public getBlockByIsoPos(x: number, y: number): Block | null {
    for (let z = 0; z <= 4; z++) {
      const mx = (x - this.scene.CX) * 2;
      const my = (y - (this.scene.CY / VoxelData.WIDTH - z * (VoxelData.BLOCK_SIZE / 2))) * 2;

      const [ix, iy] = iso2cart(mx, my);
      const tile = this.getBlockByCartPos(ix, iy);

      if (tile && tile.position.z === z) return tile;
    }

    return null;
  }

  public getAdjacentBlocks(position: TVector2, size: TVector2): (Block | null)[] {
    const adjacentBlocks: (Block | null)[] = [];

    for (let dx = -Math.floor(size.x / 2); dx <= Math.floor(size.x / 2); dx++) {
      for (let dy = -Math.floor(size.y / 2); dy <= Math.floor(size.y / 2); dy++) {
        const neighborX = position.x + dx;
        const neighborY = position.y + dy;
        adjacentBlocks.push(this.layer1[neighborY]?.[neighborX] ?? null);
      }
    }

    return adjacentBlocks;
  }

  public setAnim(key: string, framerate?: number, repeat?: number, repeat_delay?: number) {
    if (!this.scene.anims.exists(key)) {
      this.scene.anims.create({
        key: key,
        frames: this.scene.anims.generateFrameNumbers(key),
        frameRate: framerate ?? 8,
        repeat: repeat ?? -1,
        repeatDelay: repeat_delay ?? 0,
      });
    }
  }

  public setBlock(block: Block, blockSetter: TBlockSetter): void {
    const { x, y } = block.position;

    blockSetter.id !== 0 ? this.layer0[y][x].setVisible(true) : this.layer0[y][x].setVisible(false);
    const newBlock = new VoxelData.BLOCK_TYPES[blockSetter.id](
      this,
      block.position,
      blockSetter.children,
    );

    this.layer1[y][x] = newBlock;
    block.destroy();
  }

  public setGridVisible(value: boolean): void {
    if (this.graphics.visible == value) return;

    function isInteractive(obj: any): obj is {
      enableInteraction: () => void;
      disableInteraction: () => void;
    } {
      return (
        typeof obj?.enableInteraction === 'function' &&
        typeof obj?.disableInteraction === 'function'
      );
    }

    this.graphics.setVisible(value);

    for (let y = 0; y < VoxelData.HEIGHT; y++) {
      for (let x = 0; x < VoxelData.WIDTH; x++) {
        const block = this.layer1[y][x];
        if (!block.isInteractive) value ? block.enableInteraction() : block.disableInteraction();
        if (block.children !== null && isInteractive(block.children))
          value ? block.children.enableInteraction() : block.children.disableInteraction();
      }
    }
  }

  public setInteraction(value: boolean): void {
    function isInteractive(obj: any): obj is {
      isInteractive: boolean;
      enableInteraction: () => void;
      disableInteraction: () => void;
    } {
      return (
        typeof obj?.isInteractive === 'boolean' &&
        typeof obj?.enableInteraction === 'function' &&
        typeof obj?.disableInteraction === 'function'
      );
    }

    for (let y = 0; y < VoxelData.HEIGHT; y++) {
      for (let x = 0; x < VoxelData.WIDTH; x++) {
        const block = this.layer1[y][x];
        if (block.isInteractive) value ? block.enableInteraction() : block.disableInteraction();
        if (block.children !== null && isInteractive(block.children))
          value ? block.children.enableInteraction() : block.children.disableInteraction();
      }
    }
  }

  public onEvents(): void {
    event.on(EventEnum.SET_GAME_MODE, (gameMode) => {
      this.selectedBlocks.map((block) => block.setSelect(false));

      if (gameMode === GameModeEnum.MOVE) {
        this.setInteraction(false);
        this.graphics.setVisible(false);
      } else {
        this.setInteraction(true);
        this.setGridVisible(gameMode === GameModeEnum.BUILDER);
      }
    });
  }

  public destroy(): void {
    if (this.graphics) {
      this.graphics.clear();
      this.graphics.destroy();
    }

    for (let y = 0; y < VoxelData.HEIGHT; y++) {
      for (let x = 0; x < VoxelData.WIDTH; x++) {
        this.layer0[y][x].destroy();
        this.layer1[y][x].destroy();
      }
    }

    this.selectedBlocks = [];
  }
}
