# Creator

## Current State
Dashboard has 6 factor markers: Nutrition, Sleep, Movement, Stress, Fasting, Diary. Each opens a panel below the helix. Header and footer use a near-black glass style (`rgba(0, 8, 5, 0.65)`). Tiles (FactorMarker cards and sub-panels) use a dark-tinted glass style. All text is already using green-blue color tones.

## Requested Changes (Diff)

### Add
- New `RoutinesPanel` component for daily/weekly routine tracking with add, edit, delete functionality (stored locally in state, no backend required — routines are frontend-only checklists)
- New `routines` factor type added to `factors` array in `StartDashboard` with position 6
- Translations for `routines` factor label/description and `routinesPanel` strings in both `en` and `de`

### Modify
- Header (`<header>`): Change background from near-black `rgba(0, 8, 5, 0.65)` to true frosted milkglass: `rgba(255, 255, 255, 0.08)` with `backdrop-filter: blur(24px) saturate(200%)`, border `rgba(255,255,255,0.15)`. Text must NOT be black — keep existing neon-text gradient classes.
- Footer (`<footer>`): Same milkglass treatment. Text color stays in green-blue tones, not black.
- FactorMarker cards: Update both selected and unselected states to use true frosted milkglass (`rgba(255,255,255,0.07)` unselected, `rgba(255,255,255,0.13)` selected), with white/teal border highlights.
- Sub-panel wrapper `glass-card` class in `index.css`: Update to true frosted milkglass: `rgba(255,255,255,0.07)` background, `blur(24px) saturate(200%)`, border `rgba(255,255,255,0.15)`.
- `.dark [data-slot="card"]` in `index.css`: Update to same milkglass values.
- `futuristic-card` class: Same milkglass update.
- All section wrappers in `StartDashboard` that use `glass-card` should keep using `glass-card` (the CSS class will be updated).

### Remove
- Nothing removed

## Implementation Plan
1. Add `routines` to `FactorType` union and `factors` array in `StartDashboard.tsx`
2. Add translations for `routines` factor and `routinesPanel` in `translations.ts` (both `en` and `de`) and update `Translations` interface
3. Create `src/frontend/src/components/dashboard/RoutinesPanel.tsx` — a checklist/routine manager with add, edit, delete, and daily completion toggle. Routines are stored in `localStorage` for persistence. Each routine has: `id`, `name`, `frequency` (daily/weekly), `completedToday` flag.
4. Add import and render of `RoutinesPanel` in `StartDashboard.tsx` for `selectedFactor === "routines"`
5. Update `index.css`: change `.glass-card`, `.dark [data-slot="card"]`, and `.futuristic-card` to frosted milkglass values
6. Update `StartDashboard.tsx` header and footer inline styles to frosted milkglass
7. Update `FactorMarker.tsx` card styles to frosted milkglass
8. Validate (typecheck + build)
