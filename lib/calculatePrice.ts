import BigNumber from 'bignumber.js'
import { ParsedUrlQuery } from 'querystring'
import { products } from './products'

export default function calculatePrice(query: ParsedUrlQuery): BigNumber {
  let amount = new BigNumber(0)

  for (let [id, quantity] of Object.entries(query)) {
    const product = products.find((p) => p.id === id)
    if (!product) continue

    const solPrice = product.priceSol
    const usdPrice = product.priceUsd
    const [solQty, usdQty] = quantity as string[]

    const productSolQuantity = new BigNumber(solQty) //string | string[] | undefined
    const productUsdQuantity = new BigNumber(usdQty)

    amount = amount.plus(productSolQuantity.multipliedBy(solPrice))
    amount = amount.plus(productUsdQuantity.multipliedBy(usdPrice))
  }

  return amount
}
