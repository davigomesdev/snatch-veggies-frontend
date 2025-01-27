import { cn } from '@/scripts/utils/cn.util';
import Sprite from './sprite';
import Text from './text';

export interface ModalProps {
  title?: string;
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, isOpen, className, onClose }) => {
  return (
    <div
      className={cn(
        'min-w-screen fixed inset-0 z-50 flex min-h-screen items-center justify-center p-5 backdrop-blur transition-colors',
        isOpen ? 'visible bg-black/50' : 'invisible',
      )}
    >
      <div
        className={cn(
          'relative flex w-full max-w-[675px] flex-col items-center justify-center border-[3px] border-[#431c0e] bg-[#b3693e] p-1 shadow transition-all',
          isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="absolute -top-3 z-50 flex items-center justify-center md:-top-3 lg:-top-5">
            <Sprite src="/ui/tag-menu-name.png" width={800} />
            <Text size={57} className="absolute">
              {title}
            </Text>
          </div>
        )}
        <button className="absolute -right-[5px] -top-[5px] z-10" onClick={onClose}>
          <Sprite src="/ui/buttons/button-close-modal.png" width={90} />
        </button>
        <Sprite
          src="/ui/edge-top-left.png"
          width={80}
          className="absolute -left-1 -top-1 z-50 md:-left-2 md:-top-2"
        />
        <Sprite
          src="/ui/edge-bottom-left.png"
          width={80}
          className="absolute -bottom-1 -left-1 z-50 md:-bottom-2 md:-left-2"
        />
        <Sprite
          src="/ui/edge-bottom-right.png"
          width={80}
          className="absolute -bottom-1 -right-1 z-50 md:-bottom-2 md:-right-2"
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
