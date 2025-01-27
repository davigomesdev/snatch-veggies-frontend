import SnatchVeggiesBank from '@/assets/json/SnatchVeggiesBank.json';

import { getWalletProvider, SNATCH_VEGGIES_BANK_CONTRACT } from '../../ethers.service';

import { ApproveDTO } from './dtos/approve.dto';

import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';
import { TransactionResponse, JsonRpcSigner } from 'ethers/providers';

export const feeEther = async (): Promise<number> => {
  const ethersProvider: BrowserProvider = new BrowserProvider(getWalletProvider());
  const signer: JsonRpcSigner = await ethersProvider.getSigner();

  const contract: Contract = new Contract(
    SNATCH_VEGGIES_BANK_CONTRACT,
    SnatchVeggiesBank.abi,
    signer,
  );
  const fee: bigint = await contract.fee();

  return Number(formatEther(fee));
};

export const allowanceEther = async (): Promise<number> => {
  const ethersProvider: BrowserProvider = new BrowserProvider(getWalletProvider());

  const signer: JsonRpcSigner = await ethersProvider.getSigner();
  const account: string = await signer.getAddress();

  const contract: Contract = new Contract(
    SNATCH_VEGGIES_BANK_CONTRACT,
    SnatchVeggiesBank.abi,
    signer,
  );
  const allowanceAmount: bigint = await contract.allowances(account);

  return Number(formatEther(allowanceAmount));
};

export const approveEther = async (input: ApproveDTO): Promise<void> => {
  const ethersProvider: BrowserProvider = new BrowserProvider(getWalletProvider());
  const signer: JsonRpcSigner = await ethersProvider.getSigner();

  const contract: Contract = new Contract(
    SNATCH_VEGGIES_BANK_CONTRACT,
    SnatchVeggiesBank.abi,
    signer,
  );

  const tx: TransactionResponse = await contract.approve({ value: parseEther(input.amount) });
  await tx.wait();
};
