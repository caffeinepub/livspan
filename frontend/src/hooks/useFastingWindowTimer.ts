import { useState, useEffect } from 'react';

interface FastingWindowState {
  phase: 'fasting' | 'eating';
  elapsed: number;
  remaining: number;
  progress: number;
}

interface FastingSchedule {
  startHour: number;
  endHour: number;
}

/**
 * Hook that computes the current fasting/eating phase, elapsed/remaining time,
 * and progress for the current window. Updates once per second while mounted.
 * 
 * @param schedule Optional custom schedule. If not provided, defaults to 16:8 (20:00-12:00)
 */
export function useFastingWindowTimer(schedule?: FastingSchedule | null): FastingWindowState {
  const [state, setState] = useState<FastingWindowState>(() => calculateState(schedule));

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      setState(calculateState(schedule));
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule]);

  return state;
}

function calculateState(schedule?: FastingSchedule | null): FastingWindowState {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  // Use provided schedule or default to 16:8 (20:00-12:00)
  const fastingStartHour = schedule?.startHour ?? 20;
  const fastingEndHour = schedule?.endHour ?? 12;

  // Calculate fasting duration (handles cross-midnight windows)
  const fastingDurationHours =
    fastingEndHour > fastingStartHour
      ? fastingEndHour - fastingStartHour
      : (24 - fastingStartHour) + fastingEndHour;
  
  const eatingDurationHours = 24 - fastingDurationHours;

  let phase: 'fasting' | 'eating';
  let elapsed: number;
  let remaining: number;
  let progress: number;

  // Determine current phase
  const isInFastingWindow =
    fastingStartHour < fastingEndHour
      ? currentHour >= fastingStartHour && currentHour < fastingEndHour
      : currentHour >= fastingStartHour || currentHour < fastingEndHour;

  if (isInFastingWindow) {
    // Fasting phase
    phase = 'fasting';
    
    // Calculate elapsed time in fasting window
    let elapsedHours: number;
    if (fastingStartHour < fastingEndHour) {
      // Same-day window
      elapsedHours = currentHour - fastingStartHour;
    } else {
      // Cross-midnight window
      if (currentHour >= fastingStartHour) {
        elapsedHours = currentHour - fastingStartHour;
      } else {
        elapsedHours = (24 - fastingStartHour) + currentHour;
      }
    }
    
    elapsed = (elapsedHours * 3600) + (currentMinute * 60) + currentSecond;
    remaining = (fastingDurationHours * 3600) - elapsed;
    progress = (elapsed / (fastingDurationHours * 3600)) * 100;
  } else {
    // Eating phase
    phase = 'eating';
    
    // Calculate elapsed time in eating window
    let elapsedHours: number;
    if (fastingStartHour < fastingEndHour) {
      // Eating window wraps midnight
      if (currentHour >= fastingEndHour && currentHour < fastingStartHour) {
        elapsedHours = currentHour - fastingEndHour;
      } else if (currentHour >= fastingEndHour) {
        elapsedHours = currentHour - fastingEndHour;
      } else {
        elapsedHours = (24 - fastingEndHour) + currentHour;
      }
    } else {
      // Eating window is same-day
      elapsedHours = currentHour - fastingEndHour;
    }
    
    elapsed = (elapsedHours * 3600) + (currentMinute * 60) + currentSecond;
    remaining = (eatingDurationHours * 3600) - elapsed;
    progress = (elapsed / (eatingDurationHours * 3600)) * 100;
  }

  return {
    phase,
    elapsed: Math.max(0, elapsed),
    remaining: Math.max(0, remaining),
    progress: Math.min(100, Math.max(0, progress)),
  };
}
