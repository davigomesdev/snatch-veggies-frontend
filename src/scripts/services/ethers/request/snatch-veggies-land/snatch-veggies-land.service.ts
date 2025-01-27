import SnatchVeggiesLand from '@/assets/json/SnatchVeggiesLand.json';

import { getWalletProvider, SNATCH_VEGGIES_LAND_CONTRACT } from '../../ethers.service';

import { BrowserProvider, Contract } from 'ethers';
import { TransactionResponse, JsonRpcSigner } from 'ethers/providers';

export const mint = async (): Promise<void> => {
  const ethersProvider: BrowserProvider = new BrowserProvider(getWalletProvider());
  const signer: JsonRpcSigner = await ethersProvider.getSigner();

  const contract: Contract = new Contract(
    SNATCH_VEGGIES_LAND_CONTRACT,
    SnatchVeggiesLand.abi,
    signer,
  );

  const tx: TransactionResponse = await contract.mint({ value: 0n });
  await tx.wait();
};
