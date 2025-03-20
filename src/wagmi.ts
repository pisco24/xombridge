import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// import { defineChain } from 'viem';
import {
  bsc,
  bscTestnet,
  base,
  baseSepolia,
  avalanche,
  avalancheFuji,
  arbitrum,
  arbitrumSepolia,
  mainnet,
  sepolia,
  sonic,
  sonicTestnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
} from "wagmi/chains";

// export const mainnet = defineChain({
//   id: 1,
//   name: 'Ethereum',
//   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: ['https://eth.merkle.io'],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: 'Etherscan',
//       url: 'https://etherscan.io',
//       apiUrl: 'https://api.etherscan.io/api',
//     },
//   },
//   contracts: {
//     ensRegistry: {
//       address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
//     },
//     ensUniversalResolver: {
//       address: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
//       blockCreated: 19_258_213,
//     },
//     multicall3: {
//       address: '0xca11bde05977b3631167028862be2a173976ca11',
//       blockCreated: 14_353_601,
//     },
//   },
// });

export const chains =
  process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
    ? [
        bscTestnet,
        baseSepolia,
        arbitrumSepolia,
        avalancheFuji,
        sepolia,
        sonicTestnet,
        optimismSepolia,
        polygonAmoy,
      ]
    : [bsc, base, arbitrum, avalanche, mainnet, sonic, optimism, polygon];

export const config = getDefaultConfig({
  appName: "Xombol Bridge",
  projectId: "c82d212e5ab1085b51bb4ee038d2f637",
  chains:
    process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [
          bscTestnet,
          baseSepolia,
          arbitrumSepolia,
          avalancheFuji,
          sepolia,
          sonicTestnet,
          optimismSepolia,
          polygonAmoy,
        ]
      : [bsc, base, arbitrum, avalanche, mainnet, sonic, optimism, polygon],
  ssr: true,
});
