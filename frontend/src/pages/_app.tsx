import "@/styles/globals.scss";
import "@/config/i18n";
import type { AppProps } from "next/app";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </ErrorBoundary>
  );
}