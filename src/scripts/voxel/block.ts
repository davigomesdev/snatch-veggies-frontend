import event from '../systems/event';

import { TVector2 } from '@/core/types/vector2.type';
import { TVector3 } from '@/core/types/vector3.type';

import { TChildrenSetter } from '@/core/types/block-setter';

import { ColorEnum } from '@/core/enums/color.enum';
import { EventEnum } from '@/core/enums/event.enum';
import { GameModeEnum } from '@/core/enums/game-mode.enum';
import { ChildrenTypeEnum } from '@/core/enums/children-type.enum';

import { CreateBlockLandDTO } from '../services/socket/dtos/create-block-land.dto';
import { CreatePlantBlockLandDTO } from '../services/socket/dtos/create-plant-block-land.dto';
import { CreateStructBlockLandDTO } from '../services/socket/dtos/create-struct-block-land.dto';
import { CreateDecorationBlockLandDTO } from '../services/socket/dtos/create-decoration-block-land.dto';

import {
  createPlantBlockLand,
  createBlockLand,
  createDecorationBlockLand,
  createStructBlockLand,
} from '../services/socket/socket.service';

import { Struct } from './struct';
import { Plant } from './plant';
import { Decoration } from './decoration';

import { VoxelScene } from './voxel-scene';
import { World } from './world';
import { VoxelData } from './voxel-data';

import { cart2iso } from '../utils/math.util';

export abstract class Block {
  public scene: VoxelScene;
  public world: World;

  public name: string;
  public position: TVector3;

  public isSelected: boolean = false;
  public isInteractive: boolean = false;

  public children: Struct | Decoration | Plant | null = null;

  public sprite: Phaser.GameObjects.Sprite;
  public outline: Phaser.GameObjects.Sprite;

  public constructor(
    world: World,
    sprite: string,
    position: TVector3,
    children: TChildrenSetter | null,
    outlineKey = 'outline-block',
    isInteractive: boolean = false,
  ) {
    this.world = world;
    this.scene = world.scene;
    this.name = sprite;
    this.position = position;
    this.isInteractive = isInteractive;

    const { x, y } = this.getSpritePosition();

    this.sprite = this.scene.add.sprite(x, y, sprite);
    this.sprite.setDepth(this.position.x + this.position.y);

    this.outline = this.scene.add
      .sprite(x, y, outlineKey)
      .setAlpha(0.7)
      .setDepth(this.position.x + this.position.y)
      .setVisible(false);

    this.sprite.on('pointerdown', this.onPointerDown, this);
    this.sprite.on('pointerover', this.onPointerOver, this);
    this.sprite.on('pointerout', this.onPointerOut, this);

    if (isInteractive || this.scene.gameMode === GameModeEnum.BUILDER) this.enableInteraction();
    if (children != null) this.setChildren(children.id, children.type, children.updateAt, true);
  }

  public get depth(): number {
    return this.sprite.depth;
  }

  private set depth(value: number) {
    this.sprite.setDepth(value);
  }

  public get visible(): boolean {
    return this.sprite.visible;
  }

  private set visible(value: boolean) {
    this.sprite.setVisible(value);
  }

  public getSpritePosition(): TVector2 {
    const baseX = this.position.x * VoxelData.BLOCK_SIZE;
    const baseY = this.position.y * VoxelData.BLOCK_SIZE;

    let [x, y] = cart2iso(baseX, baseY);

    x = x / 2 + this.scene.CX;
    y = y / 2 + this.scene.CY / VoxelData.WIDTH;

    const verticalOffset = (VoxelData.BLOCK_SIZE / 2) * this.position.z;
    const position: TVector2 = { x: x, y: y - verticalOffset };

    return position;
  }

  public getObject(): Decoration | null {
    return this.children as Decoration;
  }

  public getPlant(): Plant | null {
    return this.children as Plant;
  }

  public destroy(): void {
    this.sprite.destroy(true);
    this.outline.destroy(true);
    if (this.children) this.children.destroy();
  }

  public setDepth(value: number): Block {
    this.sprite.setDepth(value);
    return this;
  }

  public setVisible(value: boolean): Block {
    this.sprite.setVisible(value);
    return this;
  }

  public setOutline(value: boolean): Block {
    this.outline.setVisible(value);
    return this;
  }

  public setSelect(value: boolean, blocks?: Block[]): Block {
    if (this.isSelected === value) {
      return this;
    }

    if (value && this.world.selectedBlocks.length > 0) {
      this.world.selectedBlocks.forEach((block) => {
        if (
          blocks &&
          blocks.some(
            (b) =>
              b.position.x === block.position.x &&
              b.position.y === block.position.y &&
              b.position.z === block.position.z,
          )
        ) {
          return;
        }

        block.isSelected = false;
        block.outline.setAlpha(0.7).setVisible(false).setTint(ColorEnum.WHITE);
      });

      this.world.selectedBlocks = [];
    }

    this.isSelected = value;
    this.outline
      .setAlpha(value ? 1 : 0.7)
      .setVisible(value)
      .setTint(ColorEnum.WHITE);

    if (value) {
      if (blocks) {
        this.world.selectedBlocks = blocks;
      } else {
        this.world.selectedBlocks.push(this);
      }
    } else {
      event.emit(EventEnum.ON_CLICK_BLOCK_DESELECT, this);
    }

    return this;
  }

