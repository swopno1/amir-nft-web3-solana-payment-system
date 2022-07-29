import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Keypair, Transaction } from '@solana/web3.js'
import { findReference, FindReferenceError } from '@solana/pay'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import BackLink from '../components/BackLink'
import Loading from '../components/Loading'
import PageHeading from '../components/PageHeading'
import calculatePrice from '../lib/calculatePrice'
import {
  MakeTransactionInputData,
  MakeTransactionOutputData,
} from './api/makeTransaction'

export default function Checkout() {
  const router = useRouter()
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(router.query)) {
    if (value) {
      if (Array.isArray(value)) {
        for (const v of value) {
          searchParams.append(key, v)
        }
      } else {
        searchParams.append(key, value)
      }
    }
  }

  const reference = useMemo(() => Keypair.generate().publicKey, [])

  searchParams.append('reference', reference.toString())

  async function getTransaction() {
    if (!publicKey) {
      return
    }

    const body: MakeTransactionInputData = {
      account: publicKey.toString(),
    }

    const response = await fetch(
      `/api/makeTransaction?${searchParams.toString()}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    const json = (await response.json()) as MakeTransactionOutputData

    if (response.status !== 200) {
      console.error(json)
      return
    }

    const transaction = Transaction.from(
      Buffer.from(json.transaction, 'base64')
    )
    setTransaction(transaction)
    setMessage(json.message)
    console.log(transaction)
  }

  useEffect(() => {
    getTransaction()
  }, [publicKey])

  async function trySendTransaction() {
    if (!transaction) {
      return
    }
    try {
      await sendTransaction(transaction, connection)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    trySendTransaction()
  }, [transaction])

  // Check every 0.5s if the transaction is completed
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        const signatureInfo = await findReference(connection, reference)
        router.push('/confirmed')
      } catch (e) {
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return
        }
        console.error('Unknown error', e)
      }
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div>
          <BackLink href="/">Cancel</BackLink>
        </div>
        <WalletMultiButton />
        <p>You need to connect your wallet to make transactions</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <BackLink href="/">Cancel</BackLink>

      <WalletMultiButton />

      {message ? (
        <p>{message} Please approve the transaction using your wallet</p>
      ) : (
        <p>
          Creating transaction... <Loading />
        </p>
      )}
    </div>
  )
}
