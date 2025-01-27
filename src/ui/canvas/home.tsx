import Cookies from 'js-cookie';

import { ILand } from '@/core/interfaces/land.interface';

import { PageUrlEnum } from '@/core/enums/page-url.enum';

import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  useDisconnect,
  useSwitchNetwork,
  useWeb3Modal,
  useWeb3ModalAccount,
} from '@web3modal/ethers/react';

import { RequestNonceDTO } from '@/scripts/services/axios/requests/auth/dtos/request-nonce.dto';

import { matchId } from '@/scripts/services/ethers/ethers.service';

import { signMessage } from '@/scripts/services/ethers/request/wallet/signer.service';
import { requestNonce, signin } from '@/scripts/services/axios/requests/auth/auth.service';
import { mint } from '@/scripts/services/ethers/request/snatch-veggies-land/snatch-veggies-land.service';
import {
  currentCreate,
  currentLandList,
} from '@/scripts/services/axios/requests/land/land.service';

import { motion } from 'framer-motion';

import Text from '../common/text';
import Sprite from '../common/sprite';

const Home: React.FC = () => {
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const { isConnected, chainId, address } = useWeb3ModalAccount();

  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: RequestNonceDTO) => {
      const response = await requestNonce(input);

      const message = `Please sign this message to login: ${response.data.nonce}`;
      const signature = await signMessage(message);

      let data: ILand[];

      await signin({
        address: address!,
        signature,
      });

      await currentCreate();
      data = (await currentLandList()).data;

      if (data.length === 0) {
        await mint();
        await currentCreate();

        data = (await currentLandList()).data;
      }

      Cookies.set('landId', data[0].id, {
        path: '/',
      });
    },
    onSuccess: () => {
      navigate(PageUrlEnum.GAME);
    },
    onError: () => {
      disconnect();
    },
  });

  const handleOnClickConnect = (): void => {
    open();
  };

  const handleOnClickSignIn = (): void => {
    mutate({ address: address! });
  };

  useEffect(() => {
    if (chainId !== matchId) {
      switchNetwork(matchId);
    }
  }, [chainId]);

  return (
    <main className="flex h-screen w-full bg-[url('/background.png')] bg-cover bg-center">
      <section className="flex h-full w-full flex-1 flex-col items-center justify-center">
        <motion.div
          className="w-full sm:max-w-[350px] md:max-w-[650px]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/logo.png" className="w-full" alt="Snatch Veggies" />
        </motion.div>
        {isConnected ? (
          <motion.button
            onClick={handleOnClickSignIn}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            disabled={isPending}
          >
            <Sprite src="/ui/buttons/play-button.png" width={320} />
          </motion.button>
        ) : (
          <motion.button
            onClick={handleOnClickConnect}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            disabled={isPending}
          >
            <Sprite src="/ui/buttons/connect-button.png" width={320} />
          </motion.button>
        )}
        <Text size={70} className="absolute bottom-5 mt-10 px-5 text-center">
          Welcome to matchain word farm. Building in matchain!
        </Text>
      </section>
    </main>
  );
};

export default Home;
