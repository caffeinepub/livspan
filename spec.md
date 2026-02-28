# Specification

## Summary
**Goal:** Add a one-time ICP payment gate so that only users who have paid 1 ICP (and been manually activated by the owner) can access the LivSpan app.

**Planned changes:**
- Backend: Store a configurable owner ICP account identifier in stable state; only the canister owner can update it.
- Backend: Add a stable map from Principal to activation status (Boolean) with a public `isActivated(principal)` query and an owner-only `activateUser(principal)` update function.
- Backend: Expose a public `getPaymentAddress()` query returning the owner's ICP account identifier.
- Backend: Enforce the activation gate on all existing authenticated endpoints so non-activated users receive an error.
- Frontend: Add a full-screen payment gate shown to authenticated but non-activated users instead of the dashboard, displaying the required amount (1 ICP), the owner's ICP address (fetched from backend), a copy-to-clipboard button, and instructions to wait for manual confirmation.
- Frontend: Poll activation status every 30 seconds and automatically redirect to the dashboard upon activation.
- Frontend: Integrate activation check into the existing auth/onboarding gate so non-activated users cannot navigate to any dashboard panel; activated users bypass the gate entirely.
- Frontend: Style the payment gate consistently with the existing LivSpan DNA helix design system.

**User-visible outcome:** After logging in, users who have not yet paid see a payment gate with the owner's ICP address and instructions. Once the owner confirms receipt and activates their account, the app automatically grants access and shows the dashboard. Already-activated users experience no change.
