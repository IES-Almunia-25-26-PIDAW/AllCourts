import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./locales/es.json";
import en from "./locales/en.json";

/**
 * @module i18n
 * Configuración del sistema de internacionalización (i18n).
 * Inicializa i18next con su integración para React, permitiendo el uso
 * de traducciones en toda la aplicación mediante `useTranslation` o `Trans`.
 *
 * Idiomas disponibles:
 *   es → Español
 *   en → Inglés
 *
 * Uso en componentes:
 *   import i18n from './i18n';
 *   const { t } = useTranslation();
 *   t('clave.anidada')
 */

i18n.use(initReactI18next).init({
	resources: {
		es: { translation: es },
		en: { translation: en },
	},

	lng: "es",

	fallbackLng: "es",

	interpolation: {
		escapeValue: false,
	},

	react: {
		useSuspense: false,
	},
});

export default i18n;
