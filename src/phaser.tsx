import { useEffect, useRef } from 'react';

import { GameScene } from './scenes/game.scene';
import { LandScene } from './scenes/land.scene';
import { PreloadScene } from './scenes/preload.scene';

export const config: Phaser.Types.Core.GameConfig = {
  title: 'Snatch Veggies',
  type: Phaser.AUTO,
  antialias: false,
  backgroundColor: '#B3DBBC',
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
  scene: [PreloadScene, GameScene, LandScene],
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    powerPreference: 'low-power',
  },
  fps: {
    forceSetTimeOut: true,
  },
};

const PhaserGame: React.FC = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} className="game-container" />;
};

export default PhaserGame;
