import { TResponse } from '@/core/types/response.type';

import { IUser } from '@/core/interfaces/user.interface';

import { currentUser } from '@/scripts/services/axios/requests/user/user.service';

import { useQuery } from '@tanstack/react-query';
import { useModal } from '@/providers/modal-provider';

import Text from '../common/text';
import Sprite from '../common/sprite';
import WalletModal from '../modals/wallet-modal';

const StatusCoin: React.FC = () => {
  const { toggleModal } = useModal();

  const { data: user } = useQuery<TResponse<IUser>>({
    queryKey: ['user'],
    queryFn: async () => {
      return await currentUser();
    },
  });

  const handleOnClick = (): void => {
    toggleModal(<WalletModal />, 'VIRTUAL WALLET', 'w-fit');
  };

  return (
    <button className="flex items-center justify-center gap-3" onClick={handleOnClick}>
      <Sprite src="/ui/coin.png" width={130} />
      <Text size={70}>{user ? user.data.gold : 0}</Text>
    </button>
  );
};

export default StatusCoin;
