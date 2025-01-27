import { cn } from '@/scripts/utils/cn.util';

import React from 'react';
import { useScreenSizeStage } from '@/hooks/use-screen-size-stage';

export interface SpriteProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
}

const Sprite = React.forwardRef<HTMLImageElement, SpriteProps>(
  ({ width, height, minWidth, minHeight, style, className, ...props }, ref) => {
    const { getCurrentSizeStage } = useScreenSizeStage();

    return (
      <img
        className={cn('object-pixelated', className)}
        alt="sprite"
        ref={ref}
        style={{
          width: width && getCurrentSizeStage(width),
          height: height && getCurrentSizeStage(height),
          minWidth: minWidth && getCurrentSizeStage(minWidth),
          minHeight: minHeight && getCurrentSizeStage(minHeight),
          ...style,
        }}
        {...props}
      />
    );
  },
);
Sprite.displayName = 'Sprite';

export default Sprite;
