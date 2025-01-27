import { Eip1193Provider } from 'ethers/providers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

export const projectId = import.meta.env.VITE_WC_PROJECT_ID;
export const matchId = Number(import.meta.env.VITE_MATCH_ID);

export const MESSEGER_ADDRESS = import.meta.env.VITE_PUBLIC_MESSEGER_ADDRESS;
export const SNATCH_VEGGIES_CONTRACT = import.meta.env.VITE_SNATCH_VEGGIES_CONTRACT;
export const SNATCH_VEGGIES_BANK_CONTRACT = import.meta.env.VITE_SNATCH_VEGGIES_BANK_CONTRACT;
export const SNATCH_VEGGIES_LAND_CONTRACT = import.meta.env.VITE_SNATCH_VEGGIES_LAND_CONTRACT;

const match = {
  chainId: matchId,
  name: 'Matchain',
  currency: 'BNB',
  explorerUrl: 'https://matchscan.io',
  rpcUrl: import.meta.env.VITE_MATCH_RPC,
};

const metadata = {
  name: 'Snatch Veggies',
  description: 'Snatch Veggies',
  url: 'https://snatchveggies.com',
  icons: ['https://snatchveggies.com'],
};

const config = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
});

const web3Modal = createWeb3Modal({
  ethersConfig: config,
  chains: [match],
  projectId,
  themeMode: 'light',
  enableAnalytics: false,
  enableOnramp: true,
});

export const getWalletProvider = (): Eip1193Provider => {
  const provider: any = web3Modal.getWalletProvider();
  if (!provider) {
    throw new Error('Wallet provider not initialized.');
  }

  return provider;
};
