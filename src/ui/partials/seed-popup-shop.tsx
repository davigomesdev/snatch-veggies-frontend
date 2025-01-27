import { BASE_URL_STATIC } from '@/constants/api-url';

import { TResponse } from '@/core/types/response.type';

import { IUser } from '@/core/interfaces/user.interface';
import { IPlant } from '@/core/interfaces/plant.interface';

import { CreatePlantInventoryDTO } from '@/scripts/services/axios/requests/plant/dtos/create-plant-inventory.dto';

import { currentUser } from '@/scripts/services/axios/requests/user/user.service';

import {
  createPlantInventory,
  findPlant,
} from '@/scripts/services/axios/requests/plant/plant.service';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Text from '../common/text';
import Input from '../common/input';
import Sprite from '../common/sprite';
import Button from '../common/button';

interface SeedPopupShopProps {
  id: string;
}

const SeedPopupShop: React.FC<SeedPopupShopProps> = ({ id }) => {
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<string>('');

  const { data: user } = useQuery<TResponse<IUser>>({
    queryKey: ['user'],
    queryFn: async () => {
      return await currentUser();
    },
  });

  const { data: plant } = useQuery<TResponse<IPlant>>({
    queryKey: ['plant', id],
    queryFn: async () => {
      return await findPlant({
        id,
        isVisible: true,
      });
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: CreatePlantInventoryDTO) => {
      await createPlantInventory(input);
    },
    onSuccess: () => {
      ['user', 'plants', 'plant-inventory', 'plant-inventories'].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      );
    },
  });

  const handleOnChangeSetAmount = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const targetValue: string = event.target.value;
    const sanitizedValue: string = targetValue.replace(/[^0-9.]/g, '');

    let value = sanitizedValue;
    if (Number(value) * plant!.data.price > user!.data.gold)
      value = String(Math.floor(user!.data.gold / plant!.data.price));

    setAmount(value);
  };

  const handleOnClickCreatePlantInventory = (): void => {
    mutate({
      plantId: id,
      amount: Number(amount),
    });
  };

  useEffect(() => {
    setAmount('');
  }, [id]);

  if (!plant) {
    return (
      <div className="absolute bottom-0 z-10 w-full border-[3px] border-b-0 border-[#431c0e] bg-[#693616] p-5">
        <Text size={50} className="uppercase">
          LOADING...
        </Text>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 z-10 flex w-full flex-col items-center justify-center gap-7 border-[3px] border-b-0 border-[#431c0e] bg-[#693616] p-5 md:flex-row">
      <div className="relative flex cursor-pointer items-center justify-center">
        <Sprite src="/ui/item-slot-big.png" width={550} />
        <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-1">
          <Sprite src={`${BASE_URL_STATIC}plant/${plant.data.image}`} width={300} />
        </div>
      </div>
      <div>
        <Text size={100} className="uppercase">
          {plant.data.name}
        </Text>
        <div>
          <Text size={50} className="flex items-center justify-center gap-1 uppercase">
            PRICE: <Sprite width={80} src="/ui/coin.png" />
            {plant.data.price}
          </Text>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Input
              placeholder="0.0"
              variant="small"
              value={amount}
              onChange={handleOnChangeSetAmount}
            />
            <Button size="small" onClick={handleOnClickCreatePlantInventory}>
              <Text size={50}>{isPending ? 'WAIT...' : 'BUY'}</Text>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedPopupShop;
