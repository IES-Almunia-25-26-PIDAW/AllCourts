import { useEffect } from 'react';
import i18n from '@/config/i18n';

export default function LanguageDetector() {
    useEffect(() => {
        const cached =
            typeof window !== 'undefined' &&
            (localStorage.getItem('i18nextLng') ||
                document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('i18nextLng='))
                    ?.split('=')[1]);
        const nav =
            typeof navigator !== 'undefined' &&
            navigator.language?.split('-')[0];

        const newLang = (cached || nav || 'es').startsWith('en') ? 'en' : 'es';
        if (i18n.language !== newLang) {
            i18n.changeLanguage(newLang);
        }
    }, []);

    return null;
}