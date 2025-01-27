import { BASE_URL_STATIC } from '@/constants/api-url';

import { TResponse } from '@/core/types/response.type';

import { IUser } from '@/core/interfaces/user.interface';
import { ILand } from '@/core/interfaces/land.interface';
import { IDecoration } from '@/core/interfaces/decoration.interface';
import { IDecorationInventory } from '@/core/interfaces/decoration-inventory.interface';

import { CreateDecorationInventoryDTO } from '@/scripts/services/axios/requests/decoration/dtos/create-decoration-inventory.dto';

import { currentUser } from '@/scripts/services/axios/requests/user/user.service';
import { currentLand } from '@/scripts/services/axios/requests/land/land.service';

import {
  createDecorationInventory,
  findDecoration,
  findDecorationInventory,
} from '@/scripts/services/axios/requests/decoration/decoration.service';

import { calculateMaxQuantity } from '@/scripts/utils/level.util';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Text from '../common/text';
import Input from '../common/input';
import Sprite from '../common/sprite';
import Button from '../common/button';

interface DecorationPopupProps {
  id: string;
}

const DecorationPopupShop: React.FC<DecorationPopupProps> = ({ id }) => {
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<string>('');

  const { data: user } = useQuery<TResponse<IUser>>({
    queryKey: ['user'],
    queryFn: async () => {
      return await currentUser();
    },
  });

  const { data: land } = useQuery<TResponse<ILand>>({
    queryKey: ['land'],
    queryFn: async () => {
      return await currentLand();
    },
  });

  const { data: decoration } = useQuery<TResponse<IDecoration>>({
    queryKey: ['decoration', id],
    queryFn: async () => {
      return await findDecoration({
        id,
        isVisible: true,
      });
    },
  });

  const { data: decorationInventory } = useQuery<TResponse<IDecorationInventory>>({
    queryKey: ['decoration-inventory', id],
    queryFn: async () => {
      return await findDecorationInventory({
        decorationId: id,
        decoration: true,
        isVisible: true,
      });
    },
    retry: false,
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: CreateDecorationInventoryDTO) => {
      await createDecorationInventory(input);
    },
    onSuccess: () => {
      ['user', 'decorations', 'decoration-inventory', 'decoration-inventories'].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      );
    },
  });

  const handleOnChangeSetAmount = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const targetValue: string = event.target.value;
    const sanitizedValue: string = targetValue.replace(/[^0-9.]/g, '');

    const maxQuantity =
      calculateMaxQuantity(decoration!.data.limit, land!.data.exp) -
      (decorationInventory?.data.amount ?? 0);

    let value = sanitizedValue;
    if (Number(value) * decoration!.data.price > user!.data.gold)
      value = String(Math.floor(user!.data.gold / decoration!.data.price));

    value = Number(value) > maxQuantity ? String(maxQuantity) : value;

    setAmount(value);
  };

  const handleOnClickCreateDecorationInventory = (): void => {
    mutate({
      decorationId: id,
      amount: Number(amount),
    });
  };

  useEffect(() => {
    setAmount('');
  }, [id]);

  if (!decoration || !land) {
    return (
      <div className="absolute bottom-0 z-10 w-full border-[3px] border-b-0 border-[#431c0e] bg-[#693616] p-5">
        <Text size={50} className="uppercase">
          LOADING...
        </Text>
      </div>
    );
  }

  const maxQuantity = calculateMaxQuantity(decoration.data.limit, land.data.exp);

  return (
    <div className="absolute bottom-0 z-10 flex w-full flex-col items-center justify-center gap-7 border-[3px] border-b-0 border-[#431c0e] bg-[#693616] p-5 md:flex-row">
      <div className="relative flex items-center justify-center">
        <Sprite src="/ui/item-slot-big.png" width={550} />
        <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-1">
          <Sprite src={`${BASE_URL_STATIC}decoration/${decoration.data.image}`} height={300} />
          <Text size={50} className="absolute bottom-[10%] right-[14%]">
            {decorationInventory?.data.amount ?? 0}/{maxQuantity}
          </Text>
        </div>
      </div>
      <div>
        <Text size={100} className="uppercase">
          {decoration.data.name}
        </Text>
        <div>
          <Text size={50} className="flex items-center justify-center gap-1 uppercase">
            PRICE: <Sprite width={80} src="/ui/coin.png" />
            {decoration.data.price}
          </Text>
          {(decorationInventory?.data.amount ?? 0) < maxQuantity && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <Input
                placeholder="0.0"
                variant="small"
                value={amount}
                onChange={handleOnChangeSetAmount}
              />
              <Button size="small" onClick={handleOnClickCreateDecorationInventory}>
                <Text size={50}>{isPending ? 'WAIT...' : 'BUY'}</Text>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecorationPopupShop;
