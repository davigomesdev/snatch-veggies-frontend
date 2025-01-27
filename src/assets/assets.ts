import { TImage } from '@/core/types/image.type';
import { TSpriteSheet } from '@/core/types/sprite-sheet.type';

import { image, spritesheet } from './asset.util';

export const images: TImage[] = [
  image('blocks/outline-block', 'outline-block'),
  image('blocks/outline-slab', 'outline-slab'),

  image('blocks/air', 'air'),
  image('blocks/dirt', 'dirt'),
  image('blocks/plowed-dirt', 'plowed-dirt'),
  image('blocks/grass', 'grass'),
  image('blocks/grass-clump', 'grass-clump'),
  image('blocks/grass-blades', 'grass-blades'),
  image('blocks/grass-cover', 'grass-cover'),
  image('blocks/sand', 'sand'),

  image('decorations/flower', 'flower'),
  image('decorations/flowers', 'flowers'),
  image('decorations/stem', 'stem'),
  image('decorations/house', 'house'),
  image('decorations/tree', 'tree'),
  image('decorations/tree-small', 'tree-small'),

  image('structs/chicken-coop', 'chicken-coop'),
];

export const spritesheets: TSpriteSheet[] = [
  spritesheet('blocks/water', 'water', 32, 32),
  spritesheet('blocks/water-dirt', 'water-dirt', 32, 32),

  spritesheet('plants/wheat', 'wheat', 32, 32),
  spritesheet('plants/pumpkin', 'pumpkin', 32, 32),

  spritesheet('structs/boat', 'boat', 130, 72),

  spritesheet('entities/chicken/chicken-idle', 'chicken-idle', 21, 21),
  spritesheet('entities/chicken/chicken-scratch', 'chicken-scratch', 21, 21),
];
