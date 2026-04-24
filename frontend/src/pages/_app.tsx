//#region TYPES
import "@/styles/globals.scss";
import "react-day-picker/style.css";
import "@/config/i18n";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Provider } from "react-redux";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LanguageDetector from "@/components/ui/LanguageDetector";
import store from "@/store";
import { hydrateAuth, clearAuth } from "@/store/slices/authSlice";
import { getCurrentUser } from "@/api/authApi";
//#endregion

//#region DOCUMENTATION
/**
 * @page App
 * Punto de entrada principal de la aplicación Next.js.
 * Envuelve todas las páginas con el layout base y los proveedores globales.
 *
 * Propiedades:
 *   Component → página activa que Next.js inyecta según la ruta
 *   pageProps → props iniciales de la página (getServerSideProps, getStaticProps, etc.)
 *
 * Estructura:
 *   ErrorBoundary     → captura errores de cualquier hijo sin romper la app
 *     LanguageDetector → detecta y sincroniza el idioma del usuario
 *     Navbar           → barra de navegación global
 *     main             → contenido de la página activa
 *     Footer           → pie de página global
 *
 * Autenticación:
 *   El token JWT se almacena en una cookie httpOnly (nunca accesible por JS).
 *   Al cargar la app, se hidrata el estado Redux con los datos cacheados en localStorage
 *   y se valida la sesión en background llamando a /auth/me.
 *
 * Flujo de arranque:
 *   1. Leer usuario cacheado desde localStorage para pintar la app rápido.
 *   2. Validar la sesión real en backend con la cookie httpOnly.
 *   3. Sincronizar Redux y localStorage si la sesión sigue siendo válida.
 */
//#endregion

//#region FUNCTIONS
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Paso 1: Hidratación instantánea desde localStorage (datos no sensibles)
    try {
      const cached = window.localStorage.getItem("allcourts_user");
      if (cached) {
        store.dispatch(hydrateAuth(JSON.parse(cached)));
      }
    } catch {
      window.localStorage.removeItem("allcourts_user");
    }

    // Paso 2: Validar la sesión real contra el backend.
    // La cookie httpOnly se envía automáticamente con credentials: "include".
    // Si la cookie expiró o no existe, /auth/me devolverá 401 y limpiamos el estado.
    getCurrentUser()
      .then((user) => {
        store.dispatch(hydrateAuth(user));
        try {
          window.localStorage.setItem("allcourts_user", JSON.stringify(user));
        } catch {}
      })
      .catch(() => {
        try {
          window.localStorage.removeItem("allcourts_user");
        } catch {}
        store.dispatch(clearAuth());
      });
  }, []);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <LanguageDetector />
        <Navbar />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </ErrorBoundary>
    </Provider>
  );
}
//#endregion
