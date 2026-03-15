import { defineChain } from "viem";
import { metaMask, walletConnect } from "wagmi/connectors";
import { ACTIVE_CHAIN_ID } from "./contracts";
import { createConfig, http, fallback } from "wagmi";

// BSC Mainnet
export const bscMainnet = defineChain({
  id: 56,
  name: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://bsc-dataseed.binance.org"],
    },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
  },
  testnet: false,
});

// BSC Testnet (kept for development)
export const bscTestnet = defineChain({
  id: 97,
  name: "BSC Testnet",
  nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://testnet.bscscan.com" },
  },
  testnet: true,
});

// Pick active chain based on config
export const activeChain = ACTIVE_CHAIN_ID === 56 ? bscMainnet : bscTestnet;

const bscMainnetRpcs = [
  `https://bnb-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_RPC_KEY}`,
  "https://bsc-dataseed.binance.org",
  "https://bsc-dataseed1.defibit.io",
  "https://bsc-dataseed1.ninicoin.io",
  "https://bsc.publicnode.com",
  "https://bsc-dataseed2.binance.org",
  "https://bsc-dataseed3.binance.org",
];

const bscTestnetRpcs = [
 `https://bnb-testnet.g.alchemy.com/v2/${import.meta.env.VITE_RPC_KEY}`,
  "https://data-seed-prebsc-1-s1.binance.org:8545",
  "https://data-seed-prebsc-2-s1.binance.org:8545",
  "https://bsc-testnet-rpc.publicnode.com",
];

const transports = ACTIVE_CHAIN_ID === 56
  ? {
      [bscMainnet.id]: fallback(
        bscMainnetRpcs.map(rpc => http(rpc, { batch: true, retryCount: 2, retryDelay: 500 }))
      )
    }
  : {
      [bscTestnet.id]: fallback(
        bscTestnetRpcs.map(rpc => http(rpc, { batch: true, retryCount: 2, retryDelay: 500 }))
      )
    };

export const wagmiConfig = createConfig({
  chains: [activeChain],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "MYBUBU",
        url: window.location.origin,
      },
    }),
    walletConnect({
      projectId: "299d3861cbb9c565794a7c343d2ed767",
      metadata: {
        name: "MYBUBU",
        description: "MYBUBU dApp",
        url: window.location.origin,
        icons: [],
      },
    }),
  ],
  transports,
});
