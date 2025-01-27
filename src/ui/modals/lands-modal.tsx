import event from '@/scripts/systems/event';

import { TResponse } from '@/core/types/response.type';

import { IUser } from '@/core/interfaces/user.interface';
import { ILand } from '@/core/interfaces/land.interface';

import { EventEnum } from '@/core/enums/event.enum';

import { currentUser } from '@/scripts/services/axios/requests/user/user.service';
import { listLands } from '@/scripts/services/axios/requests/land/land.service';

import { getLevel } from '@/scripts/utils/level.util';

import { useQuery } from '@tanstack/react-query';
import { useModal } from '@/providers/modal-provider';

import Text from '../common/text';
import Button from '../common/button';
import Sprite from '../common/sprite';

interface LandItemProps {
  tokenId: number;
  name: string;
  exp: number;
}

const LandsModal: React.FC = () => {
  const { data: user } = useQuery<TResponse<IUser>>({
    queryKey: ['user'],
    queryFn: async () => {
      return await currentUser();
    },
  });

  const { data: lands } = useQuery<TResponse<ILand[]>>({
    queryKey: ['lands'],
    queryFn: async () => {
      return await listLands();
    },
  });

  const filteredLands = lands?.data.filter((land) => land.userId !== user?.data.id);

  return (
    <div className="flex w-full flex-col gap-3 p-5 pt-14">
      {filteredLands && filteredLands.map((land) => <LandItem key={land.id} {...land} />)}
    </div>
  );
};

const LandItem: React.FC<LandItemProps> = ({ tokenId, name, exp }) => {
  const { closeModal } = useModal();

  const handleOnClick = (): void => {
    closeModal();
    event.emit(EventEnum.VISIT, tokenId);
  };

  return (
    <div className="flex w-full items-center justify-between gap-3 border-[3px] border-[#431c0e] p-2">
      <div className="flex items-center gap-5">
        <div className="flex w-fit items-center justify-center">
          <Sprite src="/ui/bg-level-hud.png" width={210} />
          <Text size={70} className="absolute">
            {getLevel(exp)}
          </Text>
        </div>
        <Text size={80}>{name}</Text>
      </div>
      <Button size="small" onClick={handleOnClick}>
        <Text size={50}>EXPLORE</Text>
      </Button>
    </div>
  );
};

export default LandsModal;
