import { useModal } from '@/providers/modal-provider';

import Sprite from '../common/sprite';
import ShopModal from '../modals/shop-modal';

const ShopButton: React.FC = () => {
  const { toggleModal } = useModal();

  const handleToggleShopModal = (): void => {
    toggleModal(<ShopModal />, 'SHOP', 'w-fit max-w-[896px]');
  };

  return (
    <button className="cursor-pointer space-y-2" onClick={handleToggleShopModal}>
      <div className="relative flex items-center justify-center">
        <Sprite src="/ui/bg-hud-big.png" width={450} />
        <Sprite src="/ui/shop.png" width={330} className="absolute z-10" />
      </div>
    </button>
  );
};

export default ShopButton;
