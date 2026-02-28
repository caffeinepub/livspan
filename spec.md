# Specification

## Summary
**Goal:** Allow the canister owner to configure the ICP payment wallet address used for payment gating, directly from the registration/login (PaymentGate) screen.

**Planned changes:**
- Add a backend function `setOwnerIcpAddress(address: Text)` restricted to the canister owner that persists the ICP payment address in stable storage.
- Update stable storage in the backend to hold the configurable owner ICP address; generate migration.mo if needed.
- Add an admin configuration UI (panel or modal) on the PaymentGate screen, visible only to the authenticated canister owner.
- The admin UI pre-fills the current ICP payment address and provides an input field and save button to update it.
- On save, call the backend `setOwnerIcpAddress` function and show a success/error toast; immediately reflect the updated address in the PaymentGate screen.

**User-visible outcome:** The canister owner, when authenticated on the PaymentGate screen, sees an admin configuration panel to view and update the ICP payment wallet address. Non-owner users see no change to the existing PaymentGate UI.
