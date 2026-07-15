import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../data/markets';
import {
  api,
  apiCheckPhone,
  apiLoginPassword,
  apiLogout,
  apiResetPassword,
  apiSendOtp,
  apiSetPassword,
  apiVerifyOtp,
  loadTokens,
  saveTokens,
} from '../api/client';

const SESSION_KEY = '@geme_session';

type SessionUser = Omit<User, 'password'> & { role?: string };

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  hasApiAuth: boolean;
  checkPhone: (
    phone: string
  ) => Promise<{ exists: boolean; next: 'otp' | 'password' } | string>;
  sendOtp: (
    phone: string,
    purpose: 'signup' | 'forgot'
  ) => Promise<{ debugOtp?: string } | string>;
  verifyOtp: (
    phone: string,
    otp: string,
    purpose: 'signup' | 'forgot'
  ) => Promise<{ otpTicket: string } | string>;
  completeSignup: (input: {
    phone: string;
    otpTicket: string;
    password: string;
    name?: string;
  }) => Promise<string | null>;
  loginWithPassword: (phone: string, password: string) => Promise<string | null>;
  resetPassword: (input: {
    phone: string;
    otpTicket: string;
    password: string;
  }) => Promise<string | null>;
  /** @deprecated use phone-first OTP flow */
  login: (mobile: string, password: string) => Promise<string | null>;
  /** @deprecated */
  register: (
    name: string,
    mobile: string,
    password: string
  ) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toSession(u: {
  id: number | string;
  name: string;
  phone?: string;
  loginId?: string;
  role?: string;
}): SessionUser {
  return {
    id: String(u.id),
    name: u.name,
    mobile: u.phone || u.loginId || '',
    role: u.role,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApiAuth, setHasApiAuth] = useState(false);

  const applySession = useCallback(async (session: SessionUser, apiAuth: boolean) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    setHasApiAuth(apiAuth);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const tokens = await loadTokens();
        if (tokens?.accessToken) {
          try {
            const me = await api<{
              ok: boolean;
              user: {
                id: number;
                loginId: string;
                name: string;
                role: string;
                phone?: string;
              };
            }>('/auth/me');
            await applySession(toSession(me.user), true);
            return;
          } catch {
            await saveTokens(null);
          }
        }
        const session = await AsyncStorage.getItem(SESSION_KEY);
        if (session) {
          setUser(JSON.parse(session));
          setHasApiAuth(false);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [applySession]);

  const checkPhone = useCallback(async (phone: string) => {
    const trimmed = phone.trim();
    if (!/^\d{10}$/.test(trimmed)) return 'Enter a valid 10-digit mobile number';
    try {
      const data = await apiCheckPhone(trimmed);
      return { exists: data.exists, next: data.next };
    } catch (err) {
      return (err as Error).message || 'Network error';
    }
  }, []);

  const sendOtp = useCallback(
    async (phone: string, purpose: 'signup' | 'forgot') => {
      try {
        const data = await apiSendOtp(phone.trim(), purpose);
        return { debugOtp: data.debugOtp };
      } catch (err) {
        return (err as Error).message || 'OTP send failed';
      }
    },
    []
  );

  const verifyOtp = useCallback(
    async (phone: string, otp: string, purpose: 'signup' | 'forgot') => {
      try {
        const data = await apiVerifyOtp(phone.trim(), otp.trim(), purpose);
        return { otpTicket: data.otpTicket };
      } catch (err) {
        return (err as Error).message || 'OTP invalid';
      }
    },
    []
  );

  const completeSignup = useCallback(
    async (input: {
      phone: string;
      otpTicket: string;
      password: string;
      name?: string;
    }) => {
      if (input.password.length < 4) return 'Password must be at least 4 characters';
      try {
        const u = await apiSetPassword(input);
        await applySession(toSession(u), true);
        return null;
      } catch (err) {
        return (err as Error).message || 'Signup failed';
      }
    },
    [applySession]
  );

  const loginWithPassword = useCallback(
    async (phone: string, password: string) => {
      if (!password) return 'Password is required';
      try {
        const u = await apiLoginPassword(phone.trim(), password);
        await applySession(toSession(u), true);
        return null;
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status === 401) return 'Wrong password';
        return (err as Error).message || 'Login failed';
      }
    },
    [applySession]
  );

  const resetPassword = useCallback(
    async (input: {
      phone: string;
      otpTicket: string;
      password: string;
    }) => {
      if (input.password.length < 4) return 'Password must be at least 4 characters';
      try {
        const u = await apiResetPassword(input);
        await applySession(toSession(u), true);
        return null;
      } catch (err) {
        return (err as Error).message || 'Reset failed';
      }
    },
    [applySession]
  );

  const login = useCallback(
    async (mobile: string, password: string) =>
      loginWithPassword(mobile, password),
    [loginWithPassword]
  );

  const register = useCallback(async () => {
    return 'Use OTP signup flow';
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
    setHasApiAuth(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      hasApiAuth,
      checkPhone,
      sendOtp,
      verifyOtp,
      completeSignup,
      loginWithPassword,
      resetPassword,
      login,
      register,
      logout,
    }),
    [
      user,
      loading,
      hasApiAuth,
      checkPhone,
      sendOtp,
      verifyOtp,
      completeSignup,
      loginWithPassword,
      resetPassword,
      login,
      register,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

/** Demo hint only — API OTP mock pe console me OTP aata hai */
export const TEST_USER = {
  id: 'test-user-1',
  name: 'Test User',
  mobile: '9999999999',
  password: '1234',
} as const;
