import { TVector2 } from '@/core/types/vector2.type';
import { TVector3 } from '@/core/types/vector3.type';

import { VoxelScene } from '../voxel/voxel-scene';

export class Chicken {
  private readonly MOVEMENT_RADIUS = 15;
  private readonly MOVEMENT_SPEED = 50;
  private readonly SCRATCH_DURATION = 1000;

  private SCRATCH_INTERVAL = this.getRandomScratchInterval();

  public scene: VoxelScene;

  public position: TVector3;
  public chickenSprite: Phaser.GameObjects.Sprite;

  private moveTarget: TVector2;
  private initialPosition: TVector2;
  private moveTimer: number;
  private currentMovementDuration: number;
  private lastDirection: number = 1;
  private isScratching: boolean = false;
  private scratchTimer: number = 0;

  constructor(scene: VoxelScene, position: TVector3) {
    this.scene = scene;
    this.position = position;

    this.initialPosition = position;

    this.chickenSprite = this.scene.add.sprite(
      this.initialPosition.x,
      this.initialPosition.y,
      'chicken-idle',
    );
    this.chickenSprite.setDepth(this.position.z);

    this.chickenSprite.play('chicken-idle', true);

    this.moveTarget = { ...this.initialPosition };
    this.moveTimer = 0;
    this.currentMovementDuration = Phaser.Math.Between(2000, 4000);

    this.scene.events.on('update', this.update, this);
  }

  private update(_time: number, delta: number): void {
    this.scratchTimer += delta;

    if (!this.isScratching && this.scratchTimer >= this.SCRATCH_INTERVAL) {
      this.isScratching = true;
      this.scratchTimer = 0;
      this.SCRATCH_INTERVAL = this.getRandomScratchInterval();
      this.chickenSprite.play('chicken-scratch', true);
    }

    if (this.isScratching && this.scratchTimer >= this.SCRATCH_DURATION) {
      this.isScratching = false;
      this.scratchTimer = 0;
      this.chickenSprite.play('chicken-idle', true);
    }

    if (this.isScratching) {
      return;
    }

    this.moveTimer += delta;

    if (this.moveTimer >= this.currentMovementDuration) {
      this.generateNewTarget();
      this.moveTimer = 0;
      this.currentMovementDuration = Phaser.Math.Between(2000, 4000);
    }

    const dx = this.moveTarget.x - this.chickenSprite.x;
    const dy = this.moveTarget.y - this.chickenSprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      const moveX = (dx / distance) * this.MOVEMENT_SPEED * (delta / 1000);
      const moveY = (dy / distance) * this.MOVEMENT_SPEED * (delta / 1000);

      this.chickenSprite.setPosition(this.chickenSprite.x + moveX, this.chickenSprite.y + moveY);

      if (Math.abs(moveX) > 0.01) {
        if (moveX > 0) {
          this.lastDirection = 1;
          this.chickenSprite.setFlipX(false);
        } else {
          this.lastDirection = -1;
          this.chickenSprite.setFlipX(true);
        }
      }
    }

    const distanceFromStart = Math.sqrt(
      Math.pow(this.chickenSprite.x - this.initialPosition.x, 2) +
        Math.pow(this.chickenSprite.y - this.initialPosition.y, 2),
    );

    if (distanceFromStart > this.MOVEMENT_RADIUS) {
      const angle = Math.atan2(
        this.chickenSprite.y - this.initialPosition.y,
        this.chickenSprite.x - this.initialPosition.x,
      );
      this.chickenSprite.setPosition(
        this.initialPosition.x + Math.cos(angle) * this.MOVEMENT_RADIUS,
        this.initialPosition.y + Math.sin(angle) * this.MOVEMENT_RADIUS,
      );
    }
  }

  private getRandomScratchInterval(): number {
    return Phaser.Math.Between(3000, 8000);
  }

  private generateNewTarget(): void {
    const newDirection = -this.lastDirection;
    const baseAngle = newDirection > 0 ? 0 : Math.PI;
    const angle = baseAngle + Phaser.Math.FloatBetween(-Math.PI / 4, Math.PI / 4);
    const distance = Phaser.Math.FloatBetween(this.MOVEMENT_RADIUS / 2, this.MOVEMENT_RADIUS);

    this.moveTarget = {
      x: this.initialPosition.x + Math.cos(angle) * distance,
      y: this.initialPosition.y + Math.sin(angle) * distance,
    };
  }

  public destroy(): void {
    this.scene.events.off('update', this.update, this);
    this.chickenSprite.destroy();
  }
}
