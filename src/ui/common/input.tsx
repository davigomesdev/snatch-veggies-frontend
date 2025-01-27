import { useScreenSizeStage } from '@/hooks/use-screen-size-stage';
import Sprite from './sprite';

const variants = {
  normal: {
    image: '/ui/inputs/input.png',
    size: 800,
  },
  small: {
    image: '/ui/inputs/input-small.png',
    size: 480,
  },
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: number;
  variant?: 'normal' | 'small';
}

const Input: React.FC<InputProps> = ({ size = 50, variant = 'normal', ...props }) => {
  const { getCurrentSizeStage } = useScreenSizeStage();

  return (
    <div className="relative flex items-center justify-center">
      <Sprite src={variants[variant].image} width={variants[variant].size} />
      <input
        {...props}
        type="text"
        style={{ fontSize: getCurrentSizeStage(size) }}
        className="absolute top-0 z-10 h-full w-full border-none bg-transparent text-center text-white outline-none"
      />
    </div>
  );
};

export default Input;
