import SnatchVeggies from '@/assets/json/SnatchVeggies.json';

import { getWalletProvider, MESSEGER_ADDRESS, SNATCH_VEGGIES_CONTRACT } from '../../ethers.service';

import { ApproveDTO } from './dtos/approve.dto';

import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';
import { TransactionResponse, JsonRpcSigner } from 'ethers/providers';

export const balanceOf = async (account: string): Promise<string> => {
  const ethersProvider: BrowserProvider = new BrowserProvider(getWalletProvider());
  const signer: JsonRpcSigner = await ethersProvider.getSigner();

  const contract: Contract = new Contract(SNATCH_VEGGIES_CONTRACT, SnatchVeggies.abi, signer);

  const decimals: bigint = await contract.decimals();
  const balance: bigint = await contract.balanceOf(account);

  return formatUnits(balance, Number(decimals));
};

export const allowance = async (): Promise<number> => {
  const ethersProvider: BrowserProvider = new BrowserProvider(getWalletProvider());

  const signer: JsonRpcSigner = await ethersProvider.getSigner();
  const account: string = await signer.getAddress();

  const contract: Contract = new Contract(SNATCH_VEGGIES_CONTRACT, SnatchVeggies.abi, signer);

  const decimals: bigint = await contract.decimals();
  const allowanceAmount: bigint = await contract.allowance(account, MESSEGER_ADDRESS);

  return Number(formatUnits(allowanceAmount, Number(decimals)));
};

export const approve = async (input: ApproveDTO): Promise<void> => {
  const ethersProvider: BrowserProvider = new BrowserProvider(getWalletProvider());
  const signer: JsonRpcSigner = await ethersProvider.getSigner();

  const contract: Contract = new Contract(SNATCH_VEGGIES_CONTRACT, SnatchVeggies.abi, signer);
  const decimals: bigint = await contract.decimals();

  const tx: TransactionResponse = await contract.approve(
    MESSEGER_ADDRESS,
    parseUnits(input.amount, Number(decimals)),
  );
  await tx.wait();
};
