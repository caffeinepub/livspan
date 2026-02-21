/**
 * Centralized React Query keys for consistent cache management
 */
export const queryKeys = {
  userProfile: ['currentUserProfile'] as const,
  fastingSchedule: ['callerFastingSchedule'] as const,
  nutrition: {
    today: ['nutrition', 'today'] as const,
  },
} as const;
