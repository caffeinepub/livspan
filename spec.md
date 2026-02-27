# Specification

## Summary
**Goal:** Add Movement and Stress tracking modules to the LivSpan Dashboard, allowing users to log daily activity and blood pressure/pulse data alongside the existing health factors.

**Planned changes:**
- Add `MovementDay` data type and stable storage to the backend actor with `saveMovementDay` and `getMovementDay` endpoints (activeMinutes, activityType: Walk/Run/Bike/Gym, intensity: Light/Medium/Intense)
- Add `StressDay` data type and stable storage to the backend actor with `saveStressDay` and `getStressDay` endpoints (systolic, diastolic, pulse)
- Migrate actor state to include the two new stable maps while preserving all existing data
- Add `movementDay` and `stressDay` query key factories to `queryKeys.ts`
- Create `useMovementQueries.ts` with `useGetMovementDay` and `useSaveMovementDay` hooks
- Create `useStressQueries.ts` with `useGetStressDay` and `useSaveStressDay` hooks
- Create `MovementPanel.tsx` with inputs for Active Minutes (0–300), Activity Type selector, and Intensity toggle, matching the existing dark gradient card style
- Create `StressPanel.tsx` with inputs for Systolic, Diastolic, and Pulse, displaying blood pressure as "Sys/Dia mmHg", matching the existing dark gradient card style
- Add Movement and Stress as selectable factors in `StartDashboard.tsx`, rendering their respective panels when selected
- Add English and German i18n translation strings for all new Movement and Stress UI labels

**User-visible outcome:** Users can select Movement or Stress from the dashboard's factor list, log their daily activity details or blood pressure/pulse readings, and save the data — all within the same visual style as the existing Fasting, Nutrition, and Sleep panels.
