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

export type BidRecord = {
  id: string;
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
  number: string;
  points: number;
  createdAt: number;
  status: 'pending' | 'won' | 'lost';
};

export type LedgerEntry = {
  id: string;
  type: 'deposit' | 'withdraw' | 'bid';
  amount: number;
  note: string;
  createdAt: number;
  balanceAfter: number;
};

type ActivityContextValue = {
  bids: BidRecord[];
  ledger: LedgerEntry[];
  addBids: (
    items: Omit<BidRecord, 'id' | 'createdAt' | 'status'>[]
  ) => Promise<void>;
  addLedger: (
    entry: Omit<LedgerEntry, 'id' | 'createdAt'>
  ) => Promise<void>;
  refreshBids: () => Promise<void>;
  refreshLedger: () => Promise<void>;
};

const ActivityContext = createContext<ActivityContextValue | undefined>(
  undefined
);

const HISTORY_CAP = 200;

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const { user, hasApiAuth } = useAuth();
  const [bids, setBids] = useState<BidRecord[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);

  const refreshBids = useCallback(async () => {
    if (!user) {
      setBids([]);
      return;
    }
    if (hasApiAuth) {
      try {
        const data = await api<{
          items: Array<{
            id: number;
            marketId: string;
            marketName: string;
            gameId: string;
            gameName: string;
            number: string;
            points: number;
            status: string;
            createdAt: string;
          }>;
        }>('/bids/mine?limit=100');
        setBids(
          data.items.map((b) => ({
            id: String(b.id),
            marketId: b.marketId,
            marketName: b.marketName,
            gameId: b.gameId,
            gameName: b.gameName,
            number: b.number,
            points: Number(b.points),
            status: (b.status as BidRecord['status']) || 'pending',
            createdAt: new Date(b.createdAt).getTime(),
          }))
        );
        return;
      } catch {
        // fall through to local
      }
    }
    const bRaw = await AsyncStorage.getItem(`@geme_bids_${user.id}`);
    try {
      setBids(bRaw ? (JSON.parse(bRaw) as BidRecord[]) : []);
    } catch {
      setBids([]);
    }
  }, [user, hasApiAuth]);

  const refreshLedger = useCallback(async () => {
    if (!user) {
      setLedger([]);
      return;
    }
    if (hasApiAuth) {
      try {
        const data = await api<{
          items: Array<{
            id: number;
            type: string;
            amount: number;
            balanceAfter: number;
            note: string;
            createdAt: string;
          }>;
        }>('/wallet/ledger?limit=100');
        setLedger(
          data.items.map((r) => ({
            id: String(r.id),
            type: r.type as LedgerEntry['type'],
            amount: Number(r.amount),
            balanceAfter: Number(r.balanceAfter),
            note: r.note || '',
            createdAt: new Date(r.createdAt).getTime(),
          }))
        );
        return;
      } catch {
        // fall through
      }
    }
    const lRaw = await AsyncStorage.getItem(`@geme_ledger_${user.id}`);
    try {
      setLedger(lRaw ? (JSON.parse(lRaw) as LedgerEntry[]) : []);
    } catch {
      setLedger([]);
    }
  }, [user, hasApiAuth]);

  useEffect(() => {
    void refreshBids();
    void refreshLedger();
  }, [refreshBids, refreshLedger]);

  const addBids = useCallback(
    async (items: Omit<BidRecord, 'id' | 'createdAt' | 'status'>[]) => {
      if (!user || hasApiAuth) return;
      const stamped: BidRecord[] = items.map((item, i) => ({
        ...item,
        id: `${Date.now()}_${i}`,
        createdAt: Date.now(),
        status: 'pending',
      }));
      setBids((prev) => {
        const next = [...stamped, ...prev].slice(0, HISTORY_CAP);
        void AsyncStorage.setItem(
          `@geme_bids_${user.id}`,
          JSON.stringify(next)
        );
        return next;
      });
    },
    [user, hasApiAuth]
  );

  const addLedger = useCallback(
    async (entry: Omit<LedgerEntry, 'id' | 'createdAt'>) => {
      if (!user || hasApiAuth) return;
      const row: LedgerEntry = {
        ...entry,
        id: `${Date.now()}`,
        createdAt: Date.now(),
      };
      setLedger((prev) => {
        const next = [row, ...prev].slice(0, HISTORY_CAP);
        void AsyncStorage.setItem(
          `@geme_ledger_${user.id}`,
          JSON.stringify(next)
        );
        return next;
      });
    },
    [user, hasApiAuth]
  );

  const value = useMemo(
    () => ({
      bids,
      ledger,
      addBids,
      addLedger,
      refreshBids,
      refreshLedger,
    }),
    [bids, ledger, addBids, addLedger, refreshBids, refreshLedger]
  );

  return (
    <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider');
  return ctx;
}
