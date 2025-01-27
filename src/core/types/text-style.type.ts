import { ColorEnum } from '../enums/color.enum';

export type TTextStyle = {
  fontFamily?: string;
  x?: number;
  y?: number;
  size?: number;
  weight?: number;
  color?: ColorEnum;
  alpha?: number;
  text?: string;
  wrapWidth: number;
};
