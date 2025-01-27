import { TAudio } from '@/core/types/audio.type';
import { TImage } from '@/core/types/image.type';
import { TJSON } from '@/core/types/json.type';
import { TSpriteSheet } from '@/core/types/sprite-sheet.type';

const imageGlob = import.meta.glob<string>('./images/**/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
});

const musicGlob = import.meta.glob<string>('./music/**/*.mp3', {
  query: '?url',
  import: 'default',
  eager: true,
});

const audioGlob = import.meta.glob<string>('./sounds/**/*.mp3', {
  query: '?url',
  import: 'default',
  eager: true,
});

const fontGlob = import.meta.glob<string>('./fonts/**/*.ttf', {
  query: '?url',
  import: 'default',
  eager: true,
});

export const jsonGlob = import.meta.glob<string>('./tilemaps/**/*.json', {
  query: '?url',
  import: 'default',
  eager: true,
});

export const image = (path: string, key: string): TImage => {
  return { key, path: imageGlob[`./images/${path}.png`] };
};

export const spritesheet = (
  path: string,
  key: string,
  width: number,
  height: number,
): TSpriteSheet => {
  return { key, width, height, path: imageGlob[`./images/${path}.png`] };
};

export const music = (path: string, key: string, volume?: number, rate?: number): TAudio => {
  return { key, volume, rate, path: musicGlob[`./music/${path}.mp3`] };
};

export const sound = (path: string, key: string, volume?: number, rate?: number): TAudio => {
  return { key, volume, rate, path: audioGlob[`./sounds/${path}.mp3`] };
};

export const json = (path: string, key: string): TJSON => {
  return { key, path: jsonGlob[`./tilemaps/${path}.json`] };
};

export const loadFont = async (path: string, name: string): Promise<void> => {
  const face = new FontFace(name, `url(${fontGlob[`./fonts/${path}.ttf`]})`, {
    style: 'normal',
    weight: '400',
  });
  await face.load();
  document.fonts.add(face);
};
