---
title: formatTokenAmount
description: "Palindrome Crypto Pay: Convert raw bigint token amount to human-readable string with proper decimal formatting for display."
---

```ts
formatTokenAmount(amount: bigint, decimals: number): string
```

Converts a **raw token amount** (e.g. `1250000000000000000000n`) into a clean, formatted string like `"1250.00"` — perfect for UI display.

Works with any ERC20 token (USDT 18-dec, BUSD 18-dec, etc.).

#### Parameters
- `amount: bigint` – Raw token amount from contract (e.g. from `getTokenBalance`)
- `decimals: number` – Token decimals (usually 18 for USDT/BUSD on BSC)

#### Returns
`string` – Formatted number with proper decimal places

```ts
import { createPalindromeSDK } from '@/lib/createSDK';

const { sdk } = await connectAndInitSDK();
const USDT = "0x55d398326f99059fF775485246999027B3197955";

try {
  const rawBalance = await sdk.getTokenBalance("0xbuyer...", USDT);

  // Format with 18 decimals (standard for USDT on BSC)
  const formatted = sdk.formatTokenAmount(rawBalance, 18);

  console.log("Buyer has:", formatted, "USDT");
  // → "Buyer has: 1250.00 USDT"

  // Works with any token
  const busdBalance = 5000000000000000000n; // 5 BUSD (18 dec)
  console.log("BUSD:", sdk.formatTokenAmount(busdBalance, 18));
  // → "5.00"

} catch (error) {
  console.error("Error:", error);
}
```

#### Real Examples

| Raw Amount                | Decimals | Result         |
|---------------------------|----------|----------------|
| `1250000000000000000000n` | 18       | `"1250.00"`    |
| `999000000n`              | 6        | `"999.00"`     |
| `5000000000000000000n`    | 18       | `"5.00"`       |
| `1234567890123456789n`    | 18       | `"1.234567890123456789"` |

#### Best For
- Displaying balances in wallets
- Showing escrow amounts
- Order summaries
- Any user-facing number

**No more guessing decimals — clean, readable token amounts every time!**

**See also** → [`getTokenBalance()`](/docs/get-token-balance) · [`getTokenDecimals()`](/docs/get-token-decimals)


