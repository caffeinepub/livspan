# Specification

## Summary
**Goal:** Add a data-oriented Intermittent Fasting detail panel to the dashboard that appears when the “Intermittent Fasting” factor is selected, emphasizing quantitative metrics and structured KPI-style presentation.

**Planned changes:**
- Add an Intermittent Fasting dashboard panel/section that shows and hides based on the existing selectedFactor toggle behavior for the “Intermittent Fasting” marker.
- Implement a data-forward layout for the fasting panel (KPI tiles, compact lists/tables, and timeline-style blocks) aligned with the existing dark theme and legible numeric typography for metrics/time.
- Include fasting panel content groups: current status (Fasting/Eating/Starts In), a live-updating timer readout, a progress indicator for the current window, daily + weekly summaries, a streak metric, and an insights/tips area that changes with the current phase.
- Add EN/DE translations for all new user-facing strings using the existing i18n structure and ensure language toggle switches fasting panel text correctly.
- Ensure responsive behavior (mobile through desktop) so the panel remains readable, does not overlap/obscure helix visuals or factor marker cards, and preserves existing marker click + keyboard interactions.

**User-visible outcome:** Selecting the Intermittent Fasting factor reveals a quantitative fasting dashboard panel with live timer, progress, summaries, streak, and phase-based tips (in English or German), and de-selecting hides it without disrupting other dashboard interactions.
