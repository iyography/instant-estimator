// Dashboard translations for all dashboard pages
export const dashboardTranslations = {
  en: {
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      back: 'Back',
      next: 'Next',
      loading: 'Loading...',
      noResults: 'No results found',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      copy: 'Copy',
      copied: 'Copied!',
      required: 'Required',
      optional: 'Optional',
      or: 'or',
      open: 'Open',
    },

    // Navigation
    nav: {
      overview: 'Overview',
      services: 'Services',
      estimators: 'Estimators',
      leads: 'Leads',
      forms: 'Forms',
      settings: 'Settings',
      logout: 'Log out',
    },

    // Lead statuses
    status: {
      new: 'New',
      contacted: 'Contacted',
      quoted: 'Quoted',
      won: 'Won',
      lost: 'Lost',
      all: 'All statuses',
    },

    // Lead value tiers
    leadValue: {
      low: 'Low Value',
      medium: 'Medium Value',
      high: 'High Value',
    },

    // Overview page
    overview: {
      welcome: 'Welcome',
      subtitle: "Here's an overview of your business",
      totalLeads: 'Total Leads',
      newLeads: 'New Leads',
      conversionRate: 'Conversion Rate',
      estimatedRevenue: 'Estimated Revenue',
      recentLeads: 'Recent Leads',
      viewAll: 'View all',
      noLeadsYet: 'No leads yet',
      shareEstimator: 'Share your estimator to start collecting leads',
      quickActions: 'Quick Actions',
      createEstimator: 'Create new estimator',
      manageForms: 'Manage forms',
      viewLeads: 'View all leads',
      embedCode: 'Embed Code',
      embedDescription: 'Copy this code to add the estimator to your website',
      copyCode: 'Copy code',
    },

    // Leads page
    leads: {
      title: 'Leads',
      totalLeads: '{count} leads total',
      exportCSV: 'Export CSV',
      searchPlaceholder: 'Search by name or email...',
      allStatuses: 'All statuses',
      allServices: 'All services',
      noLeadsFound: 'No leads found',
      table: {
        customer: 'Customer',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        service: 'Service',
        value: 'Value',
        estimate: 'Estimate',
        estimateLow: 'Estimate (Low)',
        estimateHigh: 'Estimate (High)',
        status: 'Status',
        date: 'Date',
      },
    },

    // Onboarding page
    onboarding: {
      welcome: 'Welcome to Instant Estimator',
      subtitle: "Let's set up your first estimator in just a few minutes",
      next: 'Next',
      back: 'Back',
      steps: {
        company: 'Company',
        settings: 'Settings',
        services: 'Services',
        jobType: 'Job Type',
        done: 'Done',
      },
      companyInfo: {
        title: 'Company Information',
        description: 'Tell us a bit about your company',
        companyName: 'Company Name',
        companyNamePlaceholder: 'e.g. Anderson Electric LLC',
        industry: 'Industry',
        email: 'Email',
        phone: 'Phone',
      },
      languageCurrency: {
        title: 'Language & Currency',
        description: 'Choose default settings for your estimator',
        defaultLanguage: 'Default Language',
        defaultCurrency: 'Default Currency',
      },
      services: {
        title: 'Services',
        description: 'Select the services that you offer',
        suggestedFor: 'Suggested services for {industry}',
        selectMultiple: 'You can select multiple services',
        selectedCount: '{count} service(s) selected',
        setUpLater: 'Set up later',
      },
      jobType: {
        title: 'Create your first job type',
        description: 'Choose a suggested job type or create your own',
        suggestedFor: 'Suggested job types for {industry}',
        or: 'or',
        customJobType: 'Custom job type',
        customJobTypePlaceholder: 'e.g. Garage Door Installation',
        basePrice: 'Base Price ({currency})',
        basePriceHelp: 'Starting price before any modifiers',
        createWithAI: 'Create with AI',
        creating: 'Creating...',
      },
      done: {
        title: 'Your estimator is ready!',
        description: 'You can now start collecting leads from your website',
        publicLink: 'Public Link',
        embedCode: 'Embed Code',
        copyCode: 'Copy code',
        goToDashboard: 'Go to dashboard',
      },
      errors: {
        createFailed: 'Could not create company. Please try again.',
      },
    },

    // Settings page
    settings: {
      title: 'Settings',
      subtitle: 'Manage your company and estimator settings',
      saveSettings: 'Save settings',
      messages: {
        saved: 'Settings saved!',
        error: 'Failed to save. Please try again.',
        copied: 'Code copied!',
      },
      companyProfile: {
        title: 'Company Profile',
        description: 'Basic information about your company',
        companyName: 'Company Name',
        industry: 'Industry',
        email: 'Email',
        phone: 'Phone',
        website: 'Website',
      },
      languageCurrency: {
        title: 'Language & Currency',
        description: 'Default settings for your estimator',
        defaultLanguage: 'Default Language',
        defaultCurrency: 'Default Currency',
      },
      estimatorSettings: {
        title: 'Estimator Settings',
        description: 'Customize how price estimates are calculated',
        rangeLow: 'Price Range Low (%)',
        rangeLowHelp: 'e.g. 10% below final price',
        rangeHigh: 'Price Range High (%)',
        rangeHighHelp: 'e.g. 15% above final price',
        widgetColor: 'Widget Primary Color',
      },
      notifications: {
        title: 'Notifications',
        description: 'Email notification settings',
        notificationEmail: 'Notification Email',
        notificationEmailHelp: 'Leave empty to use company email',
      },
      embedCode: {
        title: 'Embed Code',
        description: 'Add the estimator to your website',
        publicLink: 'Public Link',
        jsCode: 'JavaScript Code',
        copyCode: 'Copy code',
        allowedDomains: 'Allowed Domains (one per line)',
        allowedDomainsHelp: 'Leave empty to allow all domains',
      },
      industries: {
        electrician: 'Electrician',
        plumber: 'Plumber',
        hvac: 'HVAC',
        general_contractor: 'General Contractor',
        painter: 'Painter',
        landscaper: 'Landscaper',
        roofing: 'Roofing',
        cleaning: 'Cleaning',
        other: 'Other',
      },
      currencies: {
        SEK: 'Swedish Krona (SEK)',
        EUR: 'Euro (EUR)',
        USD: 'US Dollar (USD)',
      },
      languages: {
        en: 'English',
        sv: 'Svenska',
      },
    },

    // Estimator flow (customer facing)
    estimator: {
      step: 'Step {current} of {total}',
      estimate: 'Estimate',
      selectService: 'What service do you need?',
      enterNumber: 'Enter a number',
      enterAnswer: 'Enter your answer',
      yourEstimate: 'Your price estimate',
      disclaimer: 'Final price may vary depending on on-site conditions.',
      contactInfo: 'Your contact information',
      yourName: 'Your name',
      namePlaceholder: 'John Smith',
      emailAddress: 'Email address',
      emailPlaceholder: 'john@example.com',
      phoneNumber: 'Phone number',
      phonePlaceholder: '+1 555 123 4567',
      address: 'Address (optional)',
      addressPlaceholder: '123 Main St, City, State 12345',
      back: 'Back',
      next: 'Next',
      getEstimate: 'Get my estimate',
      submitting: 'Submitting...',
      thankYou: 'Thank you!',
      received: 'We have received your request. A contractor will contact you shortly.',
      yourPriceEstimate: 'Your price estimate',
      submitFailed: 'Could not submit. Please try again.',
    },

    // Kanban board
    kanban: {
      columns: {
        new: 'New',
        contacted: 'Contacted',
        quoted: 'Quoted',
        won: 'Won',
        lost: 'Lost',
      },
      moreLeads: '+{count} more in list view',
    },

    // Lead detail page
    leadDetail: {
      contactInfo: 'Contact Information',
      statusEstimate: 'Status & Estimate',
      priceEstimate: 'Price Estimate',
      created: 'Created',
      source: 'Source',
      responses: 'Responses',
      notes: 'Notes',
      notesPlaceholder: 'Add notes about this lead...',
    },

    // Forms
    forms: {
      title: 'Services',
      subtitle: 'Manage your services and questions',
      createNew: 'Create new form',
      noForms: 'No forms yet',
      createFirst: 'Create your first estimator form',
      newService: 'New service',
      noServices: 'No services yet',
      createFirstService: 'Create your first service to get started',
      createService: 'Create service',
      basePrice: 'Base price',
      active: 'Active',
      inactive: 'Inactive',
      editQuestions: 'Edit questions',
      estimatorForms: 'Estimator Forms',
      customFormsDescription: 'Custom forms for different purposes',
      newForm: 'New form',
      defaultFormDescription: 'Your default form uses all active job types.',
      publicLink: 'Public Link',
      copyEmbedCode: 'Copy embed code',
      copyCode: 'Copy code',
      confirmDelete: 'Are you sure you want to delete this job type?',
      formBuilder: {
        title: 'Form Builder',
        addQuestion: 'Add Question',
        aiSuggestions: 'Get AI Suggestions',
        questionText: 'Question Text',
        questionType: 'Question Type',
        required: 'Required',
        answers: 'Answer Options',
        addAnswer: 'Add Answer',
        answerText: 'Answer Text',
        priceModifier: 'Price Modifier',
        modifierValue: 'Modifier Value',
        deleteQuestion: 'Delete Question',
        saveForm: 'Save Form',
      },
    },
  },

  sv: {
    // Common
    common: {
      save: 'Spara',
      cancel: 'Avbryt',
      delete: 'Radera',
      edit: 'Redigera',
      create: 'Skapa',
      back: 'Tillbaka',
      next: 'Nasta',
      loading: 'Laddar...',
      noResults: 'Inga resultat hittades',
      search: 'Sok',
      filter: 'Filtrera',
      export: 'Exportera',
      copy: 'Kopiera',
      copied: 'Kopierat!',
      required: 'Obligatorisk',
      optional: 'Valfritt',
      or: 'eller',
      open: 'Oppna',
    },

    // Navigation
    nav: {
      overview: 'Oversikt',
      services: 'Tjanster',
      estimators: 'Estimatorer',
      leads: 'Leads',
      forms: 'Formular',
      settings: 'Installningar',
      logout: 'Logga ut',
    },

    // Lead statuses
    status: {
      new: 'Ny',
      contacted: 'Kontaktad',
      quoted: 'Offert',
      won: 'Vunnen',
      lost: 'Forlorad',
      all: 'Alla statusar',
    },

    // Lead value tiers
    leadValue: {
      low: 'Lagt Varde',
      medium: 'Medel Varde',
      high: 'Hogt Varde',
    },

    // Overview page
    overview: {
      welcome: 'Valkommen',
      subtitle: 'Har ar en oversikt av din verksamhet',
      totalLeads: 'Totala leads',
      newLeads: 'Nya leads',
      conversionRate: 'Konverteringsgrad',
      estimatedRevenue: 'Beraknad intakt',
      recentLeads: 'Senaste leads',
      viewAll: 'Visa alla',
      noLeadsYet: 'Inga leads annu',
      shareEstimator: 'Dela din estimator for att borja samla leads',
      quickActions: 'Snabbatgarder',
      createEstimator: 'Skapa ny estimator',
      manageForms: 'Hantera formular',
      viewLeads: 'Visa alla leads',
      embedCode: 'Inbaddningskod',
      embedDescription: 'Kopiera denna kod for att lagga till estimatorn pa din hemsida',
      copyCode: 'Kopiera kod',
    },

    // Leads page
    leads: {
      title: 'Leads',
      totalLeads: '{count} leads totalt',
      exportCSV: 'Exportera CSV',
      searchPlaceholder: 'Sok pa namn eller e-post...',
      allStatuses: 'Alla statusar',
      allServices: 'Alla tjanster',
      noLeadsFound: 'Inga leads hittades',
      table: {
        customer: 'Kund',
        email: 'E-post',
        phone: 'Telefon',
        address: 'Adress',
        service: 'Tjanst',
        value: 'Varde',
        estimate: 'Uppskattning',
        estimateLow: 'Uppskattning (lagt)',
        estimateHigh: 'Uppskattning (hogt)',
        status: 'Status',
        date: 'Datum',
      },
    },

    // Onboarding page
    onboarding: {
      welcome: 'Valkommen till Instant Estimator',
      subtitle: 'Lat oss satta upp din forsta estimator pa nagra minuter',
      next: 'Nasta',
      back: 'Tillbaka',
      steps: {
        company: 'Foretag',
        settings: 'Installningar',
        services: 'Tjanster',
        jobType: 'Jobbtyp',
        done: 'Klart',
      },
      companyInfo: {
        title: 'Foretagsinformation',
        description: 'Beratta lite om ditt foretag',
        companyName: 'Foretagsnamn',
        companyNamePlaceholder: 'T.ex. Anderssons El AB',
        industry: 'Bransch',
        email: 'E-post',
        phone: 'Telefon',
      },
      languageCurrency: {
        title: 'Sprak & Valuta',
        description: 'Valj standardinstallningar for din estimator',
        defaultLanguage: 'Standardsprak',
        defaultCurrency: 'Standardvaluta',
      },
      services: {
        title: 'Tjanster',
        description: 'Valj de tjanster du erbjuder',
        suggestedFor: 'Foreslagna tjanster for {industry}',
        selectMultiple: 'Du kan valja flera tjanster',
        selectedCount: '{count} tjanst(er) valda',
        setUpLater: 'Stall in senare',
      },
      jobType: {
        title: 'Skapa din forsta jobbtyp',
        description: 'Valj en foreslagen jobbtyp eller skapa en egen',
        suggestedFor: 'Foreslagna jobbtyper for {industry}',
        or: 'eller',
        customJobType: 'Anpassad jobbtyp',
        customJobTypePlaceholder: 'T.ex. Garageport Installation',
        basePrice: 'Baspris ({currency})',
        basePriceHelp: 'Startpris innan nagra modifieringar',
        createWithAI: 'Skapa med AI',
        creating: 'Skapar...',
      },
      done: {
        title: 'Din estimator ar klar!',
        description: 'Du kan nu borja samla leads fran din hemsida',
        publicLink: 'Publik lank',
        embedCode: 'Inbaddningskod',
        copyCode: 'Kopiera kod',
        goToDashboard: 'Ga till instrumentpanelen',
      },
      errors: {
        createFailed: 'Kunde inte skapa foretaget. Forsok igen.',
      },
    },

    // Settings page
    settings: {
      title: 'Installningar',
      subtitle: 'Hantera ditt foretag och estimatorinstallningar',
      saveSettings: 'Spara installningar',
      messages: {
        saved: 'Installningarna har sparats!',
        error: 'Kunde inte spara. Forsok igen.',
        copied: 'Koden har kopierats!',
      },
      companyProfile: {
        title: 'Foretagsprofil',
        description: 'Grundlaggande information om ditt foretag',
        companyName: 'Foretagsnamn',
        industry: 'Bransch',
        email: 'E-post',
        phone: 'Telefon',
        website: 'Hemsida',
      },
      languageCurrency: {
        title: 'Sprak & Valuta',
        description: 'Standardinstallningar for din estimator',
        defaultLanguage: 'Standardsprak',
        defaultCurrency: 'Standardvaluta',
      },
      estimatorSettings: {
        title: 'Estimatorinstallningar',
        description: 'Anpassa hur prisuppskattningar beraknas',
        rangeLow: 'Prisintervall lagt (%)',
        rangeLowHelp: 'T.ex. 10% under slutpriset',
        rangeHigh: 'Prisintervall hogt (%)',
        rangeHighHelp: 'T.ex. 15% over slutpriset',
        widgetColor: 'Widget primarfarg',
      },
      notifications: {
        title: 'Aviseringar',
        description: 'Installningar for e-postaviseringar',
        notificationEmail: 'Aviseringsmail',
        notificationEmailHelp: 'Lamna tomt for att anvanda foretagets e-post',
      },
      embedCode: {
        title: 'Inbaddningskod',
        description: 'Lagg till estimatorn pa din hemsida',
        publicLink: 'Publik lank',
        jsCode: 'JavaScript-kod',
        copyCode: 'Kopiera kod',
        allowedDomains: 'Tillatna domaner (en per rad)',
        allowedDomainsHelp: 'Lamna tomt for att tillata alla domaner',
      },
      industries: {
        electrician: 'Elektriker',
        plumber: 'Rormokare',
        hvac: 'VVS',
        general_contractor: 'Byggentreprenor',
        painter: 'Malare',
        landscaper: 'Tradgardsanlaggare',
        roofing: 'Taklaggare',
        cleaning: 'Stadning',
        other: 'Annat',
      },
      currencies: {
        SEK: 'Svenska kronor (SEK)',
        EUR: 'Euro (EUR)',
        USD: 'US Dollar (USD)',
      },
      languages: {
        en: 'English',
        sv: 'Svenska',
      },
    },

    // Estimator flow (customer facing)
    estimator: {
      step: 'Steg {current} av {total}',
      estimate: 'Uppskattning',
      selectService: 'Vilken tjanst behover du?',
      enterNumber: 'Ange ett tal',
      enterAnswer: 'Skriv ditt svar',
      yourEstimate: 'Din prisuppskattning',
      disclaimer: 'Slutpriset kan variera beroende pa forhallandena pa plats.',
      contactInfo: 'Din kontaktinformation',
      yourName: 'Ditt namn',
      namePlaceholder: 'Anna Andersson',
      emailAddress: 'E-postadress',
      emailPlaceholder: 'anna@example.com',
      phoneNumber: 'Telefonnummer',
      phonePlaceholder: '070-123 45 67',
      address: 'Adress (valfritt)',
      addressPlaceholder: 'Storgatan 1, 123 45 Stockholm',
      back: 'Tillbaka',
      next: 'Nasta',
      getEstimate: 'Fa min uppskattning',
      submitting: 'Skickar...',
      thankYou: 'Tack!',
      received: 'Vi har mottagit din forfragen. En entreprenor kommer att kontakta dig inom kort.',
      yourPriceEstimate: 'Din prisuppskattning',
      submitFailed: 'Kunde inte skicka. Forsok igen.',
    },

    // Kanban board
    kanban: {
      columns: {
        new: 'Ny',
        contacted: 'Kontaktad',
        quoted: 'Offert',
        won: 'Vunnen',
        lost: 'Forlorad',
      },
      moreLeads: '+{count} fler i listvyn',
    },

    // Lead detail page
    leadDetail: {
      contactInfo: 'Kontaktinformation',
      statusEstimate: 'Status & Uppskattning',
      priceEstimate: 'Prisuppskattning',
      created: 'Skapad',
      source: 'Kalla',
      responses: 'Svar',
      notes: 'Anteckningar',
      notesPlaceholder: 'Lagg till anteckningar om denna lead...',
    },

    // Forms
    forms: {
      title: 'Tjanster',
      subtitle: 'Hantera dina tjanster och fragor',
      createNew: 'Skapa nytt formular',
      noForms: 'Inga formular annu',
      createFirst: 'Skapa ditt forsta estimatorformular',
      newService: 'Ny tjanst',
      noServices: 'Inga tjanster annu',
      createFirstService: 'Skapa din forsta tjanst for att komma igang',
      createService: 'Skapa tjanst',
      basePrice: 'Baspris',
      active: 'Aktiv',
      inactive: 'Inaktiv',
      editQuestions: 'Redigera fragor',
      estimatorForms: 'Estimatorformular',
      customFormsDescription: 'Anpassade formular for olika andamal',
      newForm: 'Nytt formular',
      defaultFormDescription: 'Ditt standardformular anvander alla aktiva jobbtyper.',
      publicLink: 'Publik lank',
      copyEmbedCode: 'Kopiera inbaddningskod',
      copyCode: 'Kopiera kod',
      confirmDelete: 'Ar du saker pa att du vill ta bort denna jobbtyp?',
      formBuilder: {
        title: 'Formularbyggare',
        addQuestion: 'Lagg till fraga',
        aiSuggestions: 'Hamta AI-forslag',
        questionText: 'Fragetext',
        questionType: 'Fragetyp',
        required: 'Obligatorisk',
        answers: 'Svarsalternativ',
        addAnswer: 'Lagg till svar',
        answerText: 'Svarstext',
        priceModifier: 'Prismodifierare',
        modifierValue: 'Modifieringsvarde',
        deleteQuestion: 'Radera fraga',
        saveForm: 'Spara formular',
      },
    },
  },
};

