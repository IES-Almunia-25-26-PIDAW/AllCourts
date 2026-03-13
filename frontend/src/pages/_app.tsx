//#region TYPES
import "@/styles/globals.scss";
import "@/config/i18n";
import type { AppProps } from "next/app";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LanguageDetector from "@/components/ui/LanguageDetector";
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
  return (
    <ErrorBoundary>
      <LanguageDetector />
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
