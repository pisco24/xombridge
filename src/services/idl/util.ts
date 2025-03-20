import assert from 'assert'

import {
    fetchAddressLookupTable,
    setComputeUnitLimit,
    setComputeUnitPrice,
} from '@metaplex-foundation/mpl-toolbox'
import {
    AddressLookupTableInput,
    Instruction,
    KeypairSigner,
    PublicKey,
    TransactionBuilder,
    Umi,
    publicKey,
    transactionBuilder,
} from '@metaplex-foundation/umi'
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import { AddressLookupTableAccount, Connection } from '@solana/web3.js'
import { EndpointId } from '@layerzerolabs/lz-definitions'

import getFee from './getFee';

const LOOKUP_TABLE_ADDRESS: Partial<Record<EndpointId, PublicKey>> = {
    [EndpointId.SOLANA_V2_MAINNET]: publicKey('AokBxha6VMLLgf97B5VYHEtqztamWmYERBmmFvjuTzJB'),
    [EndpointId.SOLANA_V2_TESTNET]: publicKey('9thqPdbR27A1yLWw2spwJLySemiGMXxPnEvfmXVk4KuK'),
}

export const getAddressLookupTable = async (connection: Connection, umi: Umi, fromEid: EndpointId) => {
    // Lookup Table Address and Priority Fee Calculation
    const lookupTableAddress = LOOKUP_TABLE_ADDRESS[fromEid]
    assert(lookupTableAddress != null, `No lookup table found`)
    const addressLookupTableInput: AddressLookupTableInput = await fetchAddressLookupTable(umi, lookupTableAddress)
    if (!addressLookupTableInput) {
        throw new Error(`No address lookup table found for ${lookupTableAddress}`)
    }
    const { value: lookupTableAccount } = await connection.getAddressLookupTable(toWeb3JsPublicKey(lookupTableAddress))
    if (!lookupTableAccount) {
        throw new Error(`No address lookup table account found for ${lookupTableAddress}`)
    }
    return {
        lookupTableAddress,
        addressLookupTableInput,
        lookupTableAccount,
    }
}

export enum TransactionType {
    CreateToken = 'CreateToken',
    CreateMultisig = 'CreateMultisig',
    InitOft = 'InitOft',
    SetAuthority = 'SetAuthority',
    InitConfig = 'InitConfig',
    SendOFT = 'SendOFT',
}

const TransactionCuEstimates: Record<TransactionType, number> = {
    // for the sample values, they are: devnet, mainnet
    [TransactionType.CreateToken]: 125_000, // actual sample: (59073, 123539), 55785 (more volatile as it has CPI to Metaplex)
    [TransactionType.CreateMultisig]: 5_000, // actual sample: 3,230
    [TransactionType.InitOft]: 70_000, // actual sample: 59207, 65198 (note: this is the only transaction that createOFTAdapter does)
    [TransactionType.SetAuthority]: 8_000, // actual sample: 6424, 6472
    [TransactionType.InitConfig]: 42_000, // actual sample: 33157, 40657
    [TransactionType.SendOFT]: 230_000, // actual sample: 217,784
}

export const getComputeUnitPriceAndLimit = async (
    connection: Connection,
    ixs: Instruction[],
    wallet: KeypairSigner,
    lookupTableAccount: AddressLookupTableAccount,
    transactionType: TransactionType
) => {
    const { averageFeeExcludingZeros } = await getFee(connection)
    const priorityFee = Math.round(averageFeeExcludingZeros)
    const computeUnitPrice = BigInt(priorityFee)

    const computeUnits = TransactionCuEstimates[transactionType]

    if (!computeUnits) {
        throw new Error('Unable to compute units')
    }

    return {
        computeUnitPrice,
        computeUnits,
    }
}

export const addComputeUnitInstructions = async (
    connection: Connection,
    umi: Umi,
    eid: EndpointId,
    txBuilder: TransactionBuilder,
    umiWalletSigner: KeypairSigner,
    computeUnitPriceScaleFactor: number,
    transactionType: TransactionType
) => {
    const computeUnitLimitScaleFactor = 1.1 // hardcoded to 1.1 as the estimations are not perfect and can fall slightly short of the actual CU usage on-chain
    const { addressLookupTableInput, lookupTableAccount } = await getAddressLookupTable(connection, umi, eid)
    const { computeUnitPrice, computeUnits } = await getComputeUnitPriceAndLimit(
        connection,
        txBuilder.getInstructions(),
        umiWalletSigner,
        lookupTableAccount,
        transactionType
    )
    // Since transaction builders are immutable, we must be careful to always assign the result of the add and prepend
    // methods to a new variable.
    const newTxBuilder = transactionBuilder()
        .add(
            setComputeUnitPrice(umi, {
                microLamports: BigInt(computeUnitPrice) * BigInt(Math.floor(computeUnitPriceScaleFactor)),
            })
        )
        .add(setComputeUnitLimit(umi, { units: Number(computeUnits) * computeUnitLimitScaleFactor }))
        .setAddressLookupTables([addressLookupTableInput])
        .add(txBuilder)
    return newTxBuilder
}