  public setChildren(
    index: number,
    type: ChildrenTypeEnum,
    updateAt?: Date,
    isInit: boolean = false,
  ): Block {
    const { x, y } = this.position;
    this.world.selectedBlocks.map((block) => block.setSelect(false));

    switch (type) {
      case ChildrenTypeEnum.STRUCT:
        {
          if (!isInit) {
            const input: CreateStructBlockLandDTO = {
              id: this.scene.land.id,
              blockPos: { x, y },
              structIndex: index,
            };

            createStructBlockLand(input, ({ error }) => {
              this.children = new VoxelData.STRUCTS_TYPE[index](this, new Date());

              if (error) {
                const adjacentBlocks = this.world.getAdjacentBlocks(
                  this.position,
                  this.children.size,
                );

                const validBlocks = adjacentBlocks.filter(
                  (block): block is Block => block !== null,
                );

                validBlocks.map((block) => {
                  block.setSelect(true, validBlocks).outline.setTint(ColorEnum.RED_500);
                });

                this.children.destroy();
              } else {
                event.emit(EventEnum.UPDATE_STRUCT_INVENTORY);
              }
            });
          } else {
            this.children = new VoxelData.STRUCTS_TYPE[index](this, updateAt);
          }
        }
        break;
      case ChildrenTypeEnum.DECORATION:
        {
          if (!isInit) {
            const input: CreateDecorationBlockLandDTO = {
              id: this.scene.land.id,
              blockPos: { x, y },
              decorationIndex: index,
            };

            createDecorationBlockLand(input, ({ error }) => {
              this.children = new VoxelData.DECORATIONS_TYPE[index](this);

              if (error) {
                const adjacentBlocks = this.world.getAdjacentBlocks(
                  this.position,
                  this.children.size,
                );

                const validBlocks = adjacentBlocks.filter(
                  (block): block is Block => block !== null,
                );

                validBlocks.map((block) => {
                  block.setSelect(true, validBlocks).outline.setTint(ColorEnum.RED_500);
                });

                this.children.destroy();
              } else {
                event.emit(EventEnum.UPDATE_DECORATION_INVENTORY);
              }
            });
          } else {
            this.children = new VoxelData.DECORATIONS_TYPE[index](this);
          }
        }
        break;
      case ChildrenTypeEnum.SEED:
        {
          if (!isInit) {
            const input: CreatePlantBlockLandDTO = {
              id: this.scene.land.id,
              blockPos: { x, y },
              plantIndex: index,
            };

            createPlantBlockLand(input, (response) => {
              console.log(response);
              if (response.error) return;
              this.children = new VoxelData.PLANTS_TYPE[index](this, new Date());
              event.emit(EventEnum.UPDATE_PLANTATION_INVENTORY);
            });
          } else {
            this.children = new VoxelData.PLANTS_TYPE[index](this, updateAt);
          }
        }
        break;
      default:
        console.warn(`Unhandled type: ${type}`);
        break;
    }

    return this;
  }

  public enableInteraction(): void {
    this.sprite.setInteractive({ pixelPerfect: true });
  }

  public disableInteraction(): void {
    this.sprite.disableInteractive();
  }

  public onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (pointer.button !== 0 || this.scene.isMouseOverHTMLElement()) return;
    if (this.scene.gameMode === GameModeEnum.BUILDER) {
      const item = this.scene.hotbar.item;

      if (item !== null && item.category !== null) {
        this.setChildren(item.id, item.category);
      } else {
        if (item !== null) {
          const { x, y } = this.position;

          const blockSetter = {
            id: item.id,
            children: null,
          };

          const input: CreateBlockLandDTO = {
            id: this.scene.land.id,
            blockPos: { x, y },
            blockIndex: blockSetter.id,
          };

          createBlockLand(input, ({ error }) => {
            if (error) return;
            this.world.setBlock(this, blockSetter);
            event.emit(EventEnum.UPDATE_BLOCK_INVENTORY);
          });
        }
      }
    }
  }

  public onPointerOver(): void {
    if (this.scene.isMouseOverHTMLElement()) {
      this.onPointerOut();
      return;
    }

    if (this.scene.gameMode !== GameModeEnum.BUILDER && !this.isInteractive) return;
    this.scene.input.setDefaultCursor('pointer');
    this.setOutline(true);
  }

  public onPointerOut(): void {
    this.scene.input.setDefaultCursor('default');
    if (!this.isSelected) this.setOutline(false);
  }
}
