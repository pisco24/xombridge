/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenItems } from "@/config";
import { NetworkInfo, TokenBalance } from "@/types";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { publicKey, transactionBuilder } from "@metaplex-foundation/umi";
import { oft } from "@layerzerolabs/oft-v2-solana-sdk";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import {
  findAssociatedTokenPda,
  mplToolbox,
} from "@metaplex-foundation/mpl-toolbox";
import { programId, tokenEscrow, tokenMint } from "./const";
import { addComputeUnitInstructions, TransactionType } from "./util";

const getAssociatedTokenAccount = async (
  ownerPubkey: PublicKey,
  mintPk: PublicKey
): Promise<PublicKey> => {
  const associatedTokenAccountPubkey = (
    await PublicKey.findProgramAddress(
      [ownerPubkey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPk.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
  return associatedTokenAccountPubkey;
};

async function getTokenBalanceWeb3(
  conn: any,
  vault: PublicKey
): Promise<number> {
  try {
    const info = await conn.getTokenAccountBalance(vault);
    if (!info.value.uiAmount) throw new Error("No balance found");
    return info.value.uiAmount;
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export const getWalletBalanceSol = async (
  network: NetworkInfo,
  address: PublicKey,
  connection: any
) => {
  const coinBalance: TokenBalance[] = [];
  try {
    const coins = tokenItems[network.chainId];

    for (let i = 0; i < coins.length; i++) {
      const userVault = await getAssociatedTokenAccount(
        address,
        new PublicKey(coins[i].address)
      );
      const balance = await getTokenBalanceWeb3(connection, userVault);

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

export const executeBridgeSolana = async (
  context: any,
  conn: Connection,
  to: string,
  fromNetwork: NetworkInfo,
  toNetwork: NetworkInfo,
  amount: number
) => {
  try {
    const rpcUrl =
      process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
        ? "https://api.devnet.solana.com"
        : process.env.NEXT_PUBLIC_SOLANA_RPC ||
          "https://api.mainnet-beta.solana.com";
    const umi = createUmi(rpcUrl).use(mplToolbox());
    umi.use(walletAdapterIdentity(context));

    const mint = publicKey(tokenMint);
    const recipientAddressBytes32 = addressToBytes32(to);
    const min = 1;
    const tokenProgramId = fromWeb3JsPublicKey(TOKEN_PROGRAM_ID);

    const tokenAccount = findAssociatedTokenPda(umi, {
      mint,
      owner: publicKey(context.publicKey),
      tokenProgramId,
    });

    const { nativeFee } = await oft.quote(
      umi.rpc,
      {
        payer: publicKey(context.publicKey),
        tokenMint: mint,
        tokenEscrow: publicKey(tokenEscrow),
      },
      {
        payInLzToken: false,
        to: Buffer.from(recipientAddressBytes32),
        dstEid: toNetwork.endpointId,
        amountLd: BigInt(amount),
        minAmountLd: BigInt(min),
        options: Buffer.from(""), // enforcedOptions must have been set
        composeMsg: undefined,
      },
      {
        oft: publicKey(programId),
      }
    );

    const ix = await oft.send(
      umi.rpc,
      {
        payer: umi.payer,
        tokenMint: mint,
        tokenEscrow: publicKey(tokenEscrow),
        tokenSource: tokenAccount[0],
      },
      {
        to: Buffer.from(recipientAddressBytes32),
        dstEid: toNetwork.endpointId,
        amountLd: BigInt(amount),
        minAmountLd: (BigInt(amount) * BigInt(9)) / BigInt(10),
        options: Buffer.from(""),
        composeMsg: undefined,
        nativeFee,
      },
      {
        oft: publicKey(programId),
        token: tokenProgramId,
      }
    );

    let txBuilder = transactionBuilder().add([ix]);

    txBuilder = await addComputeUnitInstructions(
      conn,
      umi,
      fromNetwork.endpointId,
      txBuilder,
      context,
      4, // computeUnitPriceScaleFactor,
      TransactionType.SendOFT
    );

    const { signature } = await txBuilder.sendAndConfirm(umi);

    console.log(
      `✅ Sent ${amount} token(s) to destination EID: ${toNetwork.endpointId}!, ${signature}`
    );
    return true;
  } catch (error: any) {
    console.log(`Error: ${error}`);
  }
};
