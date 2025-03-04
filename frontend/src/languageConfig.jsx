import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/locales/en.json';
import si from './translations/locales/sin.json';

// Get saved language from localStorage or default to English
const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    si: { translation: si },
  },
  lng: savedLanguage, // Set initial language
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('preferredLanguage', lng);
});

export default i18n;