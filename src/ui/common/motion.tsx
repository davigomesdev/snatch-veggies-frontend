import React from 'react';
import { cn } from '@/scripts/utils/cn.util';

export interface MotionProps extends React.HTMLAttributes<HTMLDivElement> {}

const Motion = React.forwardRef<HTMLDivElement, MotionProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'animate-fade-in opacity-0 transition-opacity duration-500 ease-in-out',
        className,
      )}
      {...props}
    />
  );
});
Motion.displayName = 'Motion';

export default Motion;
