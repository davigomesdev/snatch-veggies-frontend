import { useState, useEffect, useCallback } from 'react';

export const useScreenSizeStage = () => {
  const getStage = (width: number): number => {
    switch (true) {
      case width < 400:
        return 6;
      case width < 768:
        return 5;
      case width >= 768 && width < 1200:
        return 4;
      default:
        return 3;
    }
  };

  const [stage, setStage] = useState<number>(getStage(window.innerWidth));

  const getCurrentSizeStage = useCallback(
    (principal: number): number => {
      return Math.round(principal / stage);
    },
    [stage],
  );

  useEffect(() => {
    const handleResize = (): void => {
      setStage(getStage(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { stage, getCurrentSizeStage };
};
