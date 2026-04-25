'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { StorageKeys } from '../../lib/storage-keys';

export type Lang = 'en' | 'de';

const STORAGE_KEY = StorageKeys.LANG;

type Dict = Record<string, string>;

const en: Dict = {
  'lang.label': 'Language',
  'lang.en': 'English',
  'lang.de': 'German',
  'shell.platform': 'NEXDOZ PLATFORM',
  'shell.title': 'Nexdoz Operations Center',
  'shell.account': 'Account',
  'shell.signed_in_user': 'Signed in user',
  'shell.sign_out': 'Sign out',
  'shell.about': 'About Nexdoz',
  'shell.brand_principles': 'Brand principles',
  'shell.design_strategy': 'Design strategy',
  'nav.home': 'Home',
  'nav.login': 'Login',
  'nav.dashboard': 'Dashboard',
  'nav.logging': 'Logging',
  'nav.timeline': 'Timeline',
  'nav.meal_ai': 'Meal AI',
  'nav.insights': 'Insights',
  'nav.care_plans': 'Care Plans',
  'nav.clinician': 'Clinician',
  'nav.settings': 'Settings',
  'nav.pricing': 'Pricing',
  'nav.market': 'Market',
  'nav.about': 'About',
  'home.eyebrow': 'NEXDOZ',
  'home.title': 'AI diabetes companion for daily decisions.',
  'home.lead': 'Meal scan, timeline insights, clinician-ready summaries, and secure user operations in one product experience.',
  'home.sign_in': 'Sign In',
  'home.open_dashboard': 'Open Dashboard',
  'home.meal_ai': 'Meal AI',
  'home.mobile_title': 'Get the Mobile App',
  'home.mobile_body': 'Install Nexdoz on your phone and sync your diabetes workflow across devices.',
  'home.what_title': 'What You Can Do'
};

const de: Dict = {
  'lang.label': 'Sprache',
  'lang.en': 'Englisch',
  'lang.de': 'Deutsch',
  'shell.platform': 'NEXDOZ PLATTFORM',
  'shell.title': 'Nexdoz Leitstand',
  'shell.account': 'Konto',
  'shell.signed_in_user': 'Angemeldeter Nutzer',
  'shell.sign_out': 'Abmelden',
  'shell.about': 'Über Nexdoz',
  'shell.brand_principles': 'Markenprinzipien',
  'shell.design_strategy': 'Designstrategie',
  'nav.home': 'Start',
  'nav.login': 'Anmeldung',
  'nav.dashboard': 'Dashboard',
  'nav.logging': 'Erfassung',
  'nav.timeline': 'Zeitachse',
  'nav.meal_ai': 'Mahlzeit-KI',
  'nav.insights': 'Einblicke',
  'nav.care_plans': 'Versorgungspläne',
  'nav.clinician': 'Klinik',
  'nav.settings': 'Einstellungen',
  'nav.pricing': 'Preise',
  'nav.market': 'Markt',
  'nav.about': 'Über uns',
  'home.eyebrow': 'NEXDOZ',
  'home.title': 'KI-Diabetesbegleiter für tägliche Entscheidungen.',
  'home.lead': 'Mahlzeit-Scan, Timeline-Einblicke, klinikreife Zusammenfassungen und sichere Nutzerfunktionen in einem Produkt.',
  'home.sign_in': 'Anmelden',
  'home.open_dashboard': 'Dashboard öffnen',
  'home.meal_ai': 'Mahlzeit-KI',
  'home.mobile_title': 'Mobile App holen',
  'home.mobile_body': 'Installiere Nexdoz auf deinem Telefon und synchronisiere den Diabetes-Workflow über alle Geräte.',
  'home.what_title': 'Was Du tun kannst'
};

const DICTS: Record<Lang, Dict> = { en, de };

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === 'en' || saved === 'de') {
      setLangState(saved);
      document.documentElement.setAttribute('lang', saved);
      return;
    }
    document.documentElement.setAttribute('lang', 'en');
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute('lang', next);
  }

  const value = useMemo<LanguageContextValue>(() => ({
    lang,
    setLang,
    t: (key: string) => DICTS[lang][key] || DICTS.en[key] || key
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
