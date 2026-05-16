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
import { setAuth, clearAuth, setAuthLoading } from "@/store/slices/authSlice";
import { getCurrentUser } from "@/api/authApi";

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
 *   Al cargar la app, se valida la sesión real en background llamando a /auth/me.
 *   Redux solo refleja el estado que devuelve el backend.
 *
 * Flujo de arranque:
 *   1. Validar la sesión real en backend con la cookie httpOnly.
 *   2. Sincronizar Redux con el usuario devuelto por /auth/me si la sesión sigue siendo válida.
 */
export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		store.dispatch(setAuthLoading(true));
		getCurrentUser()
			.then((user) => {
				store.dispatch(setAuth(user));
			})
			.catch(() => {
				store.dispatch(clearAuth());
			})
			.finally(() => {
				store.dispatch(setAuthLoading(false));
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
