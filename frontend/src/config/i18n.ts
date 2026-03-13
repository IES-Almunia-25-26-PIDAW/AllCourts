//#region MODULES
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./locales/es.json";
import en from "./locales/en.json";
//#endregion

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

i18n
  // Conecta i18next con React para exponer hooks y componentes de traducción
  .use(initReactI18next)
  .init({
    // Archivos de traducción indexados por código de idioma.
    // Cada JSON contiene pares clave-valor con los textos de la interfaz.
    resources: {
      es: { translation: es },
      en: { translation: en },
    },

    // Idioma activo al arrancar la aplicación
    lng: "es",

    // Si una clave no existe en el idioma activo fallbackLng indica el idioma por defecto
    fallbackLng: "es",

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
