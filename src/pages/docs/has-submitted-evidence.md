---
title: hasSubmittedEvidence
description: Check if a specific role has submitted evidence in a dispute
---

Check if a specific participant (buyer, seller, or arbiter) has submitted evidence for a disputed escrow.

## Usage

```typescript
import { Role } from '@palindromepay/sdk'

const hasSubmitted = await sdk.hasSubmittedEvidence(escrowId, Role.Buyer)

if (hasSubmitted) {
  console.log('Buyer has already submitted evidence')
} else {
  console.log('Buyer has not submitted evidence yet')
}
```

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `escrowId` | `bigint` | The escrow ID to check |
| `role` | `Role` | The role to check (Buyer, Seller, or Arbiter) |

## Returns

`Promise<boolean>` - `true` if the specified role has submitted evidence, `false` otherwise.

## Example

```typescript
import { Role } from '@palindromepay/sdk'

// Check each participant's submission status
const buyerSubmitted = await sdk.hasSubmittedEvidence(1n, Role.Buyer)
const sellerSubmitted = await sdk.hasSubmittedEvidence(1n, Role.Seller)
const arbiterSubmitted = await sdk.hasSubmittedEvidence(1n, Role.Arbiter)

console.log('Buyer submitted:', buyerSubmitted)
console.log('Seller submitted:', sellerSubmitted)
console.log('Arbiter submitted:', arbiterSubmitted)
```

## Related

- [getDisputeSubmissionStatus](/docs/get-dispute-submission-status) - Get full submission status for all roles
- [submitDisputeMessage](/docs/submit-dispute-message) - Submit evidence for a dispute
