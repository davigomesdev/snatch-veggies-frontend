import React from 'react';
import Sprite from './sprite';
import { cn } from '@/scripts/utils/cn.util';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger';
  size?: 'medium' | 'small';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'medium', className, children, ...props }, ref) => {
    const variants = {
      default: {
        medium: {
          image: '/ui/buttons/button.png',
          size: 800,
        },
        small: {
          image: '/ui/buttons/button-small.png',
          size: 300,
        },
      },
      danger: {
        medium: {
          image: '/ui/buttons/danger-button.png',
          size: 800,
        },
        small: {
          image: '/ui/buttons/danger-button-small.png',
          size: 300,
        },
      },
    };

    return (
      <button
        className={cn('relative flex items-center justify-center', className)}
        ref={ref}
        {...props}
      >
        <Sprite src={variants[variant][size].image} width={variants[variant][size].size} />
        <div className="absolute flex items-center space-x-2">{children}</div>
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
