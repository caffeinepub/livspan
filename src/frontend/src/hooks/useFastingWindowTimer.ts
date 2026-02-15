import { useState, useEffect } from 'react';

interface FastingWindowState {
  phase: 'fasting' | 'eating';
  elapsed: number;
  remaining: number;
  progress: number;
}

/**
 * Hook that computes the current fasting/eating phase, elapsed/remaining time,
 * and progress for the current window. Updates once per second while mounted.
 * 
 * This is a demo implementation using a 16:8 schedule (16h fasting, 8h eating)
 * with fasting window from 20:00 to 12:00 (next day).
 */
export function useFastingWindowTimer(): FastingWindowState {
  const [state, setState] = useState<FastingWindowState>(() => calculateState());

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      setState(calculateState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return state;
}

function calculateState(): FastingWindowState {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  // 16:8 schedule: Fasting from 20:00 to 12:00 (next day), Eating from 12:00 to 20:00
  const fastingStartHour = 20; // 8 PM
  const fastingEndHour = 12;   // 12 PM (next day)
  const fastingDurationHours = 16;
  const eatingDurationHours = 8;

  let phase: 'fasting' | 'eating';
  let elapsed: number;
  let remaining: number;
  let progress: number;

  // Determine current phase
  if (currentHour >= fastingStartHour || currentHour < fastingEndHour) {
    // Fasting phase
    phase = 'fasting';
    
    // Calculate elapsed time in fasting window
    let elapsedHours: number;
    if (currentHour >= fastingStartHour) {
      // Same day (after 20:00)
      elapsedHours = currentHour - fastingStartHour;
    } else {
      // Next day (before 12:00)
      elapsedHours = (24 - fastingStartHour) + currentHour;
    }
    
    elapsed = (elapsedHours * 3600) + (currentMinute * 60) + currentSecond;
    remaining = (fastingDurationHours * 3600) - elapsed;
    progress = (elapsed / (fastingDurationHours * 3600)) * 100;
  } else {
    // Eating phase (12:00 to 20:00)
    phase = 'eating';
    
    const elapsedHours = currentHour - fastingEndHour;
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
