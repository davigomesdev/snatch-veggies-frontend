import { TBlockSetter } from '@/core/types/block-setter';

import { ChildrenTypeEnum } from '@/core/enums/children-type.enum';

import { Block } from './block';
import { Struct } from './struct';
import { Plant } from './plant';
import { Decoration } from './decoration';

import { AirPrefab } from '@/prefabs/blocks/air.prefab';
import { DirtPrefab } from '@/prefabs/blocks/dirt.prefab';
import { PlowedDirtPrefab } from '@/prefabs/blocks/plowed-dirt.prefab';
import { WaterDirtPrefab } from '@/prefabs/blocks/water-dirt.prefab';
import { GrassPrefab } from '@/prefabs/blocks/grass.prefab';
import { GrassClumpPrefab } from '@/prefabs/blocks/grass-clump.prefab';
import { GrassBladesPrefab } from '@/prefabs/blocks/grass-blades.prefab';
import { GrassCoverPrefab } from '@/prefabs/blocks/grass-cover.prefab';
import { SandPrefab } from '@/prefabs/blocks/sand.prefab';

import { ChickenCoopPrefab } from '@/prefabs/structs/chicken-coop.prefab';

import { FlowerPrefab } from '@/prefabs/decorations/flower.prefab';
import { FlowersPrefab } from '@/prefabs/decorations/flowers.prefab';
import { StemPrefab } from '@/prefabs/decorations/stem.prefab';
import { HousePrefab } from '@/prefabs/decorations/house.prefab';
import { TreePrefab } from '@/prefabs/decorations/tree.prefab';
import { TreeSmallPrefab } from '@/prefabs/decorations/tree-small.prefab';

import { WheatPrefab } from '@/prefabs/plants/wheat.prefab';
import { PumpkinPrefab } from '@/prefabs/plants/pumpkin.prefab';

export class VoxelData {
  public static readonly WIDTH: number = 60;
  public static readonly HEIGHT: number = 60;
  public static readonly BLOCK_SIZE: number = 32;

  public static readonly BLOCK_TYPES: (new (...args: any[]) => Block)[] = [
    AirPrefab,
    DirtPrefab,
    PlowedDirtPrefab,
    WaterDirtPrefab,
    GrassPrefab,
    GrassClumpPrefab,
    GrassBladesPrefab,
    GrassCoverPrefab,
    SandPrefab,
  ];

  public static readonly STRUCTS_TYPE: (new (...args: any[]) => Struct)[] = [ChickenCoopPrefab];

  public static readonly DECORATIONS_TYPE: (new (...args: any[]) => Decoration)[] = [
    FlowerPrefab,
    FlowersPrefab,
    StemPrefab,
    HousePrefab,
    TreePrefab,
    TreeSmallPrefab,
  ];

  public static readonly PLANTS_TYPE: (new (...args: any[]) => Plant)[] = [
    WheatPrefab,
    PumpkinPrefab,
  ];

  public static saveGrid(layer: Block[][]): void {
    const jsonData: TBlockSetter[][] = layer.map((row) =>
      row.map((block) => {
        let childrenData = null;

        if (block.children) {
          if (block.children instanceof Decoration) {
            childrenData = {
              id: VoxelData.DECORATIONS_TYPE.indexOf(block.children.constructor as any),
              type: ChildrenTypeEnum.DECORATION,
            };
          } else if (block.children instanceof Plant) {
            childrenData = {
              id: VoxelData.PLANTS_TYPE.indexOf(block.children.constructor as any),
              type: ChildrenTypeEnum.SEED,
            };
          }
        }

        return {
          id: VoxelData.BLOCK_TYPES.indexOf(block.constructor as any),
          children: childrenData,
        };
      }),
    );

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'map.json';

    link.click();
    URL.revokeObjectURL(url);
  }
}
