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
        description: 'Monitor sleep quality and duration',
      },
      movement: {
        label: 'Movement',
        description: 'Record physical activity and exercise',
      },
      stress: {
        label: 'Stress',
        description: 'Manage stress levels and mental well-being',
      },
      fasting: {
        label: 'Intermittent Fasting',
        description: 'Manage your fasting windows and schedules',
      },
    },
    footer: {
      builtWith: 'Built with love using',
      copyright: 'LivSpan',
    },
    languageSwitcher: {
      label: 'Language',
    },
    fastingPanel: {
      title: 'Intermittent Fasting',
      subtitle: 'REAL-TIME METRICS & INSIGHTS',
      status: {
        label: 'Current Status',
        fasting: 'Fasting',
        eating: 'Eating Window',
        fastingDesc: 'Your body is in fat-burning mode',
        eatingDesc: 'Nutrient intake window active',
      },
      timer: {
        elapsed: 'Time Elapsed',
        remaining: 'Time Remaining',
        elapsedDesc: 'Current window duration',
        remainingDesc: 'Until window closes',
      },
      progress: {
        label: 'Current Window Progress',
        complete: 'Complete',
      },
      daily: {
        label: 'Today',
        sessions: 'Sessions',
        hours: 'Total Hours',
      },
      weekly: {
        label: 'This Week',
        sessions: 'Sessions',
        hours: 'Total Hours',
      },
      streak: {
        label: 'Current Streak',
        days: 'Consecutive Days',
      },
      insights: {
        label: 'Insights & Tips',
        fastingTip: 'Stay hydrated during your fasting window. Water, black coffee, and unsweetened tea are excellent choices to maintain hydration and support autophagy.',
        eatingTip: 'Focus on nutrient-dense whole foods during your eating window. Prioritize protein, healthy fats, and fiber-rich vegetables for optimal satiety and metabolic health.',
      },
    },
  },
  de: {
    header: {
      title: 'LivSpan',
      subtitle: 'LANGLEBIGKEITS-DASHBOARD',
    },
    intro: {
      heading: 'Ihr Gesundheitsgenom',
      description:
        'Überwachen Sie die fünf grundlegenden Faktoren, die Langlebigkeit und Wohlbefinden beeinflussen. Jedes Element verbindet sich zu Ihrem einzigartigen Gesundheitsprofil.',
    },
    factors: {
      nutrition: {
        label: 'Ernährung',
        description: 'Verfolgen Sie Ihre tägliche Nährstoffaufnahme und Balance',
      },
      sleep: {
        label: 'Schlaf',
        description: 'Überwachen Sie Schlafqualität und -dauer',
      },
      movement: {
        label: 'Bewegung',
        description: 'Erfassen Sie körperliche Aktivität und Training',
      },
      stress: {
        label: 'Stress',
        description: 'Verwalten Sie Stresslevel und mentales Wohlbefinden',
      },
      fasting: {
        label: 'Intervallfasten',
        description: 'Verwalten Sie Ihre Fastenfenster und Zeitpläne',
      },
    },
    footer: {
      builtWith: 'Mit Liebe erstellt mit',
      copyright: 'LivSpan',
    },
    languageSwitcher: {
      label: 'Sprache',
    },
    fastingPanel: {
      title: 'Intervallfasten',
      subtitle: 'ECHTZEIT-METRIKEN & EINBLICKE',
      status: {
        label: 'Aktueller Status',
        fasting: 'Fastenphase',
        eating: 'Essensfenster',
        fastingDesc: 'Ihr Körper ist im Fettverbrennungsmodus',
        eatingDesc: 'Nährstoffaufnahme-Fenster aktiv',
      },
      timer: {
        elapsed: 'Verstrichene Zeit',
        remaining: 'Verbleibende Zeit',
        elapsedDesc: 'Aktuelle Fensterdauer',
        remainingDesc: 'Bis Fenster schließt',
      },
      progress: {
        label: 'Fortschritt Aktuelles Fenster',
        complete: 'Abgeschlossen',
      },
      daily: {
        label: 'Heute',
        sessions: 'Sitzungen',
        hours: 'Gesamtstunden',
      },
      weekly: {
        label: 'Diese Woche',
        sessions: 'Sitzungen',
        hours: 'Gesamtstunden',
      },
      streak: {
        label: 'Aktuelle Serie',
        days: 'Aufeinanderfolgende Tage',
      },
      insights: {
        label: 'Einblicke & Tipps',
        fastingTip: 'Bleiben Sie während Ihres Fastenfensters hydratisiert. Wasser, schwarzer Kaffee und ungesüßter Tee sind ausgezeichnete Optionen zur Aufrechterhaltung der Hydratation und Unterstützung der Autophagie.',
        eatingTip: 'Konzentrieren Sie sich während Ihres Essensfensters auf nährstoffreiche Vollwertkost. Priorisieren Sie Protein, gesunde Fette und ballaststoffreiches Gemüse für optimale Sättigung und Stoffwechselgesundheit.',
      },
    },
  },
};
