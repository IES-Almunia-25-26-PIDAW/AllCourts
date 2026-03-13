//#region MODULES
import { useEffect } from "react";
import i18n from "@/config/i18n";
//#endregion

/**
 * @component LanguageDetector
 * Componente sin UI que detecta el idioma preferido del usuario al montar
 * y sincroniza i18n si difiere del activo. No renderiza nada en el DOM.
 *
 * Prioridad de detección:
 *   1. localStorage     → idioma guardado de una sesión anterior
 *   2. Cookie           → i18nextLng seteada por el servidor
 *   3. navigator.language → idioma del navegador
 *   4. 'es'             → fallback por defecto
 *
 * Solo distingue entre 'en' y 'es' — cualquier variante no inglesa fallback al español.
 */

export default function LanguageDetector() {
  useEffect(() => {
    // Intenta leer el idioma: primero localStorage, luego cookie, navigator.language, y si todo falla, 'es' por defecto.
    // El guard de window evita errores en SSR
    const cached =
      typeof window !== "undefined" &&
      (localStorage.getItem("i18nextLng") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("i18nextLng="))
          ?.split("=")[1]);

    const nav =
      typeof navigator !== "undefined" && navigator.language?.split("-")[0];

    // Si ninguna fuente indica inglés fallback al español
    const newLang = (cached || nav || "es").startsWith("en") ? "en" : "es";

    // Solo cambia el idioma si es distinto al activo, evitando re-renders innecesarios
    if (i18n.language !== newLang) {
      i18n.changeLanguage(newLang);
    }
  }, []);

  return null;
}
