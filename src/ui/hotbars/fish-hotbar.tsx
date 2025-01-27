import event from '@/scripts/systems/event';

import { EventEnum } from '@/core/enums/event.enum';

import { IUser } from '@/core/interfaces/user.interface';
import { TResponse } from '@/core/types/response.type';

import { currentUser } from '@/scripts/services/axios/requests/user/user.service';
import { createFishInventory } from '@/scripts/services/axios/requests/fish/fish.service';

import { cn } from '@/scripts/utils/cn.util';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Text from '../common/text';
import Sprite from '../common/sprite';
import Button from '../common/button';

const FishHotbar: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: user } = useQuery<TResponse<IUser>>({
    queryKey: ['user'],
    queryFn: async () => {
      return await currentUser();
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await createFishInventory();
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      queryClient.invalidateQueries({
        queryKey: ['fish-inventories'],
      });

      event.emit(EventEnum.ON_CLICK_BOAT_DESELECT);
      event.emit(EventEnum.FISH, response.data);
    },
  });

  const handleOnClickFish = (): void => {
    mutate();
  };

  return (
    <div className="flex w-fit flex-col items-center justify-center gap-2 p-2">
      <Sprite src="/ui/bg-hud-action.png" width={450} />
      <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center px-3">
        <Text size={60}>FISH</Text>
        <Button
          size="small"
          className={cn('mt-3', (user?.data.gold ?? 0) < 100 && 'cursor-not-allowed')}
          disabled={isPending || (user?.data.gold ?? 0) < 100}
          onClick={handleOnClickFish}
        >
          {isPending ? (
            'WAIT...'
          ) : (
            <>
              <Sprite src="/ui/coin.png" width={80} />
              <Text size={50}>100</Text>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FishHotbar;
