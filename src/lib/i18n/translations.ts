export const translations = {
  en: {
    // Navigation
    nav: {
      features: 'Features',
      howItWorks: 'How it Works',
      pricing: 'Pricing',
      signIn: 'Sign In',
      getStarted: 'Get Started Free',
    },
    // Hero Section
    hero: {
      badge: 'Now with AI-powered questions',
      title1: 'Capture more leads with',
      title2: 'instant price estimates',
      subtitle: 'Let your customers get a price estimate instantly on your website. Save time, capture leads automatically, and stand out from the competition.',
      cta1: 'Start free today',
      cta2: 'See how it works',
      trust1: 'No credit card required',
      trust2: 'Ready in 15 minutes',
      trust3: 'Cancel anytime',
      scrollDown: 'Scroll down',
    },
    // Features Section
    features: {
      label: 'Features',
      title1: 'Everything you need to',
      title2: 'grow your business',
      subtitle: 'A complete platform for capturing leads and managing customer relationships - from first contact to closed deal.',
      feature1Title: 'Instant Estimates',
      feature1Desc: 'Give customers a price estimate in seconds based on their specific needs and preferences.',
      feature2Title: 'Lead Management',
      feature2Desc: 'Manage all your leads in one place with Kanban view, status tracking, and automatic reminders.',
      feature3Title: 'AI-Powered Suggestions',
      feature3Desc: 'Let AI suggest questions and answer options based on your industry for maximum conversion.',
      feature4Title: 'Easy Integration',
      feature4Desc: 'Add the estimator to your website with a single line of code. Works with all platforms.',
    },
    // How it Works Section
    howItWorks: {
      label: 'How it works',
      title1: 'From signup to',
      title2: 'first lead in 15 minutes',
      step1Title: 'Create account',
      step1Desc: 'Sign up for free and choose your industry. We set up everything automatically.',
      step2Title: 'Build your estimator',
      step2Desc: 'Use AI to create questions or build your own. Set prices and modifiers.',
      step3Title: 'Start collecting leads',
      step3Desc: 'Add one line of code to your website and watch leads flow in real-time.',
    },
    // CTA Section
    cta: {
      title1: 'Ready to',
      title2: 'capture more leads?',
      subtitle: 'Get started for free and have your first estimator ready in under 15 minutes. No credit card required.',
      button: 'Create free account',
      trust: 'Free forever • No hidden fees • Cancel anytime',
    },
    // Footer
    footer: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact',
      support: 'Support',
      copyright: '© 2024 Instant Estimator. All rights reserved.',
    },
  },
  sv: {
    // Navigation
    nav: {
      features: 'Funktioner',
      howItWorks: 'Hur det fungerar',
      pricing: 'Priser',
      signIn: 'Logga in',
      getStarted: 'Kom igång gratis',
    },
    // Hero Section
    hero: {
      badge: 'Nu med AI-drivna frågor',
      title1: 'Fånga fler leads med',
      title2: 'direkta prisuppskattningar',
      subtitle: 'Låt dina kunder få en prisuppskattning direkt på din hemsida. Spara tid, fånga leads automatiskt och skilja dig från konkurrenterna.',
      cta1: 'Börja gratis idag',
      cta2: 'Se hur det fungerar',
      trust1: 'Inget kreditkort krävs',
      trust2: 'Klar på 15 minuter',
      trust3: 'Avsluta när som helst',
      scrollDown: 'Scrolla ner',
    },
    // Features Section
    features: {
      label: 'Funktioner',
      title1: 'Allt du behöver för att',
      title2: 'växa ditt företag',
      subtitle: 'En komplett plattform för att fånga leads och hantera kundrelationer - från första kontakt till avslutad affär.',
      feature1Title: 'Direkta uppskattningar',
      feature1Desc: 'Ge kunder en prisuppskattning på sekunder baserat på deras specifika behov och önskemål.',
      feature2Title: 'Lead-hantering',
      feature2Desc: 'Hantera alla dina leads på ett ställe med Kanban-vy, statushantering och automatiska påminnelser.',
      feature3Title: 'AI-drivna förslag',
      feature3Desc: 'Låt AI föreslå frågor och svarsalternativ baserat på din bransch för maximal konvertering.',
      feature4Title: 'Enkel integration',
      feature4Desc: 'Lägg till estimatorn på din hemsida med en enda rad kod. Fungerar med alla plattformar.',
    },
    // How it Works Section
    howItWorks: {
      label: 'Hur det fungerar',
      title1: 'Från registrering till',
      title2: 'första lead på 15 minuter',
      step1Title: 'Skapa konto',
      step1Desc: 'Registrera dig gratis och välj din bransch. Vi sätter upp allt automatiskt.',
      step2Title: 'Bygg din estimator',
      step2Desc: 'Använd AI för att skapa frågor eller bygg dina egna. Sätt priser och modifierare.',
      step3Title: 'Börja samla leads',
      step3Desc: 'Lägg till en rad kod på din hemsida och se leads strömma in i realtid.',
    },
    // CTA Section
    cta: {
      title1: 'Redo att',
      title2: 'fånga fler leads?',
      subtitle: 'Kom igång gratis och ha din första estimator klar på under 15 minuter. Inget kreditkort krävs.',
      button: 'Skapa konto gratis',
      trust: 'Gratis för alltid • Inga dolda avgifter • Avsluta när som helst',
    },
    // Footer
    footer: {
      privacy: 'Integritetspolicy',
      terms: 'Användarvillkor',
      contact: 'Kontakt',
      support: 'Support',
      copyright: '© 2024 Instant Estimator. Alla rättigheter förbehållna.',
    },
  },
};

export type Language = keyof typeof translations;

// Define a generic structure type for cross-language compatibility
type TranslationsStructure = {
  nav: { [key: string]: string };
  hero: { [key: string]: string };
  features: { [key: string]: string };
  howItWorks: { [key: string]: string };
  cta: { [key: string]: string };
  footer: { [key: string]: string };
};

export type TranslationKeys = TranslationsStructure;
