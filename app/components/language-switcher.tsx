'use client';

import { useLanguage } from './language';

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <label className="themeControl">
      <span>{t('lang.label')}</span>
      <select value={lang} onChange={(e) => setLang(e.target.value as 'en' | 'de')}>
        <option value="en">{t('lang.en')}</option>
        <option value="de">{t('lang.de')}</option>
      </select>
    </label>
  );
}
