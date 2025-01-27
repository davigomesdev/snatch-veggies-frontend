import { BASE_URL_STATIC } from '@/constants/api-url';

import { TResponse } from '@/core/types/response.type';

import { IUser } from '@/core/interfaces/user.interface';
import { IBlock } from '@/core/interfaces/block.interface';
import { IPlant } from '@/core/interfaces/plant.interface';
import { IStruct } from '@/core/interfaces/struct.interface';
import { IDecoration } from '@/core/interfaces/decoration.interface';

import { currentUser } from '@/scripts/services/axios/requests/user/user.service';
import { listBlocks } from '@/scripts/services/axios/requests/block/block.service';
import { listStructs } from '@/scripts/services/axios/requests/struct/struct.service';
import { listPlants } from '@/scripts/services/axios/requests/plant/plant.service';
import { listDecorations } from '@/scripts/services/axios/requests/decoration/decoration.service';

import { cn } from '@/scripts/utils/cn.util';

import { useState } from 'react';
import { useScreenSizeStage } from '@/hooks/use-screen-size-stage';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import Text from '../common/text';
import Sprite from '../common/sprite';
import SeedPopupShop from '../partials/seed-popup-shop';
import BlockPopupShop from '../partials/block-popup-shop';
import StructPopupShop from '../partials/struct-popup-shop';
import DecorationPopupShop from '../partials/decoration-popup-shop';

export enum CategoryEnum {
  BLOCKS,
  STRUCTS,
  DECORATIONS,
  SEEDS,
}

interface MenuButtonProps {
  image: string;
  isActive: boolean;
  onClick: () => void;
}

interface SlotProps {
  name: string;
  price: number;
  image: string;
  disabled: boolean;
  onClick: () => void;
}

const ShopModal: React.FC = () => {
  const { stage, getCurrentSizeStage } = useScreenSizeStage();

  const [popup, setPopup] = useState<React.JSX.Element | null>(null);
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.SEEDS);

  const { data: user } = useQuery<TResponse<IUser>>({
    queryKey: ['user'],
    queryFn: async () => {
      return await currentUser();
    },
  });

  const { data: blocks } = useQuery<TResponse<IBlock[]>>({
    queryKey: ['blocks'],
    queryFn: async () => {
      return await listBlocks({
        isVisible: true,
      });
    },
    placeholderData: keepPreviousData,
  });

  const { data: decorations } = useQuery<TResponse<IDecoration[]>>({
    queryKey: ['decorations'],
    queryFn: async () => {
      return await listDecorations({
        isVisible: true,
      });
    },
    placeholderData: keepPreviousData,
  });

  const { data: structs } = useQuery<TResponse<IStruct[]>>({
    queryKey: ['structs'],
    queryFn: async () => {
      return await listStructs({
        isVisible: true,
      });
    },
    placeholderData: keepPreviousData,
  });

  const { data: plants } = useQuery<TResponse<IPlant[]>>({
    queryKey: ['plants'],
    queryFn: async () => {
      return await listPlants({
        isVisible: true,
      });
    },
    placeholderData: keepPreviousData,
  });

  const handleOnClickSetCategory = (category: CategoryEnum) => {
    setCategory(category);
    setPopup(null);
  };

  const handleOnClickSetPopup = (popup: React.JSX.Element) => {
    setPopup(popup);
  };

  return (
    <>
      <div className="flex w-full items-end justify-center bg-[#431c0e] px-4 pt-8">
        <MenuButton
          image="/ui/category-seeds-icon.png"
          isActive={category === CategoryEnum.SEEDS}
          onClick={() => handleOnClickSetCategory(CategoryEnum.SEEDS)}
        />
        <MenuButton
          image="/ui/category-blocks-icon.png"
          isActive={category === CategoryEnum.BLOCKS}
          onClick={() => handleOnClickSetCategory(CategoryEnum.BLOCKS)}
        />
        <MenuButton
          image="/ui/category-decorations-icon.png"
          isActive={category === CategoryEnum.DECORATIONS}
          onClick={() => handleOnClickSetCategory(CategoryEnum.DECORATIONS)}
        />
        <MenuButton
          image="/ui/category-structs-icon.png"
          isActive={category === CategoryEnum.STRUCTS}
          onClick={() => handleOnClickSetCategory(CategoryEnum.STRUCTS)}
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${stage >= 5 ? 3 : 5}, ${getCurrentSizeStage(450)}px)`,
          gridTemplateRows: 'repeat(auto-fill, ' + getCurrentSizeStage(650) + 'px)',
          scrollbarWidth: 'none',
          scrollbarColor: 'transparent transparent',
        }}
        className="relative h-[calc(100vh-320px)] min-h-[200px] w-full gap-2 overflow-y-auto border-[3px] border-b-0 border-[#431c0e] bg-[#693616] p-3 pt-5"
      >
        {user &&
          category === CategoryEnum.BLOCKS &&
          blocks && [
            ...blocks.data.map((item) => (
              <Slot
                key={item.id}
                name={item.name}
                price={item.price}
                image={`${BASE_URL_STATIC}block/${item.image}`}
                disabled={user.data.gold < item.price}
                onClick={() => handleOnClickSetPopup(<BlockPopupShop id={item.id} />)}
              />
            )),
            ...Array.from({ length: 30 }, (_, index) => <SlotNone key={index} />),
          ]}
        {user &&
          category === CategoryEnum.DECORATIONS &&
          decorations && [
            ...decorations.data.map((item) => (
              <Slot
                key={item.id}
                name={item.name}
                price={item.price}
                image={`${BASE_URL_STATIC}decoration/${item.image}`}
                disabled={user.data.gold < item.price}
                onClick={() => handleOnClickSetPopup(<DecorationPopupShop id={item.id} />)}
              />
            )),
            ...Array.from({ length: 30 }, (_, index) => <SlotNone key={index} />),
          ]}
        {user &&
          category === CategoryEnum.STRUCTS &&
          structs && [
            ...structs.data.map((item) => (
              <Slot
                key={item.id}
                name={item.name}
                price={item.price}
                image={`${BASE_URL_STATIC}struct/${item.image}`}
                disabled={user.data.gold < item.price}
                onClick={() => handleOnClickSetPopup(<StructPopupShop id={item.id} />)}
              />
            )),
            ...Array.from({ length: 30 }, (_, index) => <SlotNone key={index} />),
          ]}
        {user &&
          category === CategoryEnum.SEEDS &&
          plants && [
            ...plants.data.map((item) => (
              <Slot
                key={item.id}
                name={item.name}
                price={item.price}
                image={`${BASE_URL_STATIC}plant/${item.image}`}
                disabled={user.data.gold < item.price}
                onClick={() => handleOnClickSetPopup(<SeedPopupShop id={item.id} />)}
              />
            )),
            ...Array.from({ length: 30 }, (_, index) => <SlotNone key={index} />),
          ]}
      </div>
      {popup && <div className="relative w-full">{popup}</div>}
      <div className="w-full border-y-[3px] border-[#431c0e] p-[2px]" />
      <div className="w-full border-[3px] border-t-0 border-[#431c0e] bg-[#693616] p-5">
        <div className="relative flex w-full items-center justify-center">
          <div className="relative z-10 flex items-center justify-center gap-2">
            <Sprite src="/ui/coin.png" width={110} />
            <Text size={70}>{user ? user.data.gold : 0}</Text>
          </div>
          <Sprite src="/ui/bg-wallet.png" width={800} className="absolute" />
        </div>
      </div>
    </>
  );
};

const MenuButton: React.FC<MenuButtonProps> = ({ image, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex cursor-pointer items-center justify-center',
        !isActive && 'opacity-70',
      )}
    >
      <Sprite src={'/ui/bg-menu-item-shop.png'} width={isActive ? 250 : 230} />
      <div className="absolute">
        <Sprite src={image} height={120} />
      </div>
    </div>
  );
};

const Slot: React.FC<SlotProps> = ({ name, price, image, disabled, onClick }) => {
  return (
    <button
      className={cn(
        'relative flex cursor-pointer items-center justify-center',
        disabled && 'brightness grayscale',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <img src="/ui/item-slot-shop.png" alt="HUD" className="object-pixelated w-full" />
      <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-2 px-5">
        <Text size={40} className="absolute top-[10%] uppercase">
          {name}
        </Text>
        <Sprite src={image} height={165} />
        <div className="absolute bottom-[10%] flex items-center justify-center">
          <Sprite src={'/ui/label-item-slot-shop.png'} width={330} />
          <Text
            size={50}
            className="absolute top-0 flex h-full w-full items-center justify-center gap-1"
          >
            <Sprite width={65} src="/ui/coin.png" />
            {price}
          </Text>
        </div>
      </div>
    </button>
  );
};

const SlotNone: React.FC = () => {
  return (
    <img src="/ui/item-slot-shop.png" alt="HUD" className="object-pixelated w-full opacity-50" />
  );
};

export default ShopModal;
