import { eventMain } from '@/scripts/systems/event';
import PhaserGame from '@/phaser';

import { EventEnum } from '@/core/enums/event.enum';
import { SceneNameEnum } from '@/core/enums/scene-name.enum';

import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';

import { initializeSocket } from '@/scripts/services/socket/socket.config';

import MainHUD from '../hud/main-hud';
import VisitorHUD from '../hud/visitor-hud';

const Game: React.FC = () => {
  useAuth();

  const [hud, setHUD] = useState<React.JSX.Element | null>(null);

  useEffect(() => {
    initializeSocket();

    eventMain.on(EventEnum.MAP_LOADED, (scene: SceneNameEnum) => {
      if (scene == SceneNameEnum.GAME) setHUD(<MainHUD />);
      if (scene == SceneNameEnum.LAND) setHUD(<VisitorHUD />);
    });

    return () => {
      eventMain.clear();
    };
  }, []);

  return (
    <main>
      <PhaserGame />
      {hud}
    </main>
  );
};

export default Game;
