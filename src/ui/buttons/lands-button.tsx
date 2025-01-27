import { useModal } from '@/providers/modal-provider';

import Sprite from '../common/sprite';
import LandsModal from '../modals/lands-modal';

const LandsButton: React.FC = () => {
  const { openModal } = useModal();

  const handleOnClick = (): void => {
    openModal(<LandsModal />, 'WORLD MAPS');
  };

  return (
    <button className="cursor-pointer space-y-2" onClick={handleOnClick}>
      <div className="relative flex items-center justify-center">
        <Sprite src="/ui/bg-hud-action-big.png" width={450} />
        <Sprite src="/ui/map.png" width={320} className="absolute z-10" />
      </div>
    </button>
  );
};

export default LandsButton;
