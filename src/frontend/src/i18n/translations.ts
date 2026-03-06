export type Language = "en" | "de";

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
    diary: {
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
  paymentGate: {
    title: string;
    subtitle: string;
    feeLabel: string;
    feeDescription: string;
    addressLabel: string;
    loadingAddress: string;
    addressError: string;
    addressNotSet: string;
    copyButton: string;
    copySuccess: string;
    instructionsTitle: string;
    step1: string;
    step2: string;
    step3: string;
    checkPaymentButton: string;
    checkPaymentChecking: string;
    checkPaymentSuccess: string;
    checkPaymentError: string;
    pollingMessage: string;
    pollingChecking: string;
    autoVerifyNote: string;
    /** @deprecated kept for backwards compat */
    manualConfirmNote: string;
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
    water: {
      label: string;
      goal: string;
      unit: string;
      progress: string;
    };
    actions: {
      save: string;
      saving: string;
      saveSuccess: string;
      saveError: string;
    };
  };
  sleepPanel: {
    title: string;
    subtitle: string;
    authRequired: string;
    duration: {
      label: string;
      unit: string;
      recommended: string;
      progress: string;
    };
    quality: {
      label: string;
      scale: string;
      poor: string;
      fair: string;
      good: string;
      veryGood: string;
      excellent: string;
    };
    actions: {
      save: string;
      saving: string;
      saveSuccess: string;
      saveError: string;
    };
  };
  movementPanel: {
    title: string;
    subtitle: string;
    authRequired: string;
    activeMinutes: {
      label: string;
      description: string;
    };
    activityType: {
      label: string;
    };
    activityTypes: {
      walk: string;
      run: string;
      bike: string;
      gym: string;
    };
    intensity: {
      label: string;
    };
    intensityLevels: {
      light: string;
      medium: string;
      intense: string;
    };
    actions: {
      save: string;
      saving: string;
      saveSuccess: string;
      saveError: string;
    };
  };
  stressPanel: {
    title: string;
    subtitle: string;
    authRequired: string;
    bloodPressure: {
      label: string;
      systolic: string;
      diastolic: string;
    };
    pulse: {
      label: string;
      description: string;
    };
    actions: {
      save: string;
      saving: string;
      saveSuccess: string;
      saveError: string;
    };
  };
  diary: {
    title: string;
    subtitle: string;
    addButton: string;
    editButton: string;
    deleteButton: string;
    confirmDelete: string;
    confirmDeleteYes: string;
    confirmDeleteNo: string;
    titleLabel: string;
    contentLabel: string;
    titlePlaceholder: string;
    contentPlaceholder: string;
    saveButton: string;
    savingButton: string;
    emptyState: string;
    loadingError: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: "LivSpan",
      subtitle: "LONGEVITY DASHBOARD",
    },
    intro: {
      heading: "Your Health Genome",
      description:
        "Monitor the five fundamental factors that influence longevity and well-being. Each element connects to form your unique health profile.",
    },
    factors: {
      nutrition: {
        label: "Nutrition",
        description: "Track your daily nutritional intake and balance",
      },
      sleep: {
        label: "Sleep",
        description: "Monitor your sleep quality and duration",
      },
      movement: {
        label: "Movement",
        description: "Track your physical activity and exercise",
      },
      stress: {
        label: "Stress",
        description: "Manage stress levels and mental well-being",
      },
      fasting: {
        label: "Fasting",
        description: "Monitor your intermittent fasting schedule",
      },
      diary: {
        label: "Diary",
        description: "Write and manage your personal journal entries",
      },
    },
    footer: {
      builtWith: "Built with love using",
      copyright: "All rights reserved",
    },
    languageSwitcher: {
      label: "Switch language",
    },
    auth: {
      login: "Login",
      logout: "Logout",
      loggingIn: "Logging in...",
    },
    profile: {
      loginRequired: {
        title: "Welcome to LivSpan",
        description:
          "Please log in to access your personalized longevity dashboard and track your health data.",
      },
      setup: {
        title: "Complete Your Profile",
        description:
          "Tell us a bit about yourself to personalize your health tracking experience.",
      },
      fields: {
        name: "Name",
        birthYear: "Birth Year",
        heightCm: "Height (cm)",
        gender: "Gender",
      },
      placeholders: {
        name: "Enter your name",
        birthYear: "1990",
        heightCm: "170",
      },
      genderOptions: {
        male: "Male",
        female: "Female",
        diverse: "Diverse",
      },
      validation: {
        nameRequired: "Name is required",
        birthYearInvalid: "Please enter a valid birth year (1900-present)",
        heightInvalid: "Please enter a valid height (50-300 cm)",
      },
      actions: {
        save: "Save Profile",
        saving: "Saving...",
      },
    },
    paymentGate: {
      title: "Access LivSpan",
      subtitle:
        "A one-time fee of 1 ICP is required to unlock full access to your longevity dashboard.",
      feeLabel: "One-Time Access Fee: 1 ICP",
      feeDescription:
        "Pay once, access forever. Your data stays private on the Internet Computer.",
      addressLabel: "Send 1 ICP to this address:",
      loadingAddress: "Loading payment address…",
      addressError:
        "Could not load the payment address. Please try again later.",
      addressNotSet:
        "Payment address not yet configured. Please contact support.",
      copyButton: "Copy address",
      copySuccess: "✓ Address copied to clipboard!",
      instructionsTitle: "How to unlock access:",
      step1: "Copy the ICP account address above.",
      step2: "Send exactly 1 ICP from your wallet (e.g. NNS, Plug, or Stoic).",
      step3:
        "Your access will be unlocked automatically once the payment is detected — no action needed.",
      checkPaymentButton: "Check Payment Now",
      checkPaymentChecking: "Checking payment…",
      checkPaymentSuccess: "✓ Payment confirmed! Your access is now unlocked.",
      checkPaymentError:
        "No payment found yet — please wait a moment and try again.",
      pollingMessage:
        "Waiting for payment… Checking automatically every 12 seconds.",
      pollingChecking: "Checking for payment on the ICP Ledger…",
      autoVerifyNote:
        "Payments are verified automatically on the ICP Ledger. This page will unlock instantly once your 1 ICP transfer is confirmed.",
      manualConfirmNote:
        "Payments are verified automatically on the ICP Ledger.",
    },
    fastingSchedule: {
      title: "Fasting Schedule",
      description: "Customize your daily fasting window",
      current: {
        label: "Current Schedule",
        protocol: "Protocol",
      },
      fields: {
        startHour: "Fasting Start",
        endHour: "Fasting End",
      },
      help: {
        crossMidnight:
          "Your fasting window can cross midnight (e.g., 20:00 to 12:00 next day).",
        protocol: "Protocol",
      },
      actions: {
        edit: "Edit Schedule",
        save: "Save",
        saving: "Saving...",
        cancel: "Cancel",
      },
    },
    fastingPanel: {
      title: "Intermittent Fasting",
      subtitle: "16:8 PROTOCOL",
      status: {
        label: "Current Status",
        fasting: "Fasting",
        eating: "Eating Window",
        fastingDesc: "Your body is in fat-burning mode",
        eatingDesc: "Time to nourish your body",
      },
      timer: {
        elapsed: "Time Elapsed",
        remaining: "Time Remaining",
        elapsedDesc: "in current phase",
        remainingDesc: "until phase ends",
      },
      progress: {
        label: "Phase Progress",
        complete: "Complete",
      },
      daily: {
        label: "Today",
        sessions: "Sessions",
        hours: "Hours",
      },
      weekly: {
        label: "This Week",
        sessions: "Sessions",
        hours: "Hours",
      },
      streak: {
        label: "Current Streak",
        days: "Days",
      },
      insights: {
        label: "Insights",
        fastingTip:
          "Stay hydrated during your fasting window. Water, black coffee, and unsweetened tea are allowed.",
        eatingTip:
          "Focus on nutrient-dense whole foods. Prioritize protein and vegetables for optimal health.",
      },
    },
    nutritionPanel: {
      title: "Nutrition",
      subtitle: "NATURELL PROTOCOL",
      authRequired: "Please log in to track your daily nutrition.",
      fastingPhase: {
        label: "Fasting Phase",
        fasting: "Fasting",
        eating: "Eating Window",
        fastingTip:
          "Stay hydrated during your fasting window. Water, black coffee, and unsweetened tea are allowed.",
        eatingTip:
          "Focus on protein and vegetables. Aim for 1.8g protein per kg body weight and 400g vegetables daily.",
      },
      weight: {
        label: "Body Weight",
        unit: "Weight (kg)",
      },
      bmi: {
        label: "Body Mass Index",
        unit: "BMI",
        heightMissing:
          "Please complete your profile with height to calculate BMI.",
      },
      protein: {
        label: "Protein Intake",
        target: "Daily Target (1.8 g/kg)",
        targetUnavailable: "Enter weight to see target",
        consumed: "Consumed",
        progress: "Progress",
        targetReached: "✓ Daily protein target reached!",
        remaining: "{amount} g remaining to reach target",
      },
      vegetables: {
        label: "Vegetables & Fruit",
        goal: "Daily Goal",
        consumed: "Consumed",
        progress: "Progress",
        goalReached: "✓ Daily vegetable goal reached!",
        remaining: "{amount} g remaining to reach goal",
      },
      water: {
        label: "Water Intake",
        goal: "Goal: 2.5 L",
        unit: "L",
        progress: "Progress",
      },
      actions: {
        save: "Save Today's Nutrition",
        saving: "Saving...",
        saveSuccess: "Nutrition data saved successfully",
        saveError: "Failed to save nutrition data",
      },
    },
    sleepPanel: {
      title: "Sleep",
      subtitle: "SLEEP TRACKING",
      authRequired: "Please log in to track your daily sleep.",
      duration: {
        label: "Sleep Duration",
        unit: "h",
        recommended: "Recommended: 8 h",
        progress: "of daily goal",
      },
      quality: {
        label: "Sleep Quality",
        scale: "Scale",
        poor: "Poor",
        fair: "Fair",
        good: "Good",
        veryGood: "Very Good",
        excellent: "Excellent",
      },
      actions: {
        save: "Save Today's Sleep",
        saving: "Saving...",
        saveSuccess: "Sleep data saved successfully",
        saveError: "Failed to save sleep data",
      },
    },
    movementPanel: {
      title: "Movement",
      subtitle: "ACTIVITY TRACKING",
      authRequired: "Please log in to track your daily movement.",
      activeMinutes: {
        label: "Active Minutes",
        description: "Minutes of sport / exercise today (0–300)",
      },
      activityType: {
        label: "Activity Type",
      },
      activityTypes: {
        walk: "Walk",
        run: "Run",
        bike: "Bike",
        gym: "Gym",
      },
      intensity: {
        label: "Intensity",
      },
      intensityLevels: {
        light: "Light",
        medium: "Medium",
        intense: "Intense",
      },
      actions: {
        save: "Save Today's Movement",
        saving: "Saving...",
        saveSuccess: "Movement data saved successfully",
        saveError: "Failed to save movement data",
      },
    },
    stressPanel: {
      title: "Stress & Vitals",
      subtitle: "BLOOD PRESSURE & PULSE",
      authRequired: "Please log in to track your daily vitals.",
      bloodPressure: {
        label: "Blood Pressure",
        systolic: "Systolic",
        diastolic: "Diastolic",
      },
      pulse: {
        label: "Pulse",
        description: "Heart rate (bpm)",
      },
      actions: {
        save: "Save Today's Vitals",
        saving: "Saving...",
        saveSuccess: "Vitals saved successfully",
        saveError: "Failed to save vitals",
      },
    },
    diary: {
      title: "Diary",
      subtitle: "PERSONAL JOURNAL",
      addButton: "New Entry",
      editButton: "Edit",
      deleteButton: "Delete",
      confirmDelete: "Delete this entry?",
      confirmDeleteYes: "Delete",
      confirmDeleteNo: "Cancel",
      titleLabel: "Title",
      contentLabel: "Content",
      titlePlaceholder: "Entry title...",
      contentPlaceholder: "Write your thoughts...",
      saveButton: "Save",
      savingButton: "Saving...",
      emptyState: "No diary entries yet. Write your first entry.",
      loadingError: "Could not load diary entries.",
    },
  },
  de: {
    header: {
      title: "LivSpan",
      subtitle: "LONGEVITY DASHBOARD",
    },
    intro: {
      heading: "Dein Gesundheits-Genom",
      description:
        "Überwache die fünf grundlegenden Faktoren, die Langlebigkeit und Wohlbefinden beeinflussen. Jedes Element verbindet sich zu deinem einzigartigen Gesundheitsprofil.",
    },
    factors: {
      nutrition: {
        label: "Ernährung",
        description: "Verfolge deine tägliche Nährstoffaufnahme und Balance",
      },
      sleep: {
        label: "Schlaf",
        description: "Überwache deine Schlafqualität und -dauer",
      },
      movement: {
        label: "Bewegung",
        description: "Verfolge deine körperliche Aktivität und Sport",
      },
      stress: {
        label: "Stress",
        description: "Verwalte Stresslevel und mentales Wohlbefinden",
      },
      fasting: {
        label: "Fasten",
        description: "Überwache deinen intermittierenden Fastenplan",
      },
      diary: {
        label: "Tagebuch",
        description:
          "Schreibe und verwalte deine persönlichen Tagebucheinträge",
      },
    },
    footer: {
      builtWith: "Mit Liebe gebaut mit",
      copyright: "Alle Rechte vorbehalten",
    },
    languageSwitcher: {
      label: "Sprache wechseln",
    },
    auth: {
      login: "Anmelden",
      logout: "Abmelden",
      loggingIn: "Anmeldung läuft...",
    },
    profile: {
      loginRequired: {
        title: "Willkommen bei LivSpan",
        description:
          "Bitte melde dich an, um auf dein personalisiertes Longevity-Dashboard zuzugreifen und deine Gesundheitsdaten zu verfolgen.",
      },
      setup: {
        title: "Profil vervollständigen",
        description:
          "Erzähl uns etwas über dich, um dein Gesundheits-Tracking zu personalisieren.",
      },
      fields: {
        name: "Name",
        birthYear: "Geburtsjahr",
        heightCm: "Größe (cm)",
        gender: "Geschlecht",
      },
      placeholders: {
        name: "Deinen Namen eingeben",
        birthYear: "1990",
        heightCm: "170",
      },
      genderOptions: {
        male: "Männlich",
        female: "Weiblich",
        diverse: "Divers",
      },
      validation: {
        nameRequired: "Name ist erforderlich",
        birthYearInvalid: "Bitte gib ein gültiges Geburtsjahr ein (1900-heute)",
        heightInvalid: "Bitte gib eine gültige Größe ein (50-300 cm)",
      },
      actions: {
        save: "Profil speichern",
        saving: "Speichern…",
      },
    },
    paymentGate: {
      title: "LivSpan freischalten",
      subtitle:
        "Eine einmalige Gebühr von 1 ICP ist erforderlich, um vollen Zugang zu deinem Longevity-Dashboard zu erhalten.",
      feeLabel: "Einmalige Zuganggebühr: 1 ICP",
      feeDescription:
        "Einmal zahlen, dauerhaft nutzen. Deine Daten bleiben privat auf dem Internet Computer.",
      addressLabel: "1 ICP an diese Adresse senden:",
      loadingAddress: "Zahlungsadresse wird geladen…",
      addressError:
        "Zahlungsadresse konnte nicht geladen werden. Bitte später erneut versuchen.",
      addressNotSet:
        "Zahlungsadresse noch nicht konfiguriert. Bitte Support kontaktieren.",
      copyButton: "Adresse kopieren",
      copySuccess: "✓ Adresse in die Zwischenablage kopiert!",
      instructionsTitle: "So schaltest du den Zugang frei:",
      step1: "Kopiere die ICP-Kontoadresse oben.",
      step2:
        "Sende genau 1 ICP von deiner Wallet (z. B. NNS, Plug oder Stoic).",
      step3:
        "Dein Zugang wird automatisch freigeschaltet, sobald die Zahlung erkannt wird — kein weiterer Schritt nötig.",
      checkPaymentButton: "Zahlung jetzt prüfen",
      checkPaymentChecking: "Zahlung wird geprüft…",
      checkPaymentSuccess:
        "✓ Zahlung bestätigt! Dein Zugang ist jetzt freigeschaltet.",
      checkPaymentError:
        "Noch keine Zahlung gefunden — bitte kurz warten und erneut versuchen.",
      pollingMessage:
        "Warte auf Zahlung… Automatische Prüfung alle 12 Sekunden.",
      pollingChecking: "Prüfe Zahlung im ICP Ledger…",
      autoVerifyNote:
        "Zahlungen werden automatisch im ICP Ledger verifiziert. Diese Seite schaltet sich sofort frei, sobald deine 1-ICP-Überweisung bestätigt ist.",
      manualConfirmNote:
        "Zahlungen werden automatisch im ICP Ledger verifiziert.",
    },
    fastingSchedule: {
      title: "Fastenplan",
      description: "Passe dein tägliches Fastenfenster an",
      current: {
        label: "Aktueller Plan",
        protocol: "Protokoll",
      },
      fields: {
        startHour: "Fastenstart",
        endHour: "Fastenende",
      },
      help: {
        crossMidnight:
          "Dein Fastenfenster kann Mitternacht überschreiten (z. B. 20:00 bis 12:00 am nächsten Tag).",
        protocol: "Protokoll",
      },
      actions: {
        edit: "Plan bearbeiten",
        save: "Speichern",
        saving: "Speichern…",
        cancel: "Abbrechen",
      },
    },
    fastingPanel: {
      title: "Intermittierendes Fasten",
      subtitle: "16:8 PROTOKOLL",
      status: {
        label: "Aktueller Status",
        fasting: "Fasten",
        eating: "Essensfenster",
        fastingDesc: "Dein Körper ist im Fettverbrennungsmodus",
        eatingDesc: "Zeit, deinen Körper zu nähren",
      },
      timer: {
        elapsed: "Vergangene Zeit",
        remaining: "Verbleibende Zeit",
        elapsedDesc: "in der aktuellen Phase",
        remainingDesc: "bis zum Phasenende",
      },
      progress: {
        label: "Phasenfortschritt",
        complete: "Abgeschlossen",
      },
      daily: {
        label: "Heute",
        sessions: "Sitzungen",
        hours: "Stunden",
      },
      weekly: {
        label: "Diese Woche",
        sessions: "Sitzungen",
        hours: "Stunden",
      },
      streak: {
        label: "Aktuelle Serie",
        days: "Tage",
      },
      insights: {
        label: "Erkenntnisse",
        fastingTip:
          "Bleib während deines Fastenfensters hydratisiert. Wasser, schwarzer Kaffee und ungesüßter Tee sind erlaubt.",
        eatingTip:
          "Konzentriere dich auf nährstoffreiche Vollwertkost. Priorisiere Protein und Gemüse für optimale Gesundheit.",
      },
    },
    nutritionPanel: {
      title: "Ernährung",
      subtitle: "NATURELL PROTOKOLL",
      authRequired:
        "Bitte melde dich an, um deine tägliche Ernährung zu verfolgen.",
      fastingPhase: {
        label: "Fastenphase",
        fasting: "Fasten",
        eating: "Essensfenster",
        fastingTip:
          "Bleib während deines Fastenfensters hydratisiert. Wasser, schwarzer Kaffee und ungesüßter Tee sind erlaubt.",
        eatingTip:
          "Konzentriere dich auf Protein und Gemüse. Strebe 1,8 g Protein pro kg Körpergewicht und 400 g Gemüse täglich an.",
      },
      weight: {
        label: "Körpergewicht",
        unit: "Gewicht (kg)",
      },
      bmi: {
        label: "Body-Mass-Index",
        unit: "BMI",
        heightMissing:
          "Bitte vervollständige dein Profil mit deiner Größe, um den BMI zu berechnen.",
      },
      protein: {
        label: "Proteinaufnahme",
        target: "Tagesziel (1,8 g/kg)",
        targetUnavailable: "Gewicht eingeben, um Ziel zu sehen",
        consumed: "Aufgenommen",
        progress: "Fortschritt",
        targetReached: "✓ Tägliches Proteinziel erreicht!",
        remaining: "{amount} g verbleibend bis zum Ziel",
      },
      vegetables: {
        label: "Gemüse & Obst",
        goal: "Tagesziel",
        consumed: "Aufgenommen",
        progress: "Fortschritt",
        goalReached: "✓ Tägliches Gemüseziel erreicht!",
        remaining: "{amount} g verbleibend bis zum Ziel",
      },
      water: {
        label: "Wasseraufnahme",
        goal: "Ziel: 2,5 L",
        unit: "L",
        progress: "Fortschritt",
      },
      actions: {
        save: "Heutige Ernährung speichern",
        saving: "Speichern…",
        saveSuccess: "Ernährungsdaten erfolgreich gespeichert",
        saveError: "Fehler beim Speichern der Ernährungsdaten",
      },
    },
    sleepPanel: {
      title: "Schlaf",
      subtitle: "SCHLAF-TRACKING",
      authRequired:
        "Bitte melde dich an, um deinen täglichen Schlaf zu verfolgen.",
      duration: {
        label: "Schlafdauer",
        unit: "h",
        recommended: "Empfohlen: 8 h",
        progress: "des Tagesziels",
      },
      quality: {
        label: "Schlafqualität",
        scale: "Skala",
        poor: "Schlecht",
        fair: "Mäßig",
        good: "Gut",
        veryGood: "Sehr gut",
        excellent: "Ausgezeichnet",
      },
      actions: {
        save: "Heutigen Schlaf speichern",
        saving: "Speichern…",
        saveSuccess: "Schlafdaten erfolgreich gespeichert",
        saveError: "Fehler beim Speichern der Schlafdaten",
      },
    },
    movementPanel: {
      title: "Bewegung",
      subtitle: "AKTIVITÄTS-TRACKING",
      authRequired:
        "Bitte melde dich an, um deine tägliche Bewegung zu verfolgen.",
      activeMinutes: {
        label: "Aktive Minuten",
        description: "Minuten Sport / Bewegung heute (0–300)",
      },
      activityType: {
        label: "Aktivitätstyp",
      },
      activityTypes: {
        walk: "Gehen",
        run: "Laufen",
        bike: "Radfahren",
        gym: "Fitnessstudio",
      },
      intensity: {
        label: "Intensität",
      },
      intensityLevels: {
        light: "Leicht",
        medium: "Mittel",
        intense: "Intensiv",
      },
      actions: {
        save: "Heutige Bewegung speichern",
        saving: "Speichern…",
        saveSuccess: "Bewegungsdaten erfolgreich gespeichert",
        saveError: "Fehler beim Speichern der Bewegungsdaten",
      },
    },
    stressPanel: {
      title: "Stress & Vitalwerte",
      subtitle: "BLUTDRUCK & PULS",
      authRequired:
        "Bitte melde dich an, um deine täglichen Vitalwerte zu verfolgen.",
      bloodPressure: {
        label: "Blutdruck",
        systolic: "Systolisch",
        diastolic: "Diastolisch",
      },
      pulse: {
        label: "Puls",
        description: "Herzfrequenz (bpm)",
      },
      actions: {
        save: "Heutige Vitalwerte speichern",
        saving: "Speichern…",
        saveSuccess: "Vitalwerte erfolgreich gespeichert",
        saveError: "Fehler beim Speichern der Vitalwerte",
      },
    },
    diary: {
      title: "Tagebuch",
      subtitle: "PERSÖNLICHES JOURNAL",
      addButton: "Neuer Eintrag",
      editButton: "Bearbeiten",
      deleteButton: "Löschen",
      confirmDelete: "Diesen Eintrag löschen?",
      confirmDeleteYes: "Löschen",
      confirmDeleteNo: "Abbrechen",
      titleLabel: "Titel",
      contentLabel: "Inhalt",
      titlePlaceholder: "Eintragstitel...",
      contentPlaceholder: "Deine Gedanken...",
      saveButton: "Speichern",
      savingButton: "Speichern...",
      emptyState:
        "Noch keine Tagebucheinträge. Schreibe deinen ersten Eintrag.",
      loadingError: "Tagebucheinträge konnten nicht geladen werden.",
    },
  },
};
