import { createConfig, http } from "wagmi";
import { defineChain } from "viem";
import { metaMask, walletConnect } from "wagmi/connectors";

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

const bscTestnetTransports = [
  "https://data-seed-prebsc-1-s1.binance.org:8545",
  "https://data-seed-prebsc-2-s1.binance.org:8545",
  "https://data-seed-prebsc-1-s2.binance.org:8545",
  "https://data-seed-prebsc-2-s2.binance.org:8545",
  "https://data-seed-prebsc-1-s3.binance.org:8545",
  "https://bsc-testnet-rpc.publicnode.com",
];

export const wagmiConfig = createConfig({
  chains: [bscTestnet],
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
})
  ],
  transports: {
    [bscTestnet.id]: http(bscTestnetTransports[0], {
      batch: true,
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
});
