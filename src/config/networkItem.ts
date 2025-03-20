import { NetworkInfo } from "@/types";
import Arbitrum from '../assets/Arbitrum.svg';
import Avalanche from '../assets/Avalanche.svg';
import BSC from "../assets/BSC.svg";
import base from "../assets/base.svg";
import Solana from "../assets/Solana.svg";
import Ethereum from "../assets/ethereum.svg";
import Sonic from "../assets/Sonic.png";
import Optimism from "../assets/optimism.png";
import Polygon from "../assets/polygon.svg";

export const networkItems: NetworkInfo[] = (process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [
    {
        chainId: 421614,
        endpointId: 40231,
        label: "Arbitrum Sepolia",
        symbol: "ETH",
        bridge: '0x1835402d7d834976B2D0ba01ee96d1A6729F4B35',
        scanUrl: 'https://sepolia.arbiscan.io/',
        icon: Arbitrum.src
    },
    {
        chainId: 43113,
        endpointId: 40106,
        label: "Avalanche Testnet",
        symbol: "AVAX",
        bridge: '0x707CB551Cda6ad64aead159e35189a011d287B51',
        scanUrl: 'https://testnet.avascan.info/',
        icon: Avalanche.src
    },
    {
        chainId: 84532,
        endpointId: 40245,
        label: "Base Sepolia",
        symbol: "ETH",
        bridge: '0x82CE7f47f72a97c1c7eDa044Afe494D16244aB80',
        scanUrl: 'https://sepolia.basescan.org/',
        icon: base.src
    },
    {
        chainId: 97,
        endpointId: 40102,
        label: "BSC Testnet",
        symbol: "tBNB",
        bridge: '0xd9811096704e8F409995E30dFf8F6116c167F40d',
        scanUrl: 'https://testnet.bscscan.com',
        icon: BSC.src
    },
    {
        chainId: 103,
        endpointId: 40168,
        label: "Solana Devnet",
        symbol: "SOL",
        bridge: 'HMLxsSaMkqv5d4MizvzpT8WZMaQR7DX9GeU6GPzJZnaa',
        scanUrl: 'https://solscan.io/?cluster=devnet',
        icon: Solana.src
    },
]:[
    {
        chainId: 1,
        endpointId: 30101,
        label: "Ethereum",
        symbol: "ETH",
        bridge: '0xc064A35898D69f2c84D0094c603985Ba1490A52B',
        scanUrl: 'https://etherscan.io/',
        icon: Ethereum.src
    },
    {
        chainId: 42161,
        endpointId: 30110,
        label: "Arbitrum",
        symbol: "ETH",
        bridge: '0xc064A35898D69f2c84D0094c603985Ba1490A52B',
        scanUrl: 'https://arbiscan.io/',
        icon: Arbitrum.src
    },
    {
        chainId: 43114,
        endpointId: 30106,
        label: "Avalanche",
        symbol: "AVAX",
        bridge: '0xc064A35898D69f2c84D0094c603985Ba1490A52B',
        scanUrl: 'https://avascan.info/',
        icon: Avalanche.src
    },
    {
        chainId: 8453,
        endpointId: 30184,
        label: "Base",
        symbol: "ETH",
        bridge: '0xc064A35898D69f2c84D0094c603985Ba1490A52B',
        scanUrl: 'https://basescan.org/',
        icon: base.src
    },
    {
        chainId: 56,
        endpointId: 30102,
        label: "BSC",
        symbol: "BNB",
        bridge: '0xc064A35898D69f2c84D0094c603985Ba1490A52B',
        scanUrl: 'https://bscscan.com/',
        icon: BSC.src
    },
    {
        chainId: 101,
        endpointId: 30168,
        label: "Solana",
        symbol: "SOL",
        bridge: 'HNnZj6t26y516eNoLVoaNUDpUxz1oj1g7pTrWty3SKxm',
        scanUrl: 'https://solscan.io/',
        icon: Solana.src
    },
    {
        chainId: 146,
        endpointId: 30332,
        label: "Sonic",
        symbol: "S",
        bridge: '0xc064A35898D69f2c84D0094c603985Ba1490A52B',
        scanUrl: 'https://sonicscan.org/',
        icon: Sonic.src
    },
    {
        chainId: 10,
        endpointId: 30111,
        label: "Optimism",
        symbol: "ETH",
        bridge: '0xc064A35898D69f2c84D0094c603985Ba1490A52B',
        scanUrl: 'https://optimistic.etherscan.io/',
        icon: Optimism.src
    },
    {
        chainId: 137,
        endpointId: 30109,
        label: "Polygon",
        symbol: "POL",
        bridge: '0xc064A35898D69f2c84D0094c603985Ba1490A52B',
        scanUrl: 'https://polygonscan.com/',
        icon: Polygon.src
    },
]);