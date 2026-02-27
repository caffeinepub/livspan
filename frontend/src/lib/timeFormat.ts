/**
 * Shared duration/time formatting utilities for timer and KPI display
 */

/**
 * Format seconds into HH:MM:SS format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format hours with one decimal place and unit
 */
export function formatHours(hours: number): string {
  return `${hours.toFixed(1)}h`;
}
