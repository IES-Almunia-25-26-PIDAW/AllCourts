import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, User } from "@/types/user";

type AuthState = {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
};

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		hydrateAuth: (state, action: PayloadAction<AuthResponse | null>) => {
			if (!action.payload) {
				state.user = null;
				state.token = null;
				state.isAuthenticated = false;
				state.loading = false;
				state.error = null;
				return;
			}

			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;
		},
		setAuth: (state, action: PayloadAction<AuthResponse>) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;
		},
		clearAuth: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
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

export default authSlice.reducer;
