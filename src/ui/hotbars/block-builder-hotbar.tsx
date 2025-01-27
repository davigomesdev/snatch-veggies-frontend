import event from '@/scripts/systems/event';

import { BASE_URL_STATIC } from '@/constants/api-url';

import { TResponse } from '@/core/types/response.type';

import { IBlockInventory } from '@/core/interfaces/block-inventory.interface';

import { EventEnum } from '@/core/enums/event.enum';

import { listBlockInventories } from '@/scripts/services/axios/requests/block/block.service';

import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/scripts/utils/cn.util';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import Text from '../common/text';
import Sprite from '../common/sprite';

interface HotbarItemProps {
  index: number;
  amount: number;
  inUse: number;
  image: string;
}

const BlockBuilderHotbar: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data: blocksData } = useQuery<TResponse<IBlockInventory[]>>({
    queryKey: ['block-inventories'],
    queryFn: async () => {
      return await listBlockInventories({
        block: true,
        isVisible: true,
      });
    },
  });

  const blocks = blocksData ? blocksData.data : [];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(blocks.length / itemsPerPage);

  const getCurrentPageBlocks = (): IBlockInventory[] => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return blocks.slice(startIndex, endIndex);
  };

  const handleOnClickNextPage = (): void => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleOnClickPrevPage = (): void => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    event.on(EventEnum.UPDATE_BLOCK_INVENTORY, () => {
      queryClient.invalidateQueries({
        queryKey: ['block-inventories'],
      });
    });
  }, []);

  return (
    <div className="flex w-fit items-center justify-center p-2">
      <button
        className={cn(
          'hover:scale-[1.3]] cursor-pointer px-1 transition',
          currentPage === 0 && 'cursor-not-allowed opacity-30',
        )}
        onClick={handleOnClickPrevPage}
        disabled={currentPage === 0}
      >
        <Sprite src="/ui/arrow-left.png" minWidth={60} />
      </button>
      <ul className="flex items-center gap-2 p-2">
        {[
          <HotbarRemove key={uuidv4()} />,
          ...getCurrentPageBlocks().map((item) => (
            <HotbarBlockItem
              key={item.id}
              index={item.block!.index}
              image={item.block!.image}
              amount={item.amount}
              inUse={item.inUse}
            />
          )),
          ...Array.from({ length: itemsPerPage - getCurrentPageBlocks().length }, (_, index) => (
            <Sprite src="/ui/bg-hud-small.png" key={index} minWidth={310} className="opacity-50" />
          )),
        ]}
      </ul>
      <button
        disabled={currentPage === totalPages - 1}
        className={cn(
          'hover:scale-[1.3]] cursor-pointer px-1 transition',
          currentPage === totalPages - 1 && 'cursor-not-allowed opacity-30',
        )}
        onClick={handleOnClickNextPage}
      >
        <Sprite src="/ui/arrow-right.png" minWidth={60} />
      </button>
    </div>
  );
};

const HotbarRemove: React.FC = () => {
  const handleOnClick = (): void => {
    event.emit(EventEnum.SELECT_BLOCK, 0, null);
  };

  return (
    <button
      className={cn('relative flex items-center justify-center transition hover:scale-[1.1]')}
      onClick={handleOnClick}
    >
      <Sprite src="/ui/bg-hud-small.png" minWidth={310} />
      <div className="absolute flex h-full items-center justify-center">
        <Sprite src="/ui/remove.png" height={200} />
        <Text size={53} className="absolute bottom-[10%] text-center">
          REMOVE
        </Text>
      </div>
    </button>
  );
};

const HotbarBlockItem: React.FC<HotbarItemProps> = ({ index, amount, inUse, image }) => {
  const currentAmount = amount - inUse;

  const handleOnClick = (): void => {
    event.emit(EventEnum.SELECT_BLOCK, index, null);
  };

  return (
    <button
      className={cn(
        'relative flex items-center justify-center transition',
        currentAmount <= 0 ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.1]',
      )}
      onClick={handleOnClick}
    >
      <Sprite src="/ui/bg-hud-small.png" minWidth={310} />
      <div className="absolute flex h-full items-center justify-center">
        <Sprite src={`${BASE_URL_STATIC}block/${image}`} height={200} />
        <Text size={43} className="absolute bottom-[7%] text-center">
          {currentAmount}/{amount}
        </Text>
      </div>
    </button>
  );
};

export default BlockBuilderHotbar;
