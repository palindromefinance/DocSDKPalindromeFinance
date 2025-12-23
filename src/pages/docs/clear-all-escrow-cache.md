---
title: clearAllEscrowCache
description: Clear the SDK’s internal escrow data cache — force fresh reads from chain
---

```ts
clearAllEscrowCache(): void
```

The SDK automatically caches `getEscrowByIdParsed()` and related calls for **5 seconds** to reduce RPC load.

Call this method **after any state-changing transaction** (deposit, confirm, cancel, dispute, etc.) to instantly clear the cache and ensure the next read gets the **latest on-chain data**.

#### Parameters
None

#### Returns
`void`

```ts
import { createPalindromeSDK } from '@/lib/createSDK';

const { sdk, walletClient } = await connectAndInitSDK();

// You just called a transaction that changed the escrow state
await sdk.deposit(walletClient, 42n);

// Clear cache so next read shows updated state
sdk.clearAllEscrowCache();

// Now this will fetch fresh data from chain
const updatedEscrow = await sdk.getEscrowByIdParsed(42n);
console.log("State after deposit:", updatedEscrow.state); // → AWAITING_DELIVERY
```

#### When to Call It

| Action                        | Call `clearAllEscrowCache()`? |
|-------------------------------|-------------------------------|
| `deposit()`                   | Yes                           |
| `confirmDelivery()`           | Yes                           |
| `confirmDeliverySigned()`     | Yes                           |
| `requestCancel()`             | Yes                           |
| `cancelByTimeout()`           | Yes                           |
| `startDispute()`              | Yes                           |
| `submitArbiterDecision()`     | Yes                           |

#### Pro Tip
The SDK already calls `clearCache(escrowId)` internally for most actions — but calling `clearAllEscrowCache()` guarantees **all** cached escrows are refreshed.

**Never show stale data again — perfect for real-time UIs**
