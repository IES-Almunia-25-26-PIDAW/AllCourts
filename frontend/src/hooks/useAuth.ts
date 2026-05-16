import * as authApi from "@/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	clearAuth,
	selectAuthError,
	selectAuthLoading,
	selectIsAuthenticated,
	selectUser,
	setAuth,
	setAuthError,
	setAuthLoading,
} from "@/store/slices/authSlice";
import type { CreateUserDTO, LoginCredentials } from "@/types/user";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * Hook de autenticación de la app.
 * Centraliza login, registro, recuperación de contraseña y logout.
 *
 * @returns {object} API de autenticación para componentes.
 */
export function useAuth() {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const user = useAppSelector(selectUser);
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const loading = useAppSelector(selectAuthLoading);
	const error = useAppSelector(selectAuthError);

	const login = async (
		credentials: LoginCredentials,
		redirectFrom?: string,
	) => {
		dispatch(setAuthLoading(true));
		dispatch(setAuthError(null));
		try {
			const { user } = await authApi.login(credentials);
			dispatch(setAuth(user));
			const roleTarget = user.role === "manager" ? "/manager" : "/clubs";
			router.push(redirectFrom ?? roleTarget);
		} catch (err) {
			const raw = err instanceof Error ? err.message : "";
			const mapped = mapServerError(raw, t);
			dispatch(setAuthError(mapped || raw || t("login.error_generic")));
		} finally {
			dispatch(setAuthLoading(false));
		}
	};

	const register = async (userData: CreateUserDTO): Promise<boolean> => {
		try {
			await authApi.register(userData);
			router.push("/login?registered=1");
			return true;
		} catch (err) {
			const raw = err instanceof Error ? err.message : "";
			const mapped = mapServerError(raw, t);
			throw new Error(mapped || raw || t("register.error_generic"));
		}
	};

	/**
	 * Mapea errores comunes del backend a claves de i18n.
	 *
	 * @param msg Mensaje original del backend.
	 * @param t Función de traducción.
	 * @returns {string | null} Texto traducido o null si no hay correspondencia.
	 */
	function mapServerError(msg: string | undefined, t: (k: string) => string) {
		if (!msg) return null;
		const m = msg.toLowerCase();
		if (m.includes("credencial") || m.includes("invalid credentials"))
			return t("login.error_invalid_credentials");
		if (
			m.includes("password no cumple") ||
			m.includes("contraseña debe") ||
			m.includes("password does not meet") ||
			m.includes("must be at least")
		)
			return t("register.error_password_requirements");
		if (m.includes("token") && m.includes("no se encontró"))
			return t("resetPassword.error_token_missing");
		if (
			m.includes("portal incorrecto") ||
			m.includes("manager debe") ||
			m.includes("jugador debe")
		) {
			if (m.includes("manager debe"))
				return t("login.error_wrong_portal_manager");
			if (m.includes("jugador debe"))
				return t("login.error_wrong_portal_player");
			return t("login.error_wrong_portal");
		}
		return null;
	}

	const verifyEmail = async (token: string): Promise<void> => {
		await authApi.verifyEmail(token);
	};

	const forgotPassword = async (email: string): Promise<void> => {
		await authApi.forgotPassword(email);
	};

	const resetPassword = async (
		token: string,
		newPassword: string,
	): Promise<void> => {
		await authApi.resetPassword(token, newPassword);
	};

	const resendVerification = async (email: string): Promise<void> => {
		await authApi.resendVerification(email);
	};

	const logout = async () => {
		try {
			await authApi.logout();
		} catch {}
		dispatch(clearAuth());
		window.location.replace("/login");
	};

	return {
		user,
		isAuthenticated,
		loading,
		error,
		login,
		register,
		verifyEmail,
		forgotPassword,
		resetPassword,
		resendVerification,
		logout,
	};
}
