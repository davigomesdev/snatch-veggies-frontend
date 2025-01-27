import { cn } from '@/scripts/utils/cn.util';

import React from 'react';
import { useScreenSizeStage } from '@/hooks/use-screen-size-stage';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size: number;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ size, className, ...props }, ref) => {
    const { getCurrentSizeStage } = useScreenSizeStage();

    return (
      <p
        ref={ref}
        style={{
          fontSize: getCurrentSizeStage(size),
          textShadow: '-2px 2px 0 black',
        }}
        className={cn('text-center text-white', className)}
        {...props}
      />
    );
  },
);
Text.displayName = 'Text';

export default Text;
