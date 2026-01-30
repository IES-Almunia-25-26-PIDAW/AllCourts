import "@/styles/globals.scss";
import "@/config/i18n";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ErrorBoundary>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Component {...pageProps} />
      </main>
      <Footer />
      </ErrorBoundary>
    </div>
  );
}
