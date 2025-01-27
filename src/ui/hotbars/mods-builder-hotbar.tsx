import { useHotbar } from '../common/hotbar';

import Sprite from '../common/sprite';
import Text from '../common/text';

import BlockBuilderHotbar from './block-builder-hotbar';
import StructBuilderHotbar from './struct-builder-hotbar';
import DecorationBuilderHotbar from './decoration-builder-hotbar';

const ModsBuilderHotbar: React.FC = () => {
  const { openHotbar } = useHotbar();

  return (
    <div className="flex w-fit flex-col items-center justify-center gap-2 p-2">
      <ul className="flex items-center gap-2 p-2">
        <BuilderCategoryItem
          name="BLOCKS"
          onClick={() => openHotbar(<BlockBuilderHotbar />, true)}
          image="category-blocks-icon"
        />
        <BuilderCategoryItem
          name="STRUCTS"
          onClick={() => openHotbar(<StructBuilderHotbar />, true)}
          image="category-structs-icon"
        />
        <BuilderCategoryItem
          name="DECORATIONS"
          onClick={() => openHotbar(<DecorationBuilderHotbar />, true)}
          image="category-decorations-icon"
        />
      </ul>
    </div>
  );
};

interface BuilderCategoryItemProps {
  name: string;
  image: string;
  onClick: () => void;
}

const BuilderCategoryItem: React.FC<BuilderCategoryItemProps> = ({ name, image, onClick }) => {
  return (
    <button onClick={onClick} className="cursor-pointer space-y-20 transition hover:scale-[1.1]">
      <div className="relative flex h-full w-full flex-col items-center">
        <Text size={47}>{name}</Text>
        <div className="relative flex h-full w-full flex-col items-center">
          <Sprite src="/ui/bg-hud-small.png" width={310} />
          <div className="absolute z-10 flex h-full flex-col items-center justify-center">
            <Sprite src={`/ui/${image}.png`} height={200} />
          </div>
        </div>
      </div>
    </button>
  );
};

export default ModsBuilderHotbar;
