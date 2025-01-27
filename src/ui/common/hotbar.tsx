import React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/scripts/utils/cn.util';

interface HotbarContextType {
  isOpen: boolean;
  openHotbar: (content: React.ReactNode, isFixed?: boolean) => void;
  closeHotbar: () => void;
}

interface HotbarProviderProps {
  children: React.ReactNode;
}

const HotbarContext = React.createContext<HotbarContextType>({
  isOpen: false,
  openHotbar: () => {},
  closeHotbar: () => {},
});

interface HotbarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
}

const Hotbar = React.forwardRef<HTMLDivElement, HotbarProps>(
  ({ className, isOpen, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'fixed bottom-0 left-1/2 z-40 w-fit -translate-x-1/2 transition-[transform] duration-300 ease-in-out',
        isOpen ? 'translate-y-0' : 'translate-y-full',
        className,
      )}
      {...props}
    />
  ),
);

export const HotbarProvider: React.FC<HotbarProviderProps> = ({ children }) => {
  const hotbarRef = React.useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = React.useState(false);

  const [currentContent, setCurrentContent] = React.useState<{
    content: React.ReactNode;
    key: string;
    isFixed: boolean;
  } | null>(null);

  const [pendingContent, setPendingContent] = React.useState<{
    content: React.ReactNode;
    key: string;
    isFixed: boolean;
  } | null>(null);

  const openHotbar = React.useCallback((content: React.ReactNode, isFixed: boolean = false) => {
    setCurrentContent({
      content,
      key: uuidv4(),
      isFixed,
    });
    setIsOpen(true);
  }, []);

  const closeHotbar = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isOpen && pendingContent) {
      timeoutId = setTimeout(() => {
        setCurrentContent(pendingContent);
        setIsOpen(true);
        setPendingContent(null);
      }, 300);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen, pendingContent]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        isOpen &&
        hotbarRef.current &&
        !hotbarRef.current.contains(event.target as Node) &&
        !currentContent?.isFixed
      ) {
        closeHotbar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, closeHotbar, currentContent]);

  return (
    <HotbarContext.Provider value={{ isOpen, openHotbar, closeHotbar }}>
      {children}
      <Hotbar ref={hotbarRef} isOpen={isOpen}>
        {currentContent && <div key={currentContent.key}>{currentContent.content}</div>}
      </Hotbar>
    </HotbarContext.Provider>
  );
};

export const useHotbar = () => {
  const context = React.useContext(HotbarContext);
  if (!context) {
    throw new Error('useHotbar must be used within a HotbarProvider');
  }
  return context;
};

export default Hotbar;
