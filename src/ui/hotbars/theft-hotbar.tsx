import event from '@/scripts/systems/event';

import { addMinutes, isToday } from 'date-fns';

import { TResponse } from '@/core/types/response.type';

import { ILand } from '@/core/interfaces/land.interface';

import { Plant } from '@/scripts/voxel/plant';

import { EventEnum } from '@/core/enums/event.enum';

import { currentLand } from '@/scripts/services/axios/requests/land/land.service';

import { calculateMaxQuantity } from '@/scripts/utils/level.util';

import React from 'react';

import { useHotbar } from '../common/hotbar';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { countdown } from '@/scripts/utils/datetime.util';

import Text from '../common/text';
import Sprite from '../common/sprite';
import Button from '../common/button';

interface TheftHotbarProps {
  plant: Plant;
}

const TheftHotbar: React.FC<TheftHotbarProps> = ({ plant }) => {
  const queryClient = useQueryClient();

  const { closeHotbar } = useHotbar();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [remainingTime, setRemainingTime] = React.useState<{
    isCompleted: boolean;
    dateTime: string;
  }>({
    isCompleted: false,
    dateTime: '00:00:00',
  });

  const { data: land } = useQuery<TResponse<ILand>>({
    queryKey: ['land'],
    queryFn: async () => {
      return await currentLand();
    },
  });

  const maxStolenQuantity = 5;
  const maxTheftQuantity = calculateMaxQuantity(5, land?.data.exp ?? 0);

  let isShield = false;
  let theftCount = 0;

  if (land && isToday(land.data.lastTheftDate)) {
    theftCount = land.data.theftCount;
  }

  if (isToday(plant.scene.visitorland.lastStolenDate)) {
    isShield = plant.scene.visitorland.stolenCount >= maxStolenQuantity;
  }

  const handleOnClickTheft = (): void => {
    plant.theft();
    closeHotbar();
  };

  React.useEffect(() => {
    const targetDate = addMinutes(plant.plantingDate, plant.duration);

    const interval = setInterval(() => {
      const time = countdown(targetDate);
      setRemainingTime(time);
    }, 1000);

    return () => clearInterval(interval);
  }, [plant]);

  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  React.useEffect(() => {
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
    <div className="flex w-fit flex-col items-center justify-center gap-2 p-2">
      <Sprite src="/ui/bg-hud-action.png" width={450} />
      <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center px-4">
        {isShield ? (
          <Text size={45} className="mb-[7%]">
            ACTIVE SHIELD
          </Text>
        ) : (
          <Text size={60} className="uppercase">
            {plant.name}
          </Text>
        )}
        {isShield ? (
          <Sprite src="/ui/shield.png" width={180} />
        ) : plant.isCompleted || remainingTime.isCompleted ? (
          theftCount >= maxTheftQuantity ? (
            <Text size={50}>NO THEFT</Text>
          ) : (
            <Button size="small" className="mt-3" onClick={handleOnClickTheft}>
              <Text size={50}>THEFT</Text>
            </Button>
          )
        ) : (
          <Text size={50}>{isLoading ? 'WAIT...' : remainingTime.dateTime}</Text>
        )}
      </div>
    </div>
  );
};

export default TheftHotbar;
