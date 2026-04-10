import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user";

type AuthState = {
	user: User | null;
	isAuthenticated: boolean;
	isLogged: boolean;
	loading: boolean;
	error: string | null;
};

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLogged: false,
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		hydrateAuth: (state, action: PayloadAction<User | null>) => {
			if (!action.payload) {
				state.user = null;
				state.isAuthenticated = false;
				state.isLogged = false;
				state.loading = false;
				state.error = null;
				return;
			}

			state.user = action.payload;
			state.isAuthenticated = true;
			state.isLogged = true;
			state.loading = false;
			state.error = null;
		},
		setAuth: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
			state.isAuthenticated = true;
			state.isLogged = true;
			state.loading = false;
			state.error = null;
		},
		clearAuth: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.isLogged = false;
			state.loading = false;
			state.error = null;
		},
		setAuthLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setAuthError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	hydrateAuth,
	setAuth,
	clearAuth,
	setAuthLoading,
	setAuthError,
} = authSlice.actions;

// Selector sin tipado de RootState para permitir uso directo desde componentes
export const selectIsLogged = (state: any) => state.auth.isLogged;

export default authSlice.reducer;
