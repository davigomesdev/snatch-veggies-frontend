import event from '@/scripts/systems/event';

import { EventEnum } from '@/core/enums/event.enum';

import Sprite from '../common/sprite';

const ZoomMinusButton: React.FC = () => {
  const handleOnClick = (): void => {
    event.emit(EventEnum.SET_ZOOM, -0.3);
  };

  return (
    <button className="cursor-pointer" onClick={handleOnClick}>
      <div className="relative flex items-center justify-center">
        <Sprite src="/ui/buttons/zoom-minus-button.png" width={150} />
      </div>
    </button>
  );
};

export default ZoomMinusButton;
