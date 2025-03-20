import { TokenInfo } from "@/types";
import new_logo from "../assets/new_logo.png";

export const tokenItems: Record<number, TokenInfo[]> =
  process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
    ? {
        [421614]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0x1835402d7d834976B2D0ba01ee96d1A6729F4B35",
            isNative: false,
            fee: 0.0,
            chainId: 421614,
            icon: new_logo.src,
          },
        ],
        [43113]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0x707CB551Cda6ad64aead159e35189a011d287B51",
            isNative: false,
            fee: 0.0,
            chainId: 43113,
            icon: new_logo.src,
          },
        ],
        [84532]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0x82CE7f47f72a97c1c7eDa044Afe494D16244aB80",
            isNative: false,
            fee: 0,
            chainId: 84532,
            icon: new_logo.src,
          },
        ],
        [97]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0x452d953F6b48dd4f89A0b91eCa8B66B6360a82a7",
            isNative: false,
            fee: 0.0,
            chainId: 97,
            icon: new_logo.src,
          },
        ],
        [103]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 9,
            address: "FLJi7ZEqJBzD4F7dA7vyjCxvqrAbaBk6aRF5rtiTjjXD",
            isNative: false,
            fee: 0.0,
            chainId: 103,
            icon: new_logo.src,
          },
        ],
      }
    : {
        [1]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0xc064A35898D69f2c84D0094c603985Ba1490A52B",
            isNative: false,
            fee: 0.0,
            chainId: 1,
            icon: new_logo.src,
          },
        ],
        [42161]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0xc064A35898D69f2c84D0094c603985Ba1490A52B",
            isNative: false,
            fee: 0.0,
            chainId: 42161,
            icon: new_logo.src,
          },
        ],
        [43114]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0xc064A35898D69f2c84D0094c603985Ba1490A52B",
            isNative: false,
            fee: 0.0,
            chainId: 43114,
            icon: new_logo.src,
          },
        ],
        [8453]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0xc064A35898D69f2c84D0094c603985Ba1490A52B",
            isNative: false,
            fee: 0.0,
            chainId: 8453,
            icon: new_logo.src,
          },
        ],
        [56]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0xc064A35898D69f2c84D0094c603985Ba1490A52B",
            isNative: false,
            fee: 0.0,
            chainId: 56,
            icon: new_logo.src,
          },
        ],
        [101]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 9,
            address: "HhjSQ6ghaixc5v3fYoNrsgNgGT9yNNgHtZYpfKdAHCSm",
            isNative: false,
            fee: 0.0,
            chainId: 101,
            icon: new_logo.src,
          },
        ],
        [146]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0xc064A35898D69f2c84D0094c603985Ba1490A52B",
            isNative: false,
            fee: 0.0,
            chainId: 146,
            icon: new_logo.src,
          },
        ],
        [10]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0xc064A35898D69f2c84D0094c603985Ba1490A52B",
            isNative: false,
            fee: 0.0,
            chainId: 10,
            icon: new_logo.src,
          },
        ],
        [137]: [
          {
            name: "Xombol",
            symbol: "XOM",
            decimals: 18,
            address: "0xc064A35898D69f2c84D0094c603985Ba1490A52B",
            isNative: false,
            fee: 0.0,
            chainId: 137,
            icon: new_logo.src,
          },
        ],
      };
