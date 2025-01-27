import event from '@/scripts/systems/event';

import { BASE_URL_STATIC } from '@/constants/api-url';

import { TResponse } from '@/core/types/response.type';

import { IPlantInventory } from '@/core/interfaces/plant-inventory.interface';

import { EventEnum } from '@/core/enums/event.enum';
import { ChildrenTypeEnum } from '@/core/enums/children-type.enum';

import { listPlantInventories } from '@/scripts/services/axios/requests/plant/plant.service';

import { cn } from '@/scripts/utils/cn.util';

import { Block } from '@/scripts/voxel/block';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import Text from '../common/text';
import Sprite from '../common/sprite';

interface HotbarPlantItemProps {
  amount: number;
  inUse: number;
  image: string;
  onClick: () => void;
}

interface PlantSeedsHotbarProps {
  block: Block;
}

const PlantSeedsHotbar: React.FC<PlantSeedsHotbarProps> = ({ block }) => {
  const queryClient = useQueryClient();

  const { data: plantsData } = useQuery<TResponse<IPlantInventory[]>>({
    queryKey: ['plant-inventories'],
    queryFn: async () => {
      return await listPlantInventories({
        plant: true,
        isVisible: true,
      });
    },
  });

  const plants = plantsData ? plantsData.data : [];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(plants.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState<number>(0);

  const getCurrentPage = (): IPlantInventory[] => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return plants.slice(startIndex, endIndex);
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

  const handleOnClickPlanting = (index: number): void => {
    block.setChildren(index, ChildrenTypeEnum.SEED).setSelect(false);
  };

  useEffect(() => {
    event.on(EventEnum.UPDATE_PLANTATION_INVENTORY, () => {
      queryClient.invalidateQueries({
        queryKey: ['plant-inventories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['land'],
      });
    });

    return () => {
      event.off(EventEnum.UPDATE_PLANTATION_INVENTORY, () => {
        queryClient.invalidateQueries({
          queryKey: ['plant-inventories'],
        });
        queryClient.invalidateQueries({
          queryKey: ['land'],
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
      <ul className="flex items-center gap-2">
        {[
          ...getCurrentPage().map((item) => (
            <PlantSeedItem
              key={item.id}
              image={item.plant!.image}
              amount={item.amount}
              inUse={item.inUse}
              onClick={() => handleOnClickPlanting(item.plant!.index)}
            />
          )),
          ...Array.from({ length: itemsPerPage - getCurrentPage().length }, (_, index) => (
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

const PlantSeedItem: React.FC<HotbarPlantItemProps> = ({ amount, inUse, image, onClick }) => {
  const currentAmount = amount - inUse;

  return (
    <button
      className={cn(
        'relative flex items-center justify-center transition',
        currentAmount <= 0 ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.1]',
      )}
      onClick={onClick}
      disabled={currentAmount <= 0}
    >
      <Sprite src="/ui/bg-hud-small.png" minWidth={310} />
      <div className="absolute flex h-full items-center justify-center">
        <Sprite src={`${BASE_URL_STATIC}plant/${image}`} height={200} />
        <Text size={43} className="absolute bottom-[7%] text-center">
          {currentAmount}/{amount}
        </Text>
      </div>
    </button>
  );
};

export default PlantSeedsHotbar;
