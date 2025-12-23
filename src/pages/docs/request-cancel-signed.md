---
title: requestCancelSigned
description: Cancellation request — buyer or seller signs off-chain
---

```ts
async requestCancelSigned(walletClient: WalletClient, escrowId: bigint): Promise<string>
```

`requestCancel()` — the user signs a message with a 60-minute deadline. Anyone (you, a relayer, or the dApp) can submit the signature on-chain.

Perfect for **zero-gas UX** — user clicks “Cancel” and pays nothing.

#### How It Works
1. User signs a structured message (includes deadline + nonce)
2. Signature is submitted to the contract
3. Same effect as normal `requestCancel()` — flag is set
4. If both parties sign → mutual cancellation proceeds

#### Parameters
- `walletClient: WalletClient` – Buyer or seller wallet (only for signing)
- `escrowId: bigint`

#### Returns
`Promise<string>` – Transaction hash (from whoever submits)

```ts
import { createPalindromeSDK } from '@/lib/createSDK';

const { sdk, walletClient } = await connectAndInitSDK();

try {
  // User signs — NO GAS paid by user
  const txHash = await sdk.requestCancelSigned(walletClient, 42n);

  console.log("Cancellation request signed & submitted!");
  console.log("Tx:", txHash);
  console.log("Waiting for the other party to agree...");

} catch (error: any) {
  if (error.code === "SIGNATURE_EXPIRED") {
    alert("Signature expired — please try again");
  } else if (error.code === "INVALID_STATE") {
    alert("Cannot cancel in current escrow state");
  } else {
    console.error("Cancel request failed:", error.shortMessage || error.message);
  }
}
```
