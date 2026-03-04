/**
 * Centralized React Query keys for consistent cache management
 */
export const queryKeys = {
  userProfile: ["currentUserProfile"] as const,
  fastingSchedule: ["callerFastingSchedule"] as const,
  nutrition: {
    today: ["nutrition", "today"] as const,
  },
  sleep: {
    today: ["sleep", "today"] as const,
  },
  movement: {
    day: (date: string) => ["movement", "day", date] as const,
  },
  stress: {
    day: (date: string) => ["stress", "day", date] as const,
  },
  activation: {
    user: (principal: string) => ["userActivation", principal] as const,
  },
  icpAddress: ["icpAddress"] as const,
} as const;

export function movementDay(date: string) {
  return queryKeys.movement.day(date);
}

export function stressDay(date: string) {
  return queryKeys.stress.day(date);
}
