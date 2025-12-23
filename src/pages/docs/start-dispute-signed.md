---
title: startDisputeSigned
description: Open a dispute using EIP-712 signature
---

```ts
async startDisputeSigned(
  walletClient: WalletClient,
  escrowId: bigint,
  signature: Hex,
  deadline: bigint,
  nonce: bigint
): Promise<Hex>
```

`startDispute()` — buyer or seller signs a typed message off-chain, then anyone (user, relayer, or dApp) can submit it on-chain to open a dispute.

Perfect for **zero-gas UX** where users don't need native tokens to initiate disputes.

#### Parameters
- `walletClient: WalletClient` – Wallet submitting the transaction (can be different from signer)
- `escrowId: bigint` – The escrow ID
- `signature: Hex` – EIP-712 signature from buyer or seller
- `deadline: bigint` – Unix timestamp when signature expires
- `nonce: bigint` – User's nonce (prevents replay attacks)

#### Returns
`Promise<Hex>` – Transaction hash

#### Full Flow

```ts
import { createPalindromeSDK } from '@/lib/createSDK';

const { sdk, walletClient } = await connectAndInitSDK();
const escrowId = 42n;

try {
  // Step 1: Get user's current nonce for this escrow
  const userAddress = walletClient.account.address;
  const nonce = await sdk.getUserNonce(escrowId, userAddress);

  // Step 2: Create signature deadline (e.g. 60 minutes)
  const deadline = await sdk.createSignatureDeadline(60);

  // Step 3: User signs the StartDispute message (NO GAS)
  const signature = await sdk.signStartDispute(
    walletClient,
    escrowId,
    deadline,
    nonce
  );

  console.log("User signed dispute request (no gas paid)");
  console.log("Signature:", signature);

  // Step 4: Submit signature on-chain (relayer or user pays gas)
  const txHash = await sdk.startDisputeSigned(
    walletClient,  // Could be relayer's wallet
    escrowId,
    signature,
    deadline,
    nonce
  );

  console.log("Dispute opened successfully!");
  console.log("Transaction:", txHash);
  console.log("Escrow state → DISPUTED");

  // Next: both parties submit evidence via submitDisputeMessage()

} catch (error: any) {
  if (error.code === "SIGNATURE_EXPIRED") {
    alert("Signature expired — please sign again");
  } else if (error.code === "INVALID_STATE") {
    alert("Cannot dispute in current state (must be AWAITING_DELIVERY)");
  } else if (error.code === "INVALID_ROLE") {
    alert("Only buyer or seller can start a dispute");
  } else {
    console.error("Signed dispute failed:", error.shortMessage || error.message);
  }
}
```

#### Helper Methods

The SDK provides convenience methods for the signing flow:

```ts
// Create a deadline (default 10 minutes, or specify custom)
const deadline = await sdk.createSignatureDeadline(60); // 60 minutes

// Get user's current nonce
const nonce = await sdk.getUserNonce(escrowId, userAddress);

// Sign the dispute start request (EIP-712)
const signature = await sdk.signStartDispute(
  walletClient,
  escrowId,
  deadline,
  nonce
);

// Check if signature is still valid
const isValid = !sdk.isSignatureDeadlineExpired(deadline);
```

#### Signature Structure (EIP-712)

The signed message follows this structure:

```typescript
{
  escrowId: bigint;
  buyer: Address;
  seller: Address;
  arbiter: Address;
  token: Address;
  amount: bigint;
  depositTime: bigint;
  deadline: bigint;  // Signature expiration
  nonce: bigint;     // Anti-replay
}
```

#### Security Features

✅ **Deadline protection** – Signatures expire after specified time  
✅ **Nonce system** – Prevents replay attacks  
✅ **EIP-712** – Structured, readable signatures  
✅ **Domain separation** – Signatures only valid for your contract  
✅ **Role verification** – Only buyer/seller can sign

#### Relayer Pattern

For true transactions, set up a relayer:

```ts
// Frontend: User signs (no gas)
const { signature, deadline, nonce } = await createDisputeSignature();

// Send to backend
await fetch('/api/relay-dispute', {
  method: 'POST',
  body: JSON.stringify({ escrowId, signature, deadline, nonce })
});

// Backend: Relayer submits (pays gas)
await sdk.startDisputeSigned(
  relayerWallet,  // Relayer pays gas
  escrowId,
  signature,
  deadline,
  nonce
);
```

#### Why Use Disputes?

**User Benefits:**
- No native token (ETH/BNB) needed to open disputes
- Instant protection even if user has no gas
- Better UX during emergencies

**Platform Benefits:**
- Subsidize dispute costs for better user experience
- Control when/how disputes are opened
- Can add additional validation before submitting

#### Flow After Dispute Opens

1. ✅ Escrow state → `DISPUTED`
2. 📝 Buyer submits evidence via `submitDisputeMessage()`
3. 📝 Seller submits evidence via `submitDisputeMessage()`
4. ⚖️ Arbiter reviews and calls `submitArbiterDecision()`
5. 💰 Funds released to winner (seller or buyer)

**See also** → [`startDispute()`](/docs/start-dispute) · [`signStartDispute()`](/docs/sign-start-dispute) · [`submitDisputeMessage()`](/docs/submit-dispute-message) · [`getUserNonce()`](/docs/get-user-nonce)