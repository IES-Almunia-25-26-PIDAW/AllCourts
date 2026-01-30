import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './locales/es.json';
import en from './locales/en.json';

if (typeof window !== 'undefined') {
    i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources: {
                es: { translation: es },
                en: { translation: en }
            },
            lng: 'es',
            fallbackLng: 'es',
            interpolation: { 
                escapeValue: false 
            },
            react: {
                useSuspense: false
            }
        });
} else {
    i18n
        .use(initReactI18next)
        .init({
            resources: {
                es: { translation: es },
                en: { translation: en }
            },
            lng: 'es',
            fallbackLng: 'es',
            interpolation: { 
                escapeValue: false 
            },
            react: {
                useSuspense: false
            }
        });
}

export default i18n;