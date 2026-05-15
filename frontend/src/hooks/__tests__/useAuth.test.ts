import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import * as authApi from '@/api/authApi';
import { clearAuth, setAuth, setAuthError, setAuthLoading } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { User } from '@/types/user';

const mockPush = jest.fn();
const mockDispatch = jest.fn();
const mockUseTranslation = jest.fn();

let authState = {
  auth: {
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
};

jest.mock('@/store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/api/authApi', () => ({
  forgotPassword: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  resendVerification: jest.fn(),
  resetPassword: jest.fn(),
  verifyEmail: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authState = {
      auth: {
        user: {
          id: 'user-1',
          name: 'Ana',
          username: 'ana',
          email: 'ana@example.com',
          role: 'manager',
          is_verified: true,
        },
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    };

    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((selector: (state: typeof authState) => unknown) =>
      selector(authState),
    );
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('returns the authenticated user from the mocked store', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(authState.auth.user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('logs in a manager and redirects to the manager dashboard', async () => {
    (authApi.login as jest.Mock).mockResolvedValue({
      user: {
        id: 'user-2',
        name: 'Maria',
        username: 'maria',
        email: 'maria@example.com',
        role: 'manager',
        is_verified: true,
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ identifier: 'maria@example.com', password: 'secret' });
    });

    expect(authApi.login).toHaveBeenCalledWith({ identifier: 'maria@example.com', password: 'secret' });
    expect(mockDispatch).toHaveBeenCalledWith(setAuthLoading(true));
    expect(mockDispatch).toHaveBeenCalledWith(setAuthError(null));
    expect(mockDispatch).toHaveBeenCalledWith(setAuth({
      id: 'user-2',
      name: 'Maria',
      username: 'maria',
      email: 'maria@example.com',
      role: 'manager',
      is_verified: true,
    }));
    expect(mockPush).toHaveBeenCalledWith('/manager');
  });

  it('logs out and clears auth', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    (authApi.logout as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(authApi.logout).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(clearAuth());
    consoleErrorSpy.mockRestore();
  });
});
