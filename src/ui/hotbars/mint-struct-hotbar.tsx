import event from '@/scripts/systems/event';

import { addMinutes } from 'date-fns';

import { EventEnum } from '@/core/enums/event.enum';

import { Struct } from '@/scripts/voxel/struct';

import { countdown } from '@/scripts/utils/datetime.util';

import React from 'react';

import { useHotbar } from '../common/hotbar';
import { useQueryClient } from '@tanstack/react-query';

import Text from '../common/text';
import Button from '../common/button';
import Sprite from '../common/sprite';

interface MintStructHotbarProps {
  struct: Struct;
}

const MintStructHotbar: React.FC<MintStructHotbarProps> = ({ struct }) => {
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

  const handleOnClickMint = (): void => {
    struct.mint();
    closeHotbar();
  };

  React.useEffect(() => {
    const targetDate = addMinutes(struct.prevClaimDate, struct.duration);

    const interval = setInterval(() => {
      const time = countdown(targetDate);
      setRemainingTime(time);
    }, 1000);

    return () => clearInterval(interval);
  }, [struct]);

  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  React.useEffect(() => {
    event.on(EventEnum.UPDATE_STRUCT_INVENTORY, () => {
      queryClient.invalidateQueries({
        queryKey: ['land'],
      });
      queryClient.invalidateQueries({
        queryKey: ['struct-inventories'],
      });
    });

    return () => {
      event.off(EventEnum.UPDATE_STRUCT_INVENTORY, () => {
        queryClient.invalidateQueries({
          queryKey: ['land'],
        });
        queryClient.invalidateQueries({
          queryKey: ['struct-inventories'],
        });
      });
    };
  }, []);

  return (
    <div className="flex w-fit flex-col items-center justify-center gap-2 p-2">
      <Sprite src="/ui/bg-hud-action.png" width={450} />
      <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center px-3">
        <Text size={60} className="uppercase">
          {struct.name}
        </Text>
        {struct.isCompleted || remainingTime.isCompleted ? (
          <Button size="small" className="mt-3" onClick={handleOnClickMint}>
            <Text size={50}>MINT</Text>
          </Button>
        ) : (
          <Text size={50}> {isLoading ? 'WAIT...' : remainingTime.dateTime}</Text>
        )}
      </div>
    </div>
  );
};

export default MintStructHotbar;
