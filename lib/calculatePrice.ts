import BigNumber from 'bignumber.js'
import { ParsedUrlQuery } from 'querystring'
import { products } from './products'

export default function calculatePrice(query: ParsedUrlQuery): BigNumber {
  let amount = new BigNumber(0)
  console.log('check-1', amount)
  for (let [id, quantity] of Object.entries(query)) {
    const product = products.find((p) => p.id === id)
    if (!product) continue

    const solPrice = product.priceSol
    const usdPrice = product.priceUsd

    const productSolQuantity = new BigNumber(quantity[0] as string) //string | string[] | undefined
    const productUsdQuantity = new BigNumber(quantity[1] as string)

    amount = amount.plus(productSolQuantity.multipliedBy(solPrice))
    amount = amount.plus(productUsdQuantity.multipliedBy(usdPrice))
  }

  return amount
}
