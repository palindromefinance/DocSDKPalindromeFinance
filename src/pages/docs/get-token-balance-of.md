---
title: getUSDTBalanceOf
description: Get the USDT (or any ERC20) balance of any address
---

```ts
async getUSDTBalanceOf(
  account: Address,
  tokenAddress: Address
): Promise<bigint>
```

Reads the **raw token balance** (in wei-like units) of any wallet or contract for a given ERC20 token (typically USDT).

Useful for checking buyer funds before deposit, seller payouts, or escrow contract balance.

#### Parameters
- `account: Address` – The wallet or contract to check (e.g. buyer, seller, escrow contract)
- `tokenAddress: Address` – The ERC20 token contract (e.g. USDT on BSC Testnet)

#### Returns
`Promise<bigint>` – Balance as bigint (e.g. `1250000000n` for 1250.000000 USDT)

```ts
import { createPalindromeSDK } from '@/lib/createSDK';
import { formatUnits } from 'viem';

const { sdk } = await connectAndInitSDK();
const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT

try {
  // Check buyer's USDT balance
  const buyerBalance = await sdk.getUSDTBalanceOf("0xbuyer123...", USDT_ADDRESS);
  console.log("Buyer USDT:", formatUnits(buyerBalance, 18));

  // Check how much is currently in the escrow contract
  const escrowBalance = await sdk.getUSDTBalanceOf(
    "0xYourEscrowContractAddress...",
    USDT_ADDRESS
  );
  console.log("Escrow holds:", formatUnits(escrowBalance, 18), "USDT");

} catch (error) {
  console.error("Failed to read balance:", error);
}
```

#### Common Use Cases
- Show “Available Balance” before deposit
- Display “Funds Locked” in escrow
- Debug token flow
- Build wallet dashboards

#### Helper Tip
Use with `formatUnits(balance, decimals)` for human-readable numbers:

```ts
// Assuming 18 decimals (BSC USDT)
const readable = formatUnits(balance, 18); // → "1250.00"
```

**Fast, reliable, on-chain balance reading — no subgraph delay**

**See also** → [`getEscrowUSDTBalance()`](/docs/get-escrow-usdt-balance) · [`formatTokenAmount()`](/docs/format-token-amount)

