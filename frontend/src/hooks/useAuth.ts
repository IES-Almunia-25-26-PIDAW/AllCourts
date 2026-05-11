import * as authApi from "@/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuth, selectAuthError, selectAuthLoading, selectIsAuthenticated, selectUser, setAuth, setAuthError, setAuthLoading } from "@/store/slices/authSlice";
import type { CreateUserDTO, LoginCredentials } from "@/types/user";
import { useRouter } from "next/router";

export function useAuth() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const user = useAppSelector(selectUser);
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const loading = useAppSelector(selectAuthLoading);
	const error = useAppSelector(selectAuthError);

	const login = async (credentials: LoginCredentials, redirectFrom?: string) => {
		dispatch(setAuthLoading(true));
		dispatch(setAuthError(null));
		try {
			const { user } = await authApi.login(credentials);
			dispatch(setAuth(user));
			try {
				localStorage.setItem("allcourts_user", JSON.stringify(user));
			} catch {}
			const roleTarget = user.role === "manager" ? "/manager" : "/clubs";
			router.push(redirectFrom ?? roleTarget);
		} catch (err) {
			dispatch(setAuthError(err instanceof Error ? err.message : "Login failed"));
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
			throw err;
		}
	};

	const verifyEmail = async (token: string): Promise<void> => {
		await authApi.verifyEmail(token);
	};

	const forgotPassword = async (email: string): Promise<void> => {
		await authApi.forgotPassword(email);
	};

	const resetPassword = async (token: string, newPassword: string): Promise<void> => {
		await authApi.resetPassword(token, newPassword);
	};

	const resendVerification = async (email: string): Promise<void> => {
		await authApi.resendVerification(email);
	};

	const logout = async () => {
		try {
			await authApi.logout();
		} catch {}
		try {
			localStorage.removeItem("allcourts_user");
		} catch {}
		document.cookie = "allcourts_token=; Max-Age=0; path=/";
		document.cookie = "token=; Max-Age=0; path=/";
		dispatch(clearAuth());
		router.push("/");
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
