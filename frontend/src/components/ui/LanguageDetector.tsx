import { useEffect } from "react";
import i18n from "@/config/i18n";

/**
 * @component LanguageDetector
 * Componente sin UI que detecta el idioma preferido del usuario al montar
 * y sincroniza i18n si difiere del activo. No renderiza nada en el DOM.
 *
 * Prioridad de detección:
 *   1. localStorage     → idioma guardado de una sesión anterior
 *   2. Cookie           → i18nextLng seteada por el servidor
 *   3. navigator.language → idioma del navegador
 *   4. 'es'             → idioma predeterminado
 *
 * Solo distingue entre 'en' y 'es' — cualquier variante no inglesa usa español como reserva.
 */

export default function LanguageDetector() {
	useEffect(() => {
		const cached =
			typeof window !== "undefined" &&
			(localStorage.getItem("i18nextLng") ||
				document.cookie
					.split("; ")
					.find((row) => row.startsWith("i18nextLng="))
					?.split("=")[1]);

		const nav =
			typeof navigator !== "undefined" &&
			navigator.language?.split("-")[0];

		const newLang = (cached || nav || "es").startsWith("en") ? "en" : "es";

		if (i18n.language !== newLang) {
			i18n.changeLanguage(newLang);
		}
	}, []);

	return null;
}
