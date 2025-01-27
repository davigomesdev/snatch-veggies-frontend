import { BASE_URL_STATIC } from '@/constants/api-url';

import { TResponse } from '@/core/types/response.type';

import { IUser } from '@/core/interfaces/user.interface';
import { IFishInventory } from '@/core/interfaces/fish-inventory.interface';
import { IPlantInventory } from '@/core/interfaces/plant-inventory.interface';
import { IStructInventory } from '@/core/interfaces/struct-inventory.interface';

import { currentUser } from '@/scripts/services/axios/requests/user/user.service';
import {
  listFishInventories,
  saleFishInventory,
} from '@/scripts/services/axios/requests/fish/fish.service';
import {
  listPlantInventories,
  salePlantInventory,
} from '@/scripts/services/axios/requests/plant/plant.service';
import {
  listStructInventories,
  saleStructInventory,
} from '@/scripts/services/axios/requests/struct/struct.service';

import { useState } from 'react';
import { useScreenSizeStage } from '@/hooks/use-screen-size-stage';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Text from '../common/text';
import Input from '../common/input';
import Sprite from '../common/sprite';
import Button from '../common/button';

enum ItemTypeEnum {
  PLANT,
  STRUCT,
  FISH,
}

type SellDTO = {
  id: string;
  amount: number;
  type: ItemTypeEnum;
};

type TItem = {
  id: string;
  name: string;
  image: string;
  value: number;
  amount: number;
  type: ItemTypeEnum;
};

interface SlotProps {
  amount: number;
  image: string;
  onClick: () => void;
}

const InventoryModal: React.FC = () => {
  const queryClient = useQueryClient();

  const { stage, getCurrentSizeStage } = useScreenSizeStage();

  const [item, setItem] = useState<TItem | null>(null);

  const { data: user } = useQuery<TResponse<IUser>>({
    queryKey: ['user'],
    queryFn: async () => {
      return await currentUser();
    },
  });

  const { data: plantInventories } = useQuery<TResponse<IPlantInventory[]>>({
    queryKey: ['plant-inventories'],
    queryFn: async () => {
      return await listPlantInventories({
        plant: true,
        isVisible: true,
      });
    },
    placeholderData: keepPreviousData,
  });

  const { data: structInventories } = useQuery<TResponse<IStructInventory[]>>({
    queryKey: ['struct-inventories'],
    queryFn: async () => {
      return await listStructInventories({
        struct: true,
      });
    },
    placeholderData: keepPreviousData,
  });

  const { data: fishInventories } = useQuery<TResponse<IFishInventory[]>>({
    queryKey: ['fish-inventories'],
    queryFn: async () => {
      return await listFishInventories({
        fish: true,
      });
    },
    placeholderData: keepPreviousData,
  });

  const [sellAmount, setSellAmount] = useState<string>('');

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: SellDTO) => {
      const { type, ...rest } = input;
      if (type == ItemTypeEnum.PLANT) return await salePlantInventory(rest);
      if (type == ItemTypeEnum.STRUCT) return await saleStructInventory(rest);
      if (type == ItemTypeEnum.FISH) return await saleFishInventory(rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });

      queryClient.invalidateQueries({
        queryKey: ['struct-inventories'],
      });

      queryClient.invalidateQueries({
        queryKey: ['fish-inventories'],
      });

      queryClient.invalidateQueries({
        queryKey: ['plant-inventories'],
      });

      if (item) {
        setItem({
          ...item,
          amount: item.amount - Number(sellAmount),
        });
      }

      setSellAmount('');
    },
  });

  const handleOnClickItem = (item: TItem): void => {
    setItem(item);
    setSellAmount('');
  };

  const handleOnChangeSetAmount = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const targetValue: string = event.target.value;
    const sanitizedValue: string = targetValue.replace(/[^0-9.]/g, '');

    let value = sanitizedValue;
    if (Number(value) > item!.amount) value = item!.amount.toString();

    setSellAmount(value);
  };

  const handleOnClickSell = (id: string, type: ItemTypeEnum): void => {
    mutate({
      id,
      amount: Number(sellAmount),
      type,
    });
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${stage >= 5 ? 3 : 5}, ${getCurrentSizeStage(450)}px)`,
          gridTemplateRows: 'repeat(auto-fill, ' + getCurrentSizeStage(450) + 'px)',
          scrollbarWidth: 'none',
          scrollbarColor: 'transparent transparent',
        }}
        className="relative h-[calc(100vh-200px)] min-h-[200px] w-full gap-2 overflow-y-auto border-[3px] border-b-0 border-[#431c0e] bg-[#693616] p-3 pt-5"
      >
        {plantInventories &&
          fishInventories &&
          structInventories && [
            ...plantInventories.data.map((item) => (
              <Slot
                key={item.id}
                amount={item.harvest}
                image={`${BASE_URL_STATIC}plant/${item.plant!.image}`}
                onClick={() =>
                  handleOnClickItem({
                    id: item.id,
                    name: item.plant!.name,
                    image: `${BASE_URL_STATIC}plant/${item.plant!.image}`,
                    value: item.plant!.profit,
                    amount: item.harvest,
                    type: ItemTypeEnum.PLANT,
                  })
                }
              />
            )),
            ...structInventories.data.map((item) => (
              <Slot
                key={item.id}
                amount={item.minted}
                image={`${BASE_URL_STATIC}struct-item/${item.struct!.itemImage}`}
                onClick={() =>
                  handleOnClickItem({
                    id: item.id,
                    name: item.struct!.name,
                    image: `${BASE_URL_STATIC}struct-item/${item.struct!.itemImage}`,
                    value: item.struct!.profit,
                    amount: item.minted,
                    type: ItemTypeEnum.STRUCT,
                  })
                }
              />
            )),
            ...fishInventories.data.map((item) => (
              <Slot
                key={item.id}
                amount={item.amount}
                image={`${BASE_URL_STATIC}fish/${item.fish!.image}`}
                onClick={() =>
                  handleOnClickItem({
                    id: item.id,
                    name: item.fish!.name,
                    image: `${BASE_URL_STATIC}fish/${item.fish!.image}`,
                    value: item.fish!.price,
                    amount: item.amount,
                    type: ItemTypeEnum.FISH,
                  })
                }
              />
            )),
            ...Array.from(
              {
                length:
                  30 -
                  plantInventories.data.length -
                  fishInventories.data.length -
                  structInventories.data.length,
              },
              (_, index) => <SlotNone key={index} />,
            ),
          ]}
      </div>
      <div className="relative w-full">
        {item && (
          <div className="absolute bottom-0 z-10 flex w-full flex-col items-center justify-center gap-7 border-[3px] border-b-0 border-[#431c0e] bg-[#693616] p-5 md:flex-row">
            <div className="relative flex cursor-pointer items-center justify-center">
              <Sprite src="/ui/item-slot-big.png" width={550} />
              <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-1">
                <Sprite src={item.image} width={300} />
              </div>
            </div>
            <div>
              <Text size={100} className="uppercase">
                {item.name}
              </Text>
              <div>
                <Text size={50} className="uppercase">
                  AMOUNT: {item.amount}
                </Text>
                <Text size={50} className="flex items-center justify-center gap-1 uppercase">
                  PRICE: <Sprite width={80} src="/ui/coin.png" />
                  {item.value}
                </Text>
                {item.amount > 0 && (
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <Input
                      placeholder="0.0"
                      variant="small"
                      onChange={handleOnChangeSetAmount}
                      value={sellAmount}
                      disabled={isPending}
                    />
                    <Button
                      onClick={() => handleOnClickSell(item.id, item.type)}
                      disabled={isPending || !sellAmount}
                      size="small"
                    >
                      <Text size={50}>{isPending ? 'WAIT...' : 'SELL'}</Text>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
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

const Slot: React.FC<SlotProps> = ({ amount, image, onClick }) => {
  return (
    <button className="relative flex cursor-pointer items-center justify-center" onClick={onClick}>
      <img src="/ui/item-slot.png" alt="HUD" className="object-pixelated w-full" />
      <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-1">
        <Sprite src={image} height={200} />
        <Text size={50} className="absolute bottom-[12%] right-[15%]">
          <span>x</span>
          {amount}
        </Text>
      </div>
    </button>
  );
};

const SlotNone: React.FC = () => {
  return <img src="/ui/item-slot.png" alt="HUD" className="object-pixelated w-full opacity-50" />;
};

export default InventoryModal;
