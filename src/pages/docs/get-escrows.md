---
title: getEscrows
description: Fetch all escrows from The Graph subgraph (indexed & enriched data)
---

```ts
async getEscrows(useCache?: boolean): Promise<Escrow[]>
```

Retrieves all escrow deals that have been indexed by The Graph. This includes full metadata like title, IPFS hash, timestamps, and participant addresses – much richer than raw on-chain data.

#### Parameters
- `useCache?: boolean` – Optional. Use cached results if available (default: `true`)

#### Returns
`Promise<Escrow[]>` – Array of complete escrow objects

```ts
import { createPalindromeSDK } from '@/lib/createSDK';

// After connecting wallet
const { sdk } = await connectAndInitSDK();

try {
  // Get all escrows (with cache)
  const allEscrows = await sdk.getEscrows();
  
  // Or force fresh fetch from subgraph
  const freshEscrows = await sdk.getEscrows(false);

  console.log(`Found ${allEscrows.length} escrows:`);
  allEscrows.forEach((escrow) => {
    console.log({
      id: escrow.id,
      title: escrow.title,
      buyer: escrow.buyer.id,
      seller: escrow.seller.id,
      amount: escrow.amount,
      token: escrow.token.symbol,
      state: escrow.state,
      createdAt: new Date(Number(escrow.createdAt) * 1000).toLocaleString(),
    });
  });
} catch (error) {
  console.error('Failed to fetch escrows:', error);
}
```

#### Sample Escrow Object (from subgraph)

```ts
{
  id: "1",
  title: "iPhone 15 Pro Max - Brand New",
  ipfsHash: "Qm...",
  amount: "1250000000",           // 1250 USDT (6 decimals)
  token: { id: "0x...", symbol: "USDT" },
  buyer: { id: "0xbuyer..." },
  seller: { id: "0xseller..." },
  arbiter: { id: "0xarbiter..." },
  state: "AWAITING_DELIVERY",
  createdAt: "1719823456",
  depositTime: "1719823500",
  maturityTime: "1720502400",     // +7 days
  messages: [...]                 // dispute messages (if any)
}
```

#### Caching Behavior

The SDK uses intelligent caching to reduce subgraph queries:

- **`useCache: true`** (default) – Returns cached data if available and not expired (TTL: 10 seconds)
- **`useCache: false`** – Forces fresh fetch from subgraph, bypasses cache
- Cache policy can be configured globally via `cachePolicy` in SDK config

```ts
// Configure cache behavior at SDK initialization
const sdk = new PalindromeEscrowSDK({
  // ... other config
  cachePolicy: 'no-cache',    // 'default' | 'no-cache' | 'aggressive'
  cacheTTL: 5000,             // milliseconds (default: 5000)
});
```

#### When to Use `useCache: false`

✅ After creating a new escrow (to immediately fetch updated list)  
✅ After state changes (deposit, confirm, dispute)  
✅ When displaying real-time dashboards  
✅ During testing/debugging

**See also** → [`getEscrowsByBuyer()`](/docs/get-escrows-by-buyer) · [`getEscrowsBySeller()`](/docs/get-escrows-by-seller) · [`getEscrowDetail()`](/docs/get-escrow-detail)