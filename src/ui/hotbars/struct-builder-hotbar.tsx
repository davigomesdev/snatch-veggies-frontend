import event from '@/scripts/systems/event';

import { BASE_URL_STATIC } from '@/constants/api-url';

import { TResponse } from '@/core/types/response.type';

import { IStructInventory } from '@/core/interfaces/struct-inventory.interface';

import { EventEnum } from '@/core/enums/event.enum';
import { ChildrenTypeEnum } from '@/core/enums/children-type.enum';

import { listStructInventories } from '@/scripts/services/axios/requests/struct/struct.service';

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

const StructBuilderHotbar: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data: structsData } = useQuery<TResponse<IStructInventory[]>>({
    queryKey: ['struct-inventories'],
    queryFn: async () => {
      return await listStructInventories({
        struct: true,
        isVisible: true,
      });
    },
  });

  const structs = structsData ? structsData.data : [];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(structs.length / itemsPerPage);

  const getCurrentPage = (): IStructInventory[] => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return structs.slice(startIndex, endIndex);
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
    event.on(EventEnum.UPDATE_STRUCT_INVENTORY, () => {
      queryClient.invalidateQueries({
        queryKey: ['struct-inventories'],
      });
    });

    return () => {
      event.off(EventEnum.UPDATE_STRUCT_INVENTORY, () => {
        queryClient.invalidateQueries({
          queryKey: ['struct-inventories'],
        });
      });
    };
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
          ...getCurrentPage().map((item) => (
            <HotbarBlockItem
              key={item.id}
              index={item.struct!.index}
              image={item.struct!.image}
              amount={item.amount}
              inUse={item.inUse}
            />
          )),
          ...Array.from({ length: itemsPerPage - getCurrentPage().length }, (_, index) => (
            <Sprite
              src="/ui/bg-hud-small.png"
              minWidth={310}
              key={`none-${index}`}
              className="opacity-50"
            />
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

const HotbarBlockItem: React.FC<HotbarItemProps> = ({ index, amount, inUse, image }) => {
  const currentAmount = amount - inUse;

  const handleOnClick = (): void => {
    event.emit(EventEnum.SELECT_BLOCK, index, ChildrenTypeEnum.STRUCT);
  };

  return (
    <button
      className={cn(
        'relative flex items-center justify-center transition',
        currentAmount <= 0 ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.1]',
      )}
      onClick={handleOnClick}
      disabled={currentAmount <= 0}
    >
      <Sprite src="/ui/bg-hud-small.png" minWidth={310} />
      <div className="absolute flex h-full items-center justify-center">
        <Sprite src={`${BASE_URL_STATIC}struct/${image}`} height={200} />
        <Text size={43} className="absolute bottom-[7%] text-center">
          {currentAmount}/{amount}
        </Text>
      </div>
    </button>
  );
};

export default StructBuilderHotbar;
