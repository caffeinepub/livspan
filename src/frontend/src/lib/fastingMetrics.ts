/**
 * Frontend-only helpers to derive display-ready daily/weekly summaries
 * and streak from a local (non-persisted) model.
 * 
 * This is a demo implementation with mock data.
 */

interface FastingSummary {
  sessions: number;
  totalHours: number;
}

/**
 * Get today's fasting summary
 */
export function getDailySummary(): FastingSummary {
  // Demo: simulate 1 session today with ~14 hours completed
  return {
    sessions: 1,
    totalHours: 14.2,
  };
}

/**
 * Get this week's fasting summary
 */
export function getWeeklySummary(): FastingSummary {
  // Demo: simulate 6 sessions this week with ~85 hours total
  return {
    sessions: 6,
    totalHours: 85.5,
  };
}

/**
 * Get current streak (consecutive days)
 */
export function getStreak(): number {
  // Demo: simulate a 12-day streak
  return 12;
}
