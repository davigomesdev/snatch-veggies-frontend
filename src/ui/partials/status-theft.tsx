import { TResponse } from '@/core/types/response.type';

import { ILand } from '@/core/interfaces/land.interface';

import { currentLand } from '@/scripts/services/axios/requests/land/land.service';

import { calculateMaxQuantity } from '@/scripts/utils/level.util';

import { useQuery } from '@tanstack/react-query';

import Text from '../common/text';
import Sprite from '../common/sprite';
import { isToday } from 'date-fns';

const StatusTheft: React.FC = () => {
  const { data: land } = useQuery<TResponse<ILand>>({
    queryKey: ['land'],
    queryFn: async () => {
      return await currentLand();
    },
  });

  const maxQuantity = calculateMaxQuantity(5, land?.data.exp ?? 0);

  let theftCount = 0;

  if (land && isToday(land.data.lastTheftDate)) {
    theftCount = land.data.theftCount;
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <Sprite src="/ui/theft.png" width={140} />
      <Text size={70}>
        {maxQuantity - theftCount}/{maxQuantity}
      </Text>
    </div>
  );
};

export default StatusTheft;
