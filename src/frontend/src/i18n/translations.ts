export type Language = 'en' | 'de';

export interface Translations {
  header: {
    title: string;
    subtitle: string;
  };
  intro: {
    heading: string;
    description: string;
  };
  factors: {
    nutrition: {
      label: string;
      description: string;
    };
    sleep: {
      label: string;
      description: string;
    };
    movement: {
      label: string;
      description: string;
    };
    stress: {
      label: string;
      description: string;
    };
    fasting: {
      label: string;
      description: string;
    };
  };
  footer: {
    builtWith: string;
    copyright: string;
  };
  languageSwitcher: {
    label: string;
  };
  auth: {
    login: string;
    logout: string;
    loggingIn: string;
  };
  profile: {
    loginRequired: {
      title: string;
      description: string;
    };
    setup: {
      title: string;
      description: string;
    };
    fields: {
      name: string;
      birthYear: string;
      heightCm: string;
      gender: string;
    };
    placeholders: {
      name: string;
      birthYear: string;
      heightCm: string;
    };
    genderOptions: {
      male: string;
      female: string;
      diverse: string;
    };
    validation: {
      nameRequired: string;
      birthYearInvalid: string;
      heightInvalid: string;
    };
    actions: {
      save: string;
      saving: string;
    };
  };
  fastingSchedule: {
    title: string;
    description: string;
    current: {
      label: string;
      protocol: string;
    };
    fields: {
      startHour: string;
      endHour: string;
    };
    help: {
      crossMidnight: string;
      protocol: string;
    };
    actions: {
      edit: string;
      save: string;
      saving: string;
      cancel: string;
    };
  };
  fastingPanel: {
    title: string;
    subtitle: string;
    status: {
      label: string;
      fasting: string;
      eating: string;
      fastingDesc: string;
      eatingDesc: string;
    };
    timer: {
      elapsed: string;
      remaining: string;
      elapsedDesc: string;
      remainingDesc: string;
    };
    progress: {
      label: string;
      complete: string;
    };
    daily: {
      label: string;
      sessions: string;
      hours: string;
    };
    weekly: {
      label: string;
      sessions: string;
      hours: string;
    };
    streak: {
      label: string;
      days: string;
    };
    insights: {
      label: string;
      fastingTip: string;
      eatingTip: string;
    };
  };
  nutritionPanel: {
    title: string;
    subtitle: string;
    authRequired: string;
    fastingPhase: {
      label: string;
      fasting: string;
      eating: string;
      fastingTip: string;
      eatingTip: string;
    };
    weight: {
      label: string;
      unit: string;
    };
    bmi: {
      label: string;
      unit: string;
      heightMissing: string;
    };
    protein: {
      label: string;
      target: string;
      targetUnavailable: string;
      consumed: string;
      progress: string;
      targetReached: string;
      remaining: string;
    };
    vegetables: {
      label: string;
      goal: string;
      consumed: string;
      progress: string;
      goalReached: string;
      remaining: string;
    };
    actions: {
      save: string;
      saving: string;
      saveSuccess: string;
      saveError: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: 'LivSpan',
      subtitle: 'LONGEVITY DASHBOARD',
    },
    intro: {
      heading: 'Your Health Genome',
      description:
        'Monitor the five fundamental factors that influence longevity and well-being. Each element connects to form your unique health profile.',
    },
    factors: {
      nutrition: {
        label: 'Nutrition',
        description: 'Track your daily nutritional intake and balance',
      },
      sleep: {
        label: 'Sleep',
        description: 'Monitor your sleep quality and duration',
      },
      movement: {
        label: 'Movement',
        description: 'Track your physical activity and exercise',
      },
      stress: {
        label: 'Stress',
        description: 'Manage stress levels and mental well-being',
      },
      fasting: {
        label: 'Fasting',
        description: 'Monitor your intermittent fasting schedule',
      },
    },
    footer: {
      builtWith: 'Built with love using',
      copyright: 'All rights reserved',
    },
    languageSwitcher: {
      label: 'Switch language',
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      loggingIn: 'Logging in...',
    },
    profile: {
      loginRequired: {
        title: 'Welcome to LivSpan',
        description: 'Please log in to access your personalized longevity dashboard and track your health data.',
      },
      setup: {
        title: 'Complete Your Profile',
        description: 'Tell us a bit about yourself to personalize your health tracking experience.',
      },
      fields: {
        name: 'Name',
        birthYear: 'Birth Year',
        heightCm: 'Height (cm)',
        gender: 'Gender',
      },
      placeholders: {
        name: 'Enter your name',
        birthYear: '1990',
        heightCm: '170',
      },
      genderOptions: {
        male: 'Male',
        female: 'Female',
        diverse: 'Diverse',
      },
      validation: {
        nameRequired: 'Name is required',
        birthYearInvalid: 'Please enter a valid birth year (1900-present)',
        heightInvalid: 'Please enter a valid height (50-300 cm)',
      },
      actions: {
        save: 'Save Profile',
        saving: 'Saving...',
      },
    },
    fastingSchedule: {
      title: 'Fasting Schedule',
      description: 'Customize your daily fasting window',
      current: {
        label: 'Current Schedule',
        protocol: 'Protocol',
      },
      fields: {
        startHour: 'Fasting Start',
        endHour: 'Fasting End',
      },
      help: {
        crossMidnight: 'Your fasting window can cross midnight (e.g., 20:00 to 12:00 next day).',
        protocol: 'Protocol',
      },
      actions: {
        edit: 'Edit Schedule',
        save: 'Save',
        saving: 'Saving...',
        cancel: 'Cancel',
      },
    },
    fastingPanel: {
      title: 'Intermittent Fasting',
      subtitle: '16:8 PROTOCOL',
      status: {
        label: 'Current Status',
        fasting: 'Fasting',
        eating: 'Eating Window',
        fastingDesc: 'Your body is in fat-burning mode',
        eatingDesc: 'Time to nourish your body',
      },
      timer: {
        elapsed: 'Time Elapsed',
        remaining: 'Time Remaining',
        elapsedDesc: 'in current phase',
        remainingDesc: 'until phase ends',
      },
      progress: {
        label: 'Phase Progress',
        complete: 'Complete',
      },
      daily: {
        label: 'Today',
        sessions: 'Sessions',
        hours: 'Hours',
      },
      weekly: {
        label: 'This Week',
        sessions: 'Sessions',
        hours: 'Hours',
      },
      streak: {
        label: 'Current Streak',
        days: 'Days',
      },
      insights: {
        label: 'Insights',
        fastingTip: 'Stay hydrated during your fasting window. Water, black coffee, and unsweetened tea are allowed.',
        eatingTip: 'Focus on nutrient-dense whole foods. Prioritize protein and vegetables for optimal health.',
      },
    },
    nutritionPanel: {
      title: 'Nutrition',
      subtitle: 'NATURELL PROTOCOL',
      authRequired: 'Please log in to track your daily nutrition.',
      fastingPhase: {
        label: 'Fasting Phase',
        fasting: 'Fasting',
        eating: 'Eating Window',
        fastingTip: 'Stay hydrated during your fasting window. Water, black coffee, and unsweetened tea are allowed.',
        eatingTip: 'Focus on protein and vegetables. Aim for 1.8g protein per kg body weight and 400g vegetables daily.',
      },
      weight: {
        label: 'Body Weight',
        unit: 'Weight (kg)',
      },
      bmi: {
        label: 'Body Mass Index',
        unit: 'BMI',
        heightMissing: 'Please complete your profile with height to calculate BMI.',
      },
      protein: {
        label: 'Protein Intake',
        target: 'Daily Target (1.8 g/kg)',
        targetUnavailable: 'Enter weight to see target',
        consumed: 'Consumed',
        progress: 'Progress',
        targetReached: '✓ Daily protein target reached!',
        remaining: '{amount} g remaining to reach target',
      },
      vegetables: {
        label: 'Vegetable Intake',
        goal: 'Daily Goal',
        consumed: 'Consumed',
        progress: 'Progress',
        goalReached: '✓ Daily vegetable goal reached!',
        remaining: '{amount} g remaining to reach goal',
      },
      actions: {
        save: 'Save Today\'s Nutrition',
        saving: 'Saving...',
        saveSuccess: 'Nutrition data saved successfully',
        saveError: 'Failed to save nutrition data',
      },
    },
  },
  de: {
    header: {
      title: 'LivSpan',
      subtitle: 'LANGLEBIGKEITS-DASHBOARD',
    },
    intro: {
      heading: 'Dein Gesundheitsgenom',
      description:
        'Überwache die fünf grundlegenden Faktoren, die Langlebigkeit und Wohlbefinden beeinflussen. Jedes Element verbindet sich zu deinem einzigartigen Gesundheitsprofil.',
    },
    factors: {
      nutrition: {
        label: 'Ernährung',
        description: 'Verfolge deine tägliche Nahrungsaufnahme und Balance',
      },
      sleep: {
        label: 'Schlaf',
        description: 'Überwache deine Schlafqualität und -dauer',
      },
      movement: {
        label: 'Bewegung',
        description: 'Verfolge deine körperliche Aktivität und Übungen',
      },
      stress: {
        label: 'Stress',
        description: 'Manage Stresslevel und mentales Wohlbefinden',
      },
      fasting: {
        label: 'Fasten',
        description: 'Überwache deinen Intervallfasten-Zeitplan',
      },
    },
    footer: {
      builtWith: 'Mit Liebe erstellt mit',
      copyright: 'Alle Rechte vorbehalten',
    },
    languageSwitcher: {
      label: 'Sprache wechseln',
    },
    auth: {
      login: 'Anmelden',
      logout: 'Abmelden',
      loggingIn: 'Anmeldung läuft...',
    },
    profile: {
      loginRequired: {
        title: 'Willkommen bei LivSpan',
        description:
          'Bitte melde dich an, um auf dein personalisiertes Langlebigkeits-Dashboard zuzugreifen und deine Gesundheitsdaten zu verfolgen.',
      },
      setup: {
        title: 'Vervollständige dein Profil',
        description: 'Erzähle uns ein wenig über dich, um deine Gesundheitsverfolgung zu personalisieren.',
      },
      fields: {
        name: 'Name',
        birthYear: 'Geburtsjahr',
        heightCm: 'Größe (cm)',
        gender: 'Geschlecht',
      },
      placeholders: {
        name: 'Gib deinen Namen ein',
        birthYear: '1990',
        heightCm: '170',
      },
      genderOptions: {
        male: 'Männlich',
        female: 'Weiblich',
        diverse: 'Divers',
      },
      validation: {
        nameRequired: 'Name ist erforderlich',
        birthYearInvalid: 'Bitte gib ein gültiges Geburtsjahr ein (1900-heute)',
        heightInvalid: 'Bitte gib eine gültige Größe ein (50-300 cm)',
      },
      actions: {
        save: 'Profil speichern',
        saving: 'Speichern...',
      },
    },
    fastingSchedule: {
      title: 'Fastenplan',
      description: 'Passe dein tägliches Fastenfenster an',
      current: {
        label: 'Aktueller Plan',
        protocol: 'Protokoll',
      },
      fields: {
        startHour: 'Fastenbeginn',
        endHour: 'Fastenende',
      },
      help: {
        crossMidnight: 'Dein Fastenfenster kann über Mitternacht gehen (z.B. 20:00 bis 12:00 am nächsten Tag).',
        protocol: 'Protokoll',
      },
      actions: {
        edit: 'Plan bearbeiten',
        save: 'Speichern',
        saving: 'Speichern...',
        cancel: 'Abbrechen',
      },
    },
    fastingPanel: {
      title: 'Intervallfasten',
      subtitle: '16:8 PROTOKOLL',
      status: {
        label: 'Aktueller Status',
        fasting: 'Fastenphase',
        eating: 'Essensfenster',
        fastingDesc: 'Dein Körper ist im Fettverbrennungsmodus',
        eatingDesc: 'Zeit, deinen Körper zu nähren',
      },
      timer: {
        elapsed: 'Verstrichene Zeit',
        remaining: 'Verbleibende Zeit',
        elapsedDesc: 'in aktueller Phase',
        remainingDesc: 'bis Phasenende',
      },
      progress: {
        label: 'Phasenfortschritt',
        complete: 'Abgeschlossen',
      },
      daily: {
        label: 'Heute',
        sessions: 'Sitzungen',
        hours: 'Stunden',
      },
      weekly: {
        label: 'Diese Woche',
        sessions: 'Sitzungen',
        hours: 'Stunden',
      },
      streak: {
        label: 'Aktuelle Serie',
        days: 'Tage',
      },
      insights: {
        label: 'Einblicke',
        fastingTip:
          'Bleib während deines Fastenfensters hydratisiert. Wasser, schwarzer Kaffee und ungesüßter Tee sind erlaubt.',
        eatingTip:
          'Konzentriere dich auf nährstoffreiche Vollwertkost. Priorisiere Protein und Gemüse für optimale Gesundheit.',
      },
    },
    nutritionPanel: {
      title: 'Ernährung',
      subtitle: 'NATURELL PROTOKOLL',
      authRequired: 'Bitte melde dich an, um deine tägliche Ernährung zu verfolgen.',
      fastingPhase: {
        label: 'Fastenphase',
        fasting: 'Fastenphase',
        eating: 'Essensfenster',
        fastingTip:
          'Bleib während deines Fastenfensters hydratisiert. Wasser, schwarzer Kaffee und ungesüßter Tee sind erlaubt.',
        eatingTip:
          'Konzentriere dich auf Protein und Gemüse. Ziel: 1,8g Protein pro kg Körpergewicht und 400g Gemüse täglich.',
      },
      weight: {
        label: 'Körpergewicht',
        unit: 'Gewicht (kg)',
      },
      bmi: {
        label: 'Body-Mass-Index',
        unit: 'BMI',
        heightMissing: 'Bitte vervollständige dein Profil mit der Körpergröße, um den BMI zu berechnen.',
      },
      protein: {
        label: 'Proteinzufuhr',
        target: 'Tagesziel (1,8 g/kg)',
        targetUnavailable: 'Gewicht eingeben für Ziel',
        consumed: 'Aufgenommen',
        progress: 'Fortschritt',
        targetReached: '✓ Tägliches Proteinziel erreicht!',
        remaining: '{amount} g verbleibend bis zum Ziel',
      },
      vegetables: {
        label: 'Gemüsezufuhr',
        goal: 'Tagesziel',
        consumed: 'Aufgenommen',
        progress: 'Fortschritt',
        goalReached: '✓ Tägliches Gemüseziel erreicht!',
        remaining: '{amount} g verbleibend bis zum Ziel',
      },
      actions: {
        save: 'Heutige Ernährung speichern',
        saving: 'Speichern...',
        saveSuccess: 'Ernährungsdaten erfolgreich gespeichert',
        saveError: 'Fehler beim Speichern der Ernährungsdaten',
      },
    },
  },
};
