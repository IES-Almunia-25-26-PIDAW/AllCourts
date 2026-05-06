import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { User } from "@/types/user";

type AuthState = {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
};

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuth: (state, action: PayloadAction<User | null>) => {
			state.user = action.payload;
			state.isAuthenticated = !!action.payload;
			state.loading = false;
			state.error = null;
		},
		clearAuth: (state) => {
			state.user = null;
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

export const { setAuth, clearAuth, setAuthLoading, setAuthError } =
	authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
	state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
