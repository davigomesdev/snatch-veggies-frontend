import event from '@/scripts/systems/event';

import { EventEnum } from '@/core/enums/event.enum';
import { GameModeEnum } from '@/core/enums/game-mode.enum';

import { useHotbar } from '../common/hotbar';

import Sprite from '../common/sprite';

const MouseButton: React.FC = () => {
  const { closeHotbar } = useHotbar();

  const handleOnClick = (): void => {
    closeHotbar();
    event.emit(EventEnum.SET_GAME_MODE, GameModeEnum.MOUSE);
  };

  return (
    <button className="cursor-pointer space-y-2" onClick={handleOnClick}>
      <div className="relative flex items-center justify-center">
        <Sprite src="/ui/bg-hud-super-small.png" width={230} />
        <Sprite src="/ui/mouse-icon.png" width={100} className="absolute z-10 ml-[8%]" />
      </div>
    </button>
  );
};

export default MouseButton;