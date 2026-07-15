import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@sara_api_tokens';
const DEFAULT_BASE =
  process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:4000/api/v1';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

let memoryTokens: Tokens | null = null;
let refreshPromise: Promise<string | null> | null = null;

export async function loadTokens(): Promise<Tokens | null> {
  if (memoryTokens) return memoryTokens;
  const raw = await AsyncStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    memoryTokens = JSON.parse(raw) as Tokens;
    return memoryTokens;
  } catch {
    return null;
  }
}

export async function saveTokens(tokens: Tokens | null) {
  memoryTokens = tokens;
  if (!tokens) {
    await AsyncStorage.removeItem(TOKEN_KEY);
    return;
  }
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = await loadTokens();
  if (!tokens?.refreshToken) return null;
  const res = await fetch(`${DEFAULT_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });
  if (!res.ok) {
    await saveTokens(null);
    return null;
  }
  const data = await res.json();
  const next = {
    accessToken: data.accessToken as string,
    refreshToken: tokens.refreshToken,
  };
  await saveTokens(next);
  return next.accessToken;
}

export type ApiOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
};

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, auth = true, signal } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const tokens = await loadTokens();
    if (!tokens?.accessToken) {
      const err = new Error('UNAUTHORIZED');
      (err as Error & { status: number }).status = 401;
      throw err;
    }
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  const doFetch = () =>
    fetch(`${DEFAULT_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });

  let res = await doFetch();
  if (res.status === 401 && auth) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const access = await refreshPromise;
    if (!access) {
      const err = new Error('UNAUTHORIZED');
      (err as Error & { status: number }).status = 401;
      throw err;
    }
    headers.Authorization = `Bearer ${access}`;
    res = await doFetch();
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(
      (data as { message?: string }).message ||
        (data as { error?: string }).error ||
        `HTTP_${res.status}`
    );
    (err as Error & { status: number; data: unknown }).status = res.status;
    (err as Error & { data: unknown }).data = data;
    throw err;
  }
  return data as T;
}

type AuthUser = {
  id: number | string;
  loginId?: string;
  name: string;
  role: string;
  phone?: string;
};

async function saveAuthResult(data: {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}) {
  await saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return data.user;
}

export async function apiCheckPhone(phone: string) {
  return api<{
    ok: boolean;
    exists: boolean;
    next: 'otp' | 'password';
    purpose?: string;
  }>('/auth/check-phone', {
    method: 'POST',
    body: { phone },
    auth: false,
  });
}

export async function apiSendOtp(phone: string, purpose: 'signup' | 'forgot') {
  return api<{
    ok: boolean;
    debugOtp?: string;
    expiresIn: number;
  }>('/auth/send-otp', {
    method: 'POST',
    body: { phone, purpose },
    auth: false,
  });
}

export async function apiVerifyOtp(
  phone: string,
  otp: string,
  purpose: 'signup' | 'forgot'
) {
  return api<{
    ok: boolean;
    otpTicket: string;
    next: string;
  }>('/auth/verify-otp', {
    method: 'POST',
    body: { phone, otp, purpose },
    auth: false,
  });
}

export async function apiSetPassword(input: {
  phone: string;
  otpTicket: string;
  password: string;
  name?: string;
}) {
  const data = await api<{
    ok: boolean;
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }>('/auth/set-password', {
    method: 'POST',
    body: input,
    auth: false,
  });
  return saveAuthResult(data);
}

export async function apiLoginPassword(phone: string, password: string) {
  const data = await api<{
    ok: boolean;
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }>('/auth/login-password', {
    method: 'POST',
    body: { phone, password },
    auth: false,
  });
  return saveAuthResult(data);
}

export async function apiResetPassword(input: {
  phone: string;
  otpTicket: string;
  password: string;
}) {
  const data = await api<{
    ok: boolean;
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }>('/auth/reset-password', {
    method: 'POST',
    body: input,
    auth: false,
  });
  return saveAuthResult(data);
}

export async function apiLogin(loginId: string, password: string) {
  const data = await api<{
    ok: boolean;
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }>('/auth/login', {
    method: 'POST',
    body: { loginId, password },
    auth: false,
  });
  return saveAuthResult(data);
}

export async function apiLogout() {
  const tokens = await loadTokens();
  try {
    if (tokens) {
      await api('/auth/logout', {
        method: 'POST',
        body: { refreshToken: tokens.refreshToken },
      });
    }
  } catch {
    // ignore
  }
  await saveTokens(null);
}

export function getApiBaseUrl() {
  return DEFAULT_BASE;
}
