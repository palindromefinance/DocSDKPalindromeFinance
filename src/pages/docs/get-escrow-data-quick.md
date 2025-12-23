---
title: getEscrowDataQuick
description: Get basic escrow data directly from the contract (fast, no subgraph delay)
---

```ts
async getEscrowDataQuick(escrowId: bigint): Promise<EscrowData>
```

Reads essential escrow data **directly from the blockchain** – no subgraph indexing required. Perfect for showing **real-time** escrow status (e.g., newly created deals that The Graph hasn't indexed yet).

This is an alias for `getEscrowByIdParsed()` that returns parsed, typed data straight from the contract.

#### Parameters
- `escrowId: bigint` – The escrow ID

#### Returns
`Promise<EscrowData>` – Parsed escrow object with all fields

```ts
interface EscrowData {
  token: Address;
  buyer: Address;
  seller: Address;
  arbiter: Address;
  wallet: Address;
  amount: bigint;
  depositTime: bigint;
  maturityTime: bigint;
  disputeStartTime: bigint;
  state: EscrowState;
  buyerCancelRequested: boolean;
  sellerCancelRequested: boolean;
  tokenDecimals: number;
}
```

```ts
import { createPalindromeSDK } from '@/lib/createSDK';
import { EscrowState } from '@palindromecryptoescrow/sdk';

const { sdk } = await connectAndInitSDK();

try {
  const escrow = await sdk.getEscrowDataQuick(123n);

  console.log("Real-time escrow data:", {
    buyer: escrow.buyer,
    seller: escrow.seller,
    arbiter: escrow.arbiter === "0x0000000000000000000000000000000000000000" ? "None" : escrow.arbiter,
    wallet: escrow.wallet,
    amount: escrow.amount,
    token: escrow.token,
    state: escrow.state,
    stateName: ['AWAITING_PAYMENT', 'AWAITING_DELIVERY', 'DISPUTED', 'COMPLETE', 'REFUNDED', 'CANCELED'][escrow.state],
    depositTime: escrow.depositTime > 0n 
      ? new Date(Number(escrow.depositTime) * 1000).toLocaleString() 
      : "Not deposited yet",
    maturityTime: escrow.maturityTime > 0n 
      ? new Date(Number(escrow.maturityTime) * 1000).toLocaleString() 
      : "No deadline",
    cancelRequests: {
      buyer: escrow.buyerCancelRequested,
      seller: escrow.sellerCancelRequested,
    },
    decimals: escrow.tokenDecimals,
  });

  // Format the amount for display
  const formatted = sdk.formatTokenAmount(escrow.amount, escrow.tokenDecimals);
  console.log(`Amount: ${formatted} tokens`);

} catch (error) {
  console.error("Failed to load quick escrow data:", error);
}
```

#### Sample Output

```ts
{
  token: "0x55d398326f99059fF775485246999027B3197955",
  buyer: "0xbuyer...",
  seller: "0xseller...",
  arbiter: "0x0000000000000000000000000000000000000000",
  wallet: "0xEscrowWallet123...",
  amount: 999000000n,
  depositTime: 0n,
  maturityTime: 0n,
  disputeStartTime: 0n,
  state: 0,  // EscrowState.AWAITING_PAYMENT
  buyerCancelRequested: false,
  sellerCancelRequested: false,
  tokenDecimals: 18
}
```

#### Why Use This?

✅ **Instant data** – no waiting for subgraph indexing  
✅ **Fresh from contract** – always current state  
✅ **Strongly typed** – full TypeScript support  
✅ **Includes decimals** – ready for `formatTokenAmount()`

**See also** → [`getEscrowByIdParsed()`](/docs/get-escrow-by-id-parsed) · [`getEscrowDetail()`](/docs/get-escrow-detail)