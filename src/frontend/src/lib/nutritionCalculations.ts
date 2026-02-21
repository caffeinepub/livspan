/**
 * Client-side pure helpers for Nutrition calculations
 */

/**
 * Calculate BMI from weight (kg) and height (cm)
 * Formula: BMI = weight(kg) / (height(m))^2
 */
export function calculateBMI(weightKg: number, heightCm: number): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return null;
  }
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * Format BMI value for display
 */
export function formatBMI(bmi: number | null): string {
  if (bmi === null) return '—';
  return bmi.toFixed(1);
}

/**
 * Calculate daily protein target (1.8 g/kg body weight)
 */
export function calculateProteinTarget(weightKg: number): number | null {
  if (!weightKg || weightKg <= 0) {
    return null;
  }
  return Math.round(weightKg * 1.8);
}

/**
 * Format protein target for display
 */
export function formatProteinTarget(grams: number | null): string {
  if (grams === null) return '—';
  return `${grams} g`;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * Safe parse float with fallback
 */
export function safeParseFloat(value: string, fallback: number = 0): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Safe parse int with fallback
 */
export function safeParseInt(value: string, fallback: number = 0): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}
