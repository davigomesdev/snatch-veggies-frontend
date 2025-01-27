import { EventEnum } from '@/core/enums/event.enum';

import event from '@/scripts/systems/event';
import Sprite from '../common/sprite';

const HouseButton: React.FC = () => {
  const handleOnClick = (): void => {
    event.emit(EventEnum.RETURN);
  };

  return (
    <button className="cursor-pointer space-y-2" onClick={handleOnClick}>
      <div className="relative flex items-center justify-center">
        <Sprite src="/ui/bg-hud-action-small.png" width={310} />
        <Sprite src="/ui/house-icon.png" width={210} className="absolute z-10" />
      </div>
    </button>
  );
};

export default HouseButton;
