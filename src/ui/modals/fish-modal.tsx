import { BASE_URL_STATIC } from '@/constants/api-url';

import { IFishInventory } from '@/core/interfaces/fish-inventory.interface';

import Text from '../common/text';
import Button from '../common/button';
import Sprite from '../common/sprite';

interface FishModalProps {
  fishInventory: IFishInventory;
  onClose: () => void;
}

const FishModal: React.FC<FishModalProps> = ({ fishInventory, onClose }) => {
  return (
    <div className="flex items-center justify-center p-5 py-10">
      <div className="top-0 flex h-full flex-col items-center justify-center gap-2 md:gap-5">
        <Text size={70} className="uppercase">
          {fishInventory.fish!.name}
        </Text>
        <Sprite src={`${BASE_URL_STATIC}fish/${fishInventory.fish!.image}`} width={350} />
        <Button size="small" className="mt-5" onClick={onClose}>
          <Text size={70}>CLAIM</Text>
        </Button>
      </div>
    </div>
  );
};

export default FishModal;
