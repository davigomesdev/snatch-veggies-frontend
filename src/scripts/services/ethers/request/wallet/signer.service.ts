import { getWalletProvider } from '../../ethers.service';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

export const getSigner = async (): Promise<JsonRpcSigner> => {
  const ethersProvider: BrowserProvider = new BrowserProvider(getWalletProvider());
  const signer: JsonRpcSigner = await ethersProvider.getSigner();
  return signer;
};

export const signMessage = async (message: string): Promise<string> => {
  try {
    const signer = await getSigner();
    return await signer.signMessage(message);
  } catch (error) {
    throw new Error('Failed to sign message.');
  }
};
