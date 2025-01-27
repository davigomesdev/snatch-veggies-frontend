import { TResponse } from '@/core/types/response.type';

import { IUser } from '@/core/interfaces/user.interface';

import { DepositCoinUserDTO } from '@/scripts/services/axios/requests/user/dtos/deposit-coin-user.dto';
import { WithdrawCoinUserDTO } from '@/scripts/services/axios/requests/user/dtos/withdraw-coin-user.dto';

import {
  currentUser,
  depositCoinUser,
  withdrawCoinUser,
} from '@/scripts/services/axios/requests/user/user.service';

import {
  allowance,
  approve,
} from '@/scripts/services/ethers/request/snatch-veggies/snatch-veggies.service';

import {
  allowanceEther,
  approveEther,
  feeEther,
} from '@/scripts/services/ethers/request/snatch-veggies-bank/snatch-veggies-bank.service';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Text from '../common/text';
import Sprite from '../common/sprite';
import Button from '../common/button';
import Input from '../common/input';

const WalletModal: React.FC = () => {
  const [menu, setMenu] = useState<React.JSX.Element>(<Deposit />);

  const { data: user } = useQuery<TResponse<IUser>>({
    queryKey: ['user'],
    queryFn: async () => {
      return await currentUser();
    },
  });

  const handleOnClickSetMenu = (menu: React.JSX.Element): void => {
    setMenu(menu);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 px-7 py-10">
      <div>
        <Text size={80}>TOTAL BALANCE</Text>
        <div className="flex w-full items-center justify-center gap-2">
          <Sprite src="/ui/coin.png" width={100} height={100} />
          <Text size={80}>{user ? user.data.gold : 0}</Text>
        </div>
      </div>
      <div className="mt-8 flex h-full flex-col justify-center gap-2">
        <div className="flex items-center justify-center gap-4 border-b-[3px] border-[#431c0e] pb-5">
          <Button size="small" onClick={() => handleOnClickSetMenu(<Deposit />)}>
            <Text size={40}>DEPOSIT</Text>
          </Button>
          <Button variant="danger" size="small" onClick={() => handleOnClickSetMenu(<Withdraw />)}>
            <Text size={40}>WITHDRAW</Text>
          </Button>
        </div>
        {menu}
      </div>
    </div>
  );
};

const Deposit: React.FC = () => {
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<string>('');

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: DepositCoinUserDTO) => {
      const allowanceAmount = await allowance();

      if (input.amount > allowanceAmount) {
        await approve({
          amount: input.amount.toString(),
        });
      }

      const feeAmountEther = await feeEther();
      const allowanceAmountEther = await allowanceEther();

      if (feeAmountEther > allowanceAmountEther) {
        await approveEther({
          amount: feeAmountEther.toString(),
        });
      }

      return await depositCoinUser(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });

      setAmount('');
    },
  });

  const handleOnChangeSetAmount = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const targetValue: string = event.target.value;
    const sanitizedValue: string = targetValue.replace(/[^0-9.]/g, '');
    setAmount(sanitizedValue);
  };

  const handleOnClickDeposit = (): void => {
    mutate({
      amount: Number(amount),
    });
  };

  return (
    <>
      <Text size={80} className="mt-4">
        DEPOSIT FORM
      </Text>
      <div className="mt-5 flex flex-col items-center justify-center gap-1 sm:gap-3">
        <Input
          placeholder="0.0"
          onChange={handleOnChangeSetAmount}
          value={amount}
          disabled={isPending}
        />
        <Button onClick={handleOnClickDeposit} disabled={isPending}>
          <Text size={40}>{isPending ? 'WAIT...' : 'EXECUTE'}</Text>
        </Button>
      </div>
    </>
  );
};

const Withdraw: React.FC = () => {
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<string>('');

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: WithdrawCoinUserDTO) => {
      const feeAmountEther = await feeEther();
      const allowanceAmountEther = await allowanceEther();

      if (feeAmountEther > allowanceAmountEther) {
        await approveEther({
          amount: feeAmountEther.toString(),
        });
      }

      return await withdrawCoinUser(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });

      setAmount('');
    },
  });

  const handleOnChangeSetAmount = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const targetValue: string = event.target.value;
    const sanitizedValue: string = targetValue.replace(/[^0-9.]/g, '');
    setAmount(sanitizedValue);
  };

  const handleOnClickDeposit = (): void => {
    mutate({
      amount: Number(amount),
    });
  };

  return (
    <>
      <Text size={80}>WITHDRAW FORM</Text>
      <div className="mt-5 flex flex-col items-center justify-center gap-1 sm:gap-3">
        <Input
          placeholder="0.0"
          onChange={handleOnChangeSetAmount}
          value={amount}
          disabled={isPending}
        />
        <Button onClick={handleOnClickDeposit} disabled={isPending}>
          <Text size={40}>{isPending ? 'WAIT...' : 'EXECUTE'}</Text>
        </Button>
      </div>
    </>
  );
};

export default WalletModal;
