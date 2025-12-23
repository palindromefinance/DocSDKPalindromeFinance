---
title: getEscrowByIdParsed
description: Get fully parsed and typed escrow data from the contract
---

```ts
async getEscrowByIdParsed(escrowId: bigint): Promise<EscrowData>
```

Same as `getEscrowById()` but automatically converts the raw on-chain tuple into a clean, strongly-typed `EscrowData` object with named fields and proper types — perfect for UI and logic.

**Returns**  
`Promise<EscrowData>` – Structured escrow object

```ts
import { createPalindromeSDK } from '@/lib/createSDK';

const { sdk } = await connectAndInitSDK();

try {
  const escrow = await sdk.getEscrowByIdParsed(5n);

  console.log('Parsed escrow:', {
    id: 5n,
    token: escrow.token,
    buyer: escrow.buyer,
    seller: escrow.seller,
    arbiter: escrow.arbiter,
    amount: escrow.amount,
    state: escrow.state,      
    stateName: ['AWAITING_PAYMENT', 'AWAITING_DELIVERY', 'DISPUTED', 'COMPLETE', 'REFUNDED', 'CANCELED'][escrow.state],
    depositTime: Number(escrow.depositTime),
    maturityTime: Number(escrow.maturityTime),
    buyerCancelRequested: escrow.buyerCancelRequested,
    sellerCancelRequested: escrow.sellerCancelRequested,
  });
} catch (error) {
  console.error('Failed to fetch parsed escrow:', error);
}
```

**Sample Output**

```ts
{
  token: "0x55d398326f99059fF775485246999027B3197955",
  buyer: "0xbuyer...",
  seller: "0xseller...",
  arbiter: "0x0000000000000000000000000000000000000000",
  amount: 1250000000n,
  depositTime: 1719823500n,
  maturityTime: 1720428300n,
  nonce: 1n,
  state: 1,                          // EscrowState.AWAITING_DELIVERY
  buyerCancelRequested: false,
  sellerCancelRequested: false
}
```