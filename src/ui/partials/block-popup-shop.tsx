import { BASE_URL_STATIC } from '@/constants/api-url';

import { TResponse } from '@/core/types/response.type';

import { IUser } from '@/core/interfaces/user.interface';
import { ILand } from '@/core/interfaces/land.interface';
import { IBlockInventory } from '@/core/interfaces/block-inventory.interface';

import { CreateBlockInventoryDTO } from '@/scripts/services/axios/requests/block/dtos/create-block-inventory.dto';

import { currentUser } from '@/scripts/services/axios/requests/user/user.service';
import { currentLand } from '@/scripts/services/axios/requests/land/land.service';

import {
  createBlockInventory,
  findBlock,
  findBlockInventory,
} from '@/scripts/services/axios/requests/block/block.service';

import { calculateMaxQuantity } from '@/scripts/utils/level.util';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Text from '../common/text';
import Input from '../common/input';
import Sprite from '../common/sprite';
import Button from '../common/button';
import { IBlock } from '@/core/interfaces/block.interface';

interface BlockPopupProps {
  id: string;
}

const BlockPopupShop: React.FC<BlockPopupProps> = ({ id }) => {
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

  const { data: block } = useQuery<TResponse<IBlock>>({
    queryKey: ['block', id],
    queryFn: async () => {
      return await findBlock({
        id,
        isVisible: true,
      });
    },
  });

  const { data: blockInventory } = useQuery<TResponse<IBlockInventory>>({
    queryKey: ['block-inventory', id],
    queryFn: async () => {
      return await findBlockInventory({
        blockId: id,
        block: true,
        isVisible: true,
      });
    },
    retry: false,
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: CreateBlockInventoryDTO) => {
      await createBlockInventory(input);
    },
    onSuccess: () => {
      ['user', 'blocks', 'block-inventory', 'block-inventories'].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      );
    },
  });

  const handleOnChangeSetAmount = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const targetValue: string = event.target.value;
    const sanitizedValue: string = targetValue.replace(/[^0-9.]/g, '');

    const maxQuantity =
      calculateMaxQuantity(block!.data.limit, land!.data.exp) - (blockInventory?.data.amount ?? 0);

    let value = sanitizedValue;
    if (Number(value) * block!.data.price > user!.data.gold)
      value = String(Math.floor(user!.data.gold / block!.data.price));

    value = Number(value) > maxQuantity ? String(maxQuantity) : value;

    setAmount(value);
  };

  const handleOnClickCreateBlockInventory = (): void => {
    mutate({
      blockId: id,
      amount: Number(amount),
    });
  };

  useEffect(() => {
    setAmount('');
  }, [id]);

  if (!block || !land) {
    return (
      <div className="absolute bottom-0 z-10 w-full border-[3px] border-b-0 border-[#431c0e] bg-[#693616] p-5">
        <Text size={50} className="uppercase">
          LOADING...
        </Text>
      </div>
    );
  }

  const maxQuantity = calculateMaxQuantity(block.data.limit, land.data.exp);

  return (
    <div className="absolute bottom-0 z-10 flex w-full flex-col items-center justify-center gap-7 border-[3px] border-b-0 border-[#431c0e] bg-[#693616] p-5 md:flex-row">
      <div className="relative flex items-center justify-center">
        <Sprite src="/ui/item-slot-big.png" width={550} />
        <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-1">
          <Sprite src={`${BASE_URL_STATIC}block/${block.data.image}`} width={300} />
          <Text size={50} className="absolute bottom-[10%] right-[14%]">
            {blockInventory?.data.amount ?? 0}/{maxQuantity}
          </Text>
        </div>
      </div>
      <div>
        <Text size={100} className="uppercase">
          {block.data.name}
        </Text>
        <div>
          <Text size={50} className="flex items-center justify-center gap-1 uppercase">
            PRICE: <Sprite width={80} src="/ui/coin.png" />
            {block.data.price}
          </Text>
          {(blockInventory?.data.amount ?? 0) < maxQuantity && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <Input
                placeholder="0.0"
                variant="small"
                value={amount}
                onChange={handleOnChangeSetAmount}
              />
              <Button size="small" onClick={handleOnClickCreateBlockInventory}>
                <Text size={50}>{isPending ? 'WAIT...' : 'BUY'}</Text>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockPopupShop;
