//#region TYPES
import "@/styles/globals.scss";
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
//#endregion

/**
 * @page App
 * Punto de entrada principal de la aplicación Next.js.
 * Envuelve todas las páginas con el layout base y los proveedores globales.
 *
 * Props:
 *   Component → página activa que Next.js inyecta según la ruta
 *   pageProps → props iniciales de la página (getServerSideProps, getStaticProps, etc.)
 *
 * Estructura:
 *   ErrorBoundary     → captura errores de cualquier hijo sin romper la app
 *     LanguageDetector → detecta y sincroniza el idioma del usuario 
 *     Navbar           → barra de navegación global
 *     main             → contenido de la página activa
 *     Footer           → pie de página global
 */
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const token = window.localStorage.getItem("allcourts_token");
    const user = window.localStorage.getItem("allcourts_user");

    if (!token || !user) {
      store.dispatch(clearAuth());
      return;
    }

    try {
      store.dispatch(
        hydrateAuth({
          token,
          user: JSON.parse(user),
        })
      );
    } catch {
      window.localStorage.removeItem("allcourts_token");
      window.localStorage.removeItem("allcourts_user");
      store.dispatch(clearAuth());
    }
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
