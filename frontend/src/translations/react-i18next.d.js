import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import si from './locales/sin.json';

const resources = {
  en: { translation: en },
  si: { translation: si },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('preferredLanguage') || 'en', 
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;