import { PublicKey } from '@solana/web3.js'

export const shopAddress = new PublicKey(
  '4CxuQkh2dRVHCvA6V9hrM7DgPZjrVjGL3a3vVZmxqzBj'
)
// this is the same for everyone!
export const usdcAddress = new PublicKey(
  'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
)
// This is your token/coupon address
export const couponAddress = new PublicKey('FMD8vQBCAqRyxvzxWfD9Zg5h9veHdWqThwsdW6Ar417t')


/*
Node.js v18.4.0
mdamirhossain@Mds-MacBook-Air amir-nft % node scripts/create-coupon.js
Creating token...
Token created: FMD8vQBCAqRyxvzxWfD9Zg5h9veHdWqThwsdW6Ar417t
Creating token account for the shop...
Token account created: Hkmv9HyRTaXxEfiLsBjwayT8K19atRizAbgjXJE2NUrp
Minting 1 million coupons to the shop account...
Minted 1 million coupons to the shop account
{
  myCouponAddress: 'FMD8vQBCAqRyxvzxWfD9Zg5h9veHdWqThwsdW6Ar417t',
  balance: '1,000,000'
}
*/