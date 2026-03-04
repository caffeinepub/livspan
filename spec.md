# LivSpan – Subaccount Payment System

## Current State

The app has a payment gate that shows all users the same static OISY wallet address. The `verifyAndActivate()` function uses a hardcoded mock that never checks the real ICP Ledger. No real payment can be detected automatically.

## Requested Changes (Diff)

### Add
- `getUserPaymentAddress() : async Text` — returns the caller's unique ICP account-ID (hex). Derived from canister principal + caller's subaccount (caller principal zero-padded to 32 bytes). Uses SHA-224 + CRC32 per ICP account-ID spec.
- Real ICP Ledger inter-canister call to `ryjl3-tyaaa-aaaaa-aaaba-cai` `account_balance` query
- Frontend: display the user's personal subaccount address with clear instructions

### Modify
- `verifyAndActivate()`: replace mock with real Ledger `account_balance` call on caller's subaccount. If balance >= 100_000_000 e8s (1 ICP), activate and return true.
- `PaymentGate.tsx`: call `getUserPaymentAddress()` instead of `getIcpAddress()` to show the user their personal payment address

### Remove
- Mock `fetchLedgerTransactions()` function
- Mock `hasMadePaymentToAddress()` function
- `checkAllCredentials` flag

## Implementation Plan

1. Generate new backend with real Ledger integration and subaccount derivation
2. Update frontend PaymentGate to use `getUserPaymentAddress()` hook
3. Add `useGetUserPaymentAddress` hook
4. Deploy
