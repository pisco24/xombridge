/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  readContract,
  getBalance,
  estimateFeesPerGas,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { erc20ABI } from "./erc20ABI";
import { bridgeABI } from "./bridgeABI";
import { decimalToEth, decimalToUSD } from "@/utils/functions";
import { networkItems } from "@/config";
// import { parseEther } from "viem";
import {
  getAddress,
  encodeFunctionData,
  createPublicClient,
  http,
  formatUnits,
} from "viem";
import { chains } from "@/wagmi";

export const getTokenBalance = async (
  walletAddress: string,
  tokenAddress: string,
  chainId: number,
  wagmiContext: any
) => {
  if (tokenAddress === "0x0000000000000000000000000000000000000000") {
    try {
      const formattedWalletAddress = getAddress(walletAddress);
      const balance = await getBalance(wagmiContext, {
        address: formattedWalletAddress,
        chainId,
      });
      return decimalToEth(balance.value.toString());
    } catch (error) {
      console.error("Invalid error:", error);
      return 0;
    }
  } else if (tokenAddress == "") {
    return 0;
  } else {
    try {
      const formattedAddress = getAddress(tokenAddress);
      const formattedWalletAddress = getAddress(walletAddress);
      const amount = (await readContract(wagmiContext, {
        abi: erc20ABI,
        address: formattedAddress, // Use the formatted address
        functionName: "balanceOf",
        args: [formattedWalletAddress],
        chainId,
      })) as bigint;
      return decimalToUSD(amount.toString(), chainId);
    } catch (error) {
      console.error("Get balance failed:", tokenAddress, error);
      return 0;
    }
  }
};

async function getGasEstimation(wagmiContext: any, chainId: number) {
  try {
    // Try EIP-1559 fees first
    const feesPerGas = await estimateFeesPerGas(wagmiContext, {
      formatUnits: "ether",
      chainId,
    });
    console.log("EIP-1559 Fees:", feesPerGas);
    return feesPerGas; // Return EIP-1559 gas fees if available
  } catch (e) {
    console.warn(
      "EIP-1559 fees not supported, falling back to legacy gas price.",
      e
    );

    const feesPerGas = await estimateFeesPerGas(wagmiContext, {
      formatUnits: "ether",
      chainId,
      type: "legacy",
    });
    console.log("Legacy Gas Price:", feesPerGas);
    return feesPerGas; // Return the legacy gas price
  }
}

export const estimateTransactionGas = async (
  chainId: number,
  targetWalletAddress: string,
  tokenAddress: string,
  value: bigint,
  wagmiContext: any
) => {
  try {
    const publicClient = createPublicClient({
      chain: chains.find((chain) => chain.id == chainId), // Change this to your target chain
      transport: chainId === 1 ? http("https://eth.merkle.io") : http(),
    });

    const bridgeAddresss = networkItems.find(
      (item) => item.chainId == chainId
    )?.bridge;
    if (!bridgeAddresss) {
      throw new Error("bridge address is undefined");
    }
    const formattedBridgeAddress = getAddress(bridgeAddresss);
    const formattedTokenAddress = getAddress(tokenAddress);

    const feesPerGas = await getGasEstimation(wagmiContext, chainId);
    const dataApprove = encodeFunctionData({
      abi: erc20ABI,
      functionName: "approve",
      args: [tokenAddress, value.toString()],
    });

    const gasEstimateApprove = await publicClient.estimateGas({
      to: formattedTokenAddress,
      data: dataApprove,
      account: "0x1e890c32D69C2a83bffDf1f2E90DF0a0b9f3B1fa",
    });
    console.log("gasEstimateApprove: ", gasEstimateApprove);
    const data = encodeFunctionData({
      abi: bridgeABI,
      functionName: "depositToken",
      args: [
        formattedTokenAddress,
        "1",
        targetWalletAddress,
        chainId.toString(),
      ],
    });
    const gasEstimateDeposit = await publicClient.estimateGas({
      to: formattedBridgeAddress,
      data: data,
      gas: BigInt("2100000"),
      account: "0x1e890c32D69C2a83bffDf1f2E90DF0a0b9f3B1fa",
    });
    console.log("gasEstimateDeposit: ", gasEstimateDeposit);
    let estimatedGas;
    if (feesPerGas.maxFeePerGas) {
      estimatedGas =
        Number(
          gasEstimateDeposit * BigInt(2) + gasEstimateApprove * BigInt(2)
        ) * Number(feesPerGas.formatted.maxFeePerGas.toString());
    } else if (feesPerGas.gasPrice) {
      estimatedGas =
        Number(
          gasEstimateDeposit * BigInt(2) + gasEstimateApprove * BigInt(2)
        ) * Number(feesPerGas.formatted.gasPrice.toString());
    } else {
      estimatedGas =
        Number(
          gasEstimateDeposit * BigInt(2) + gasEstimateApprove * BigInt(2)
        ) * 0.0000000000000012;
    }
    console.log("estimateGas: ", estimatedGas);
    return estimatedGas;
  } catch (error) {
    console.error("Gas estimation failed:", error);
    return 0;
  }
};

export const estimateTransactionTime = async (
  chainId: number,
  wagmiContext: any,
  gasLimit: bigint,
  maxFeePerGas?: bigint
) => {
  try {
    const publicClient = createPublicClient({
      chain: chains.find((chain) => chain.id == chainId), // Change this to your target chain
      transport: chainId === 1 ? http("https://eth.merkle.io") : http(),
    });
    // Get the latest gas price data
    const gasData = await getGasEstimation(wagmiContext, chainId);
    console.log("Gas Data:", gasData);

    const baseFeePerGas = gasData?.maxFeePerGas || gasData?.gasPrice; // Fallback to legacy gas price if EIP-1559 is not supported
    if (!baseFeePerGas) throw new Error("Failed to fetch gas data.");

    // Estimate transaction cost in ETH
    const estimatedGasCost = gasLimit * (maxFeePerGas || baseFeePerGas);
    console.log(`Estimated Gas Cost: ${formatUnits(estimatedGasCost, 18)} ETH`);

    // Get recent block time
    const latestBlock = await publicClient.getBlock();
    const avgBlockTime =
      latestBlock.timestamp -
      (
        await publicClient.getBlock({
          blockNumber: latestBlock.number - BigInt(1),
        })
      ).timestamp;

    // Estimate transaction confirmation time (in seconds)
    const estimatedTime =
      avgBlockTime * (gasData.maxPriorityFeePerGas ? BigInt(1) : BigInt(3)); // Priority fee speeds up tx
    console.log(`Estimated Transaction Time: ~${estimatedTime} seconds`);

    return estimatedTime;
  } catch (error) {
    console.error("Error estimating transaction time:", error);
    return BigInt(0);
  }
};

export const quoteSend = async (
  bridgeAddress: string,
  chainId: number,
  sendParam: any,
  wagmiContext: any
) => {
  try {
    console.log('bridgeAddress: ', bridgeAddress)
    console.log('sendParam: ', sendParam)
    console.log('chainId: ', chainId)
    const formattedBridgeAddress = getAddress(bridgeAddress);
    const quote = await readContract(wagmiContext, {
      abi: bridgeABI,
      address: formattedBridgeAddress,
      functionName: "quoteSend",
      args: [sendParam, false],
      chainId,
    });

    return quote;
  } catch (error: any) {
    console.log("quoteSend error: ", error);
    return null;
  }
};

export const send = async (
  bridgeAddress: string,
  sendParam: any,
  msgFee: any,
  refundAddress: string,
  chainId: number,
  wagmiContext: any
) => {
  try {
    const formattedBridgeAddress = getAddress(bridgeAddress);
    const hash = await writeContract(wagmiContext, {
      abi: bridgeABI,
      address: formattedBridgeAddress,
      functionName: "send",
      args: [sendParam, msgFee, refundAddress],
      value: msgFee.nativeFee,
      chainId,
    });

    const transactionReceipt = await waitForTransactionReceipt(wagmiContext, {
      hash,
    });

    if (transactionReceipt.status == "success") {
      console.log("Execute bridge transaction succeed");
      return true;
    } else {
      console.log("Execute bridge transaction failed");
      return false;
    }
  } catch (error: any) {
    console.log("Execute bridge error: ", error);
    return false;
  }
};
