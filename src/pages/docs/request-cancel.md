---
title: requestCancel
description: Buyer or seller requests to cancel the escrow (mutual cancellation flow)
---

```ts
async requestCancel(walletClient: WalletClient, escrowId: bigint): Promise<string>
```

**Called by buyer or seller** to signal they want to cancel the deal.

- If **both** parties request cancel → escrow becomes `CANCELED` automatically after timeout  
- If only one requests → the other can still proceed (e.g. buyer can deposit, seller can deliver)

This is the first step in **mutual cancellation**.

#### Parameters
- `walletClient: WalletClient` – Your wallet (buyer or seller)
- `escrowId: bigint`

#### Returns
`Promise<string>` – Transaction hash

```ts
import { createPalindromeSDK } from '@/lib/createSDK';

const { sdk, walletClient } = await connectAndInitSDK();

try {
  const txHash = await sdk.requestCancel(walletClient, 42n);

  console.log("Cancellation request sent!");
  console.log("Tx:", txHash);

  // Now waiting for the other party...
  if (/* other party also requested */) {
    console.log("Both requested → will auto-cancel soon");
  } else {
    console.log("Waiting for counterparty to agree");
  }

} catch (error: any) {
  if (error.code === "INVALID_STATE") {
    alert("Cannot cancel in current state (e.g. already disputed or completed)");
  } else {
    console.error("Request cancel failed:", error.shortMessage || error.message);
  }
}
```

#### Cancellation Flow

| Step                         | Action                                 | Result                              |
|-----------------------------|----------------------------------------|-------------------------------------|
| 1. One party calls          | `requestCancel()`                      | Flag set (buyerCancelRequested or sellerCancelRequested) |
| 2. Other party calls        | `requestCancel()`                      | Both flags true → countdown starts  |
| 3. Timeout passes (~24h)    | Anyone calls `cancelByTimeout()`       | Escrow → `CANCELED`, buyer gets funds back |
