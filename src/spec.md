# Specification

## Summary
**Goal:** Add a subtle, continuous “scientific” breathing/drifting animation to the DNA helix spine on the Start Dashboard without impacting factor marker readability or layout.

**Planned changes:**
- Add/extend Tailwind keyframes + animation utilities (via the existing Tailwind setup) to support a low-amplitude, slow, smooth helix motion.
- Apply the animation only to helix visuals in `frontend/src/components/genome/HelixSpine.tsx` (e.g., strands/base pairs/background layers), ensuring factor markers do not jitter and their positions do not reflow.
- Respect `prefers-reduced-motion: reduce` by disabling (or making imperceptible) the helix motion while keeping all other marker interactions unchanged.

**User-visible outcome:** On the Start Dashboard, the DNA helix spine gently animates with a subtle scientific drift/breathing effect, and users who prefer reduced motion see a static/near-static helix.
