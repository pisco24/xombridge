/* eslint-disable @typescript-eslint/no-explicit-any */

import { tokenItems } from "@/config";
import { getTokenBalance, quoteSend, send } from "./contract";
import { NetworkInfo, TokenBalance } from "@/types";

export { bridgeABI } from "./bridgeABI";
export { erc20ABI } from "./erc20ABI";
export {
  getTokenBalance,
  estimateTransactionGas,
  estimateTransactionTime,
} from "./contract";
import { ethers } from "ethers";
import bs58 from "bs58";

export const getWalletBalance = async (
  network: NetworkInfo,
  address: string,
  context: any
) => {
  const coinBalance: TokenBalance[] = [];
  try {
    const coins = tokenItems[network.chainId];
    for (let i = 0; i < coins.length; i++) {
      const balance = await getTokenBalance(
        address,
        coins[i].address,
        network.chainId,
        context
      );
      coinBalance.push({
        symbol: coins[i].symbol,
        balance: balance.toFixed(3),
      });
    }
    return coinBalance;
  } catch (error) {
    console.log("error: ", error);
    return coinBalance;
  }
};

const addressToBytes32 = (address: string): string => {
  // Pad the address to 32 bytes (64 characters)
  const paddedAddress = ethers.zeroPadValue(address, 32);

  return paddedAddress;
};

const uint8ArrayToHex = (uint8Array: Uint8Array): string => {
  return (
    "0x" +
    Array.from(uint8Array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
};

export const executeBrige = async (
  fromNetwork: NetworkInfo,
  toNetwork: NetworkInfo,
  recipient: string,
  refundAddress: string,
  amount: number,
  context: any
) => {
  try {
    const sendParam = {
      dstEid: toNetwork.endpointId,
      to: addressToBytes32(
        toNetwork.symbol == "SOL"
          ? uint8ArrayToHex(bs58.decode(recipient))
          : recipient
      ),
      amountLD: (amount * 1e18).toString(),
      minAmountLD: (amount * 9 * 1e17).toString(),
      extraOptions: "0x",
      composeMsg: "0x",
      oftCmd: "0x",
    };

    const msgFee = await quoteSend(
      fromNetwork.bridge,
      fromNetwork.chainId,
      sendParam,
      context
    );

    if (!msgFee) return null;

    const result = await send(
      fromNetwork.bridge,
      sendParam,
      msgFee,
      refundAddress,
      fromNetwork.chainId,
      context
    );

    return result;
  } catch (error: any) {
    console.log("execute bridge error: ", error);
    return null;
  }
};
