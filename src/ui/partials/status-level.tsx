import { TResponse } from '@/core/types/response.type';

import { ILand } from '@/core/interfaces/land.interface';

import { currentLand } from '@/scripts/services/axios/requests/land/land.service';

import { getLevel, getProgressToNextLevel } from '@/scripts/utils/level.util';

import { useQuery } from '@tanstack/react-query';
import { useScreenSizeStage } from '@/hooks/use-screen-size-stage';

import Text from '../common/text';
import Sprite from '../common/sprite';

const StatusLevel: React.FC = () => {
  const { getCurrentSizeStage } = useScreenSizeStage();

  const { data: land } = useQuery<TResponse<ILand>>({
    queryKey: ['land'],
    queryFn: async () => {
      return await currentLand();
    },
  });

  const progress = land ? getProgressToNextLevel(land.data.exp) : 0;

  return (
    <div className="flex items-center gap-4">
      <div
        style={{ width: getCurrentSizeStage(210), height: getCurrentSizeStage(210) }}
        className="relative flex items-center justify-center"
      >
        <span
          className="absolute bottom-0 -z-10 w-full bg-[#3ec0ee]"
          style={{ height: `${progress}%` }}
        />
        <Sprite src="/ui/bg-level-hud.png" className="relative" width={210} />
        <Text size={70} className="absolute">
          {land ? getLevel(land.data.exp) : 0}
        </Text>
      </div>
      <Text size={70}>{land ? land.data.name : 'LOADING'}</Text>
    </div>
  );
};

export default StatusLevel;
