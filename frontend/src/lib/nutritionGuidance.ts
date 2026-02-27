interface MacroInput {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export type GuidanceKey = 'balanced' | 'proteinLow' | 'proteinHigh' | 'fatDominant' | 'carbDominant' | 'caloriesMismatch' | 'noData';

/**
 * Deterministic guidance utility that analyzes macro distribution
 * and returns a guidance key for i18n lookup.
 * 
 * This is non-medical and purely informational.
 */
export function getNutrientGuidance(input: MacroInput): GuidanceKey {
  const { calories, protein, fat, carbs } = input;

  // No data entered
  if (calories === 0 && protein === 0 && fat === 0 && carbs === 0) {
    return 'noData';
  }

  // Calculate calories from macros (protein: 4 kcal/g, fat: 9 kcal/g, carbs: 4 kcal/g)
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const carbCalories = carbs * 4;
  const totalMacroCalories = proteinCalories + fatCalories + carbCalories;

  // Check for significant mismatch between entered calories and macro-derived calories
  if (calories > 0 && totalMacroCalories > 0) {
    const difference = Math.abs(calories - totalMacroCalories);
    const percentDifference = (difference / calories) * 100;
    
    if (percentDifference > 20) {
      return 'caloriesMismatch';
    }
  }

  // If we have macro data, analyze distribution
  if (totalMacroCalories > 0) {
    const proteinPercent = (proteinCalories / totalMacroCalories) * 100;
    const fatPercent = (fatCalories / totalMacroCalories) * 100;
    const carbPercent = (carbCalories / totalMacroCalories) * 100;

    // Check for very low protein (< 10%)
    if (proteinPercent < 10) {
      return 'proteinLow';
    }

    // Check for very high protein (> 40%)
    if (proteinPercent > 40) {
      return 'proteinHigh';
    }

    // Check for fat dominance (> 50%)
    if (fatPercent > 50) {
      return 'fatDominant';
    }

    // Check for carb dominance (> 60%)
    if (carbPercent > 60) {
      return 'carbDominant';
    }

    // Otherwise, distribution seems balanced
    return 'balanced';
  }

  // Default to no data if we can't determine
  return 'noData';
}
