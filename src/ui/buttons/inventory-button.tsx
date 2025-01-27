import { useModal } from '@/providers/modal-provider';

import Sprite from '../common/sprite';
import InventoryModal from '../modals/inventory-modal';

const InventoryButton: React.FC = () => {
  const { toggleModal } = useModal();

  const handleToggleInventoryModal = (): void => {
    toggleModal(<InventoryModal />, 'INVENTORY', 'w-fit max-w-[896px]');
  };

  return (
    <button className="cursor-pointer space-y-2" onClick={handleToggleInventoryModal}>
      <div className="relative flex items-center justify-center">
        <Sprite src="/ui/bg-hud-small.png" width={310} />
        <Sprite src="/ui/inventory.png" width={240} className="absolute z-10" />
      </div>
    </button>
  );
};

export default InventoryButton;