export type DashboardLanguage = keyof typeof dashboardTranslations;

// Define the structure without literal types for cross-language compatibility
type TranslationsStructure = {
  common: { [key: string]: string };
  nav: { [key: string]: string };
  status: { [key: string]: string };
  leadValue: { [key: string]: string };
  overview: { [key: string]: string };
  leads: {
    title: string;
    totalLeads: string;
    exportCSV: string;
    searchPlaceholder: string;
    allStatuses: string;
    allServices: string;
    noLeadsFound: string;
    table: { [key: string]: string };
  };
  onboarding: {
    welcome: string;
    subtitle: string;
    next: string;
    back: string;
    steps: { [key: string]: string };
    companyInfo: { [key: string]: string };
    languageCurrency: { [key: string]: string };
    services?: { [key: string]: string };
    jobType: { [key: string]: string };
    done: { [key: string]: string };
    errors: { [key: string]: string };
  };
  settings: {
    title: string;
    subtitle: string;
    saveSettings: string;
    messages: { [key: string]: string };
    companyProfile: { [key: string]: string };
    languageCurrency: { [key: string]: string };
    estimatorSettings: { [key: string]: string };
    notifications: { [key: string]: string };
    embedCode: { [key: string]: string };
    industries: { [key: string]: string };
    currencies: { [key: string]: string };
    languages: { [key: string]: string };
  };
  estimator: { [key: string]: string };
  kanban: {
    columns: { [key: string]: string };
    moreLeads: string;
  };
  leadDetail: { [key: string]: string };
  forms: {
    title: string;
    subtitle: string;
    createNew: string;
    noForms: string;
    createFirst: string;
    newService: string;
    noServices: string;
    createFirstService: string;
    createService: string;
    basePrice: string;
    active: string;
    inactive: string;
    editQuestions: string;
    estimatorForms: string;
    customFormsDescription: string;
    newForm: string;
    defaultFormDescription: string;
    publicLink: string;
    copyEmbedCode: string;
    copyCode: string;
    confirmDelete: string;
    formBuilder: { [key: string]: string };
  };
};

export type DashboardTranslations = TranslationsStructure;
