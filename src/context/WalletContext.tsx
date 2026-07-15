import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { api } from '../api/client';

const WALLET_PREFIX = '@geme_wallet_';

type WalletContextValue = {
  balance: number;
  loading: boolean;
  deposit: (amount: number) => Promise<string | null>;
  withdraw: (amount: number) => Promise<string | null>;
  deduct: (amount: number) => Promise<string | null>;
  refresh: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user, hasApiAuth } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setBalance(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      if (hasApiAuth) {
        const data = await api<{ ok: boolean; balance: number }>('/wallet');
        setBalance(Number(data.balance) || 0);
        return;
      }
      const key = WALLET_PREFIX + user.id;
      const raw = await AsyncStorage.getItem(key);
      if (raw == null) {
        const starter = 5000;
        await AsyncStorage.setItem(key, String(starter));
        setBalance(starter);
      } else {
        setBalance(Number(raw) || 0);
      }
    } catch {
      const key = WALLET_PREFIX + user.id;
      const raw = await AsyncStorage.getItem(key);
      setBalance(raw != null ? Number(raw) || 0 : 0);
    } finally {
      setLoading(false);
    }
  }, [user, hasApiAuth]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const applyLocal = useCallback(
    async (updater: (prev: number) => number | string) => {
      if (!user) return 'Not logged in';
      let err: string | null = null;
      setBalance((prev) => {
        const result = updater(prev);
        if (typeof result === 'string') {
          err = result;
          return prev;
        }
        void AsyncStorage.setItem(WALLET_PREFIX + user.id, String(result));
        return result;
      });
      return err;
    },
    [user]
  );

  const deposit = useCallback(
    async (amount: number) => {
      if (!amount || amount <= 0) return 'Enter a valid amount';
      if (hasApiAuth) {
        try {
          const data = await api<{
            ok: boolean;
            mockAutoCredited?: boolean;
          }>('/wallet/deposit', {
            method: 'POST',
            body: { amount },
          });
          await refresh();
          if (data.mockAutoCredited) return null;
          return null;
        } catch (err) {
          return (err as Error).message || 'Deposit failed';
        }
      }
      return applyLocal((prev) => prev + amount);
    },
    [applyLocal, hasApiAuth, refresh]
  );

  const withdraw = useCallback(
    async (amount: number) => {
      if (!amount || amount <= 0) return 'Enter a valid amount';
      if (hasApiAuth) {
        try {
          await api('/wallet/withdraw', {
            method: 'POST',
            body: { amount },
          });
          await refresh();
          return null;
        } catch (err) {
          return (err as Error).message || 'Withdraw failed';
        }
      }
      return applyLocal((prev) =>
        amount > prev ? 'Insufficient wallet balance' : prev - amount
      );
    },
    [applyLocal, hasApiAuth, refresh]
  );

  const deduct = useCallback(
    async (amount: number) => {
      if (!amount || amount <= 0) return 'Invalid amount';
      if (hasApiAuth) {
        // Bids API deducts on server; local deduct only when offline
        return applyLocal((prev) =>
          amount > prev ? 'Insufficient wallet balance' : prev - amount
        );
      }
      return applyLocal((prev) =>
        amount > prev ? 'Insufficient wallet balance' : prev - amount
      );
    },
    [applyLocal, hasApiAuth]
  );

  const value = useMemo(
    () => ({ balance, loading, deposit, withdraw, deduct, refresh }),
    [balance, loading, deposit, withdraw, deduct, refresh]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}

export function formatMoney(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}
