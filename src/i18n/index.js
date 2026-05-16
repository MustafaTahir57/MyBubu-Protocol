import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ar from './locales/ar.json';
import de from './locales/de.json';
import es from './locales/es.json';
import hi from './locales/hi.json';
import id from './locales/id.json';
import pt from './locales/pt.json';
import fr from './locales/fr.json';
import vi from "./locales/vi.json"
import th from "./locales/th.json"


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      id: { translation: id },
      fr: { translation: fr },
      es: { translation: es },
      de: { translation: de },
      ar: { translation: ar },
      hi: { translation: hi },
      pt: { translation: pt },
      vi: { translation: vi },
      th: { translation: th },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mybubu_lang',
    },
  });

export default i18n;
