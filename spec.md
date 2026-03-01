# Specification

## Summary
**Goal:** Implement automatic ICP Ledger payment verification so that user accounts are activated immediately and automatically after a qualifying ICP payment is detected.

**Planned changes:**
- Backend: Integrate the ICP Ledger canister (`ryjl3-tyaaa-aaaaa-aaaba-cai`) via inter-canister call; store the default receiving address (`eadaef90a0208bf42e25d15b9d99b767e72ed66ed1fab5b66a7799bfe88283c0`); add a `verifyAndActivate()` public function that checks for a payment of ≥ 1 ICP to that address from the calling principal and marks the account as activated if found.
- Frontend: Add `verifyAndActivate` to the actor interface and expose a `useVerifyAndActivateMutation` hook in `useActivationQueries.ts` that calls the backend method and invalidates the activation-status query on success.
- Frontend: Update the `PaymentGate` component to show a "Check Payment" button that triggers `verifyAndActivate()`, display a loading spinner during the call, show a success state on activation, show a friendly error message if no payment is found yet, and keep the existing 30-second activation polling active.

**User-visible outcome:** After sending ICP to the displayed payment address, users can click "Check Payment" in the PaymentGate to instantly verify and activate their account. The gate also auto-dismisses when activation is confirmed via background polling.
