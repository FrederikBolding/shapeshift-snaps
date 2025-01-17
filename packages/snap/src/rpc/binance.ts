import { BinanceSignTx } from '@shapeshiftoss/hdwallet-core'
import {
  BinanceGetAddressParams,
  BinanceSignTransactionResponse,
} from '@shapeshiftoss/metamask-snaps-types'

import { logger } from '../lib/logger'
import { getHDWalletNativeSigner, userConfirm } from './common'

const moduleLogger = logger.child({ namespace: ['Snap', 'RPC', 'Binance.ts'] })

export const binanceGetAddress = async ({
  addressNList,
}: BinanceGetAddressParams): Promise<string> => {
  try {
    const signer = await getHDWalletNativeSigner('Binance')
    if (signer === null) {
      throw new Error('Could not initialize Binance signer')
    }
    const address = await signer.binanceGetAddress({
      addressNList,
      showDisplay: false,
    })
    if (address === null) {
      throw new Error('Address generation failed')
    }
    return address
  } catch (error) {
    moduleLogger.error({ fn: 'binanceGetAddress' }, error)
    return Promise.reject(error)
  }
}

export const binanceSignTransaction = async (
  transaction: BinanceSignTx,
): Promise<BinanceSignTransactionResponse> => {
  try {
    const signer = await getHDWalletNativeSigner('Binance')
    if (signer === null) {
      throw new Error('Could not initialize Binance signer')
    }
    if (
      !(await userConfirm({
        prompt: 'Sign Binance Transaction?',
        description: 'Please verify the transaction data below',
        textAreaContent: JSON.stringify(transaction, null, 2),
      }))
    ) {
      throw new Error('User rejected the signing request')
    }
    const signedTransaction = await signer.binanceSignTx(transaction)
    if (signedTransaction === null) {
      throw new Error('Transaction signing failed')
    }
    return signedTransaction
  } catch (error) {
    moduleLogger.error(transaction, { fn: 'binanceSignTransaction' }, error)
    return Promise.reject(error)
  }
}
/* Disabled pending Unchained support */
// export const binanceBroadcastTransaction = async (message: BinanceSignedTx): Promise<BinanceBroadcastTransactionResponse> => {
//   try {
//     const config = new unchained.binance.Configuration({
//       basePath: process.env.UNCHAINED_BINANCE_HTTP_URL,
//     })
//     const client = new unchained.binance.V1Api(config)
//     const txid = client.sendTx({ body: { rawTx: message.serialized } })
//     return txid
//   } catch (error) {
//     moduleLogger.error(message, { fn: 'binanceBroadcastMessage' }, error)
//     return Promise.reject(error)
//   }
// }
