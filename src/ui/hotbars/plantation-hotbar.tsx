import event from '@/scripts/systems/event';

import { addMinutes } from 'date-fns';

import { EventEnum } from '@/core/enums/event.enum';

import { Plant } from '@/scripts/voxel/plant';

import React from 'react';

import { useHotbar } from '../common/hotbar';
import { useQueryClient } from '@tanstack/react-query';

import { countdown } from '@/scripts/utils/datetime.util';

import Text from '../common/text';
import Sprite from '../common/sprite';
import Button from '../common/button';

interface PlantationHotbarProps {
  plant: Plant;
}

const PlantationHotbar: React.FC<PlantationHotbarProps> = ({ plant }) => {
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

  const handleOnClickHarvest = (): void => {
    plant.harvest();
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
      <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center px-3">
        <Text size={60} className="uppercase">
          {plant.name}
        </Text>
        {plant.isCompleted || remainingTime.isCompleted ? (
          <Button size="small" className="mt-3" onClick={handleOnClickHarvest}>
            <Text size={50}>HARVEST</Text>
          </Button>
        ) : (
          <Text size={50}> {isLoading ? 'WAIT...' : remainingTime.dateTime}</Text>
        )}
      </div>
    </div>
  );
};

export default PlantationHotbar;
