import { Block } from '@/scripts/voxel/block';
import { Struct } from '@/scripts/voxel/struct';

import { Chicken } from '@/scripts/entities/chicken';

export class ChickenCoopPrefab extends Struct {
  public chicken1: Chicken;
  public chicken2: Chicken;

  public constructor(tile: Block, prevClaimDate: Date) {
    super(
      tile,
      'Chicken Coop',
      'chicken-coop',
      prevClaimDate,
      2,
      { x: 5, y: 5 },
      { x: 0, y: 65, z: 10 },
    );
    const { x, y } = this.getSpritePosition();

    const chicken1PosY = y + 60;
    const chicken1PosX = x + 30;

    const chicken2PosY = y + 65;
    const chicken2PosX = x - 20;

    this.chicken1 = new Chicken(this.scene, {
      x: chicken1PosX,
      y: chicken1PosY,
      z: this.sprite.depth + 1,
    });
    this.chicken2 = new Chicken(this.scene, {
      x: chicken2PosX,
      y: chicken2PosY,
      z: this.sprite.depth + 1,
    });
  }

  public override destroy(): void {
    this.chicken1.destroy();
    this.chicken2.destroy();
    super.destroy();
  }
}
