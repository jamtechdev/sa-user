import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useActivity } from '../context/ActivityContext';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { api } from '../api/client';
import { submitBids, type BidMeta } from './submitBids';
import type { BidLine } from '../components/BidFooter';

/** Shared bid submit — API jab auth ho, warna local */
export function usePlaceBids(meta: BidMeta) {
  const { deduct, balance, refresh } = useWallet();
  const { addBids, addLedger, refreshBids } = useActivity();
  const { hasApiAuth } = useAuth();
  const { marketId, marketName, gameId, gameName } = meta;

  return useCallback(
    async (bids: BidLine[], clear: () => void) => {
      if (hasApiAuth) {
        const total = bids.reduce((s, b) => s + b.points, 0);
        try {
          await api('/bids', {
            method: 'POST',
            body: {
              marketId,
              marketName,
              gameId,
              gameName,
              bids: bids.map((b) => ({
                number: b.number,
                points: b.points,
                session: b.session,
              })),
            },
          });
          await refresh();
          await refreshBids?.();
          Alert.alert(
            'Bid Placed',
            bids.map((b) => `${b.number}  ·  ${b.points}`).join('\n'),
            [{ text: 'OK', onPress: clear }]
          );
        } catch (err) {
          Alert.alert('Bid failed', (err as Error).message || `Need ₹${total}`);
        }
        return;
      }

      await submitBids({
        bids,
        deduct,
        clear,
        balanceBefore: balance,
        onRecord: async ({ bids: lines, total, balanceAfter }) => {
          await addBids(
            lines.map((b) => ({
              marketId,
              marketName,
              gameId,
              gameName,
              number: b.session
                ? `${b.session === 'open' ? 'OPEN' : 'CLOSE'} ${b.number}`
                : b.number,
              points: b.points,
            }))
          );
          await addLedger({
            type: 'bid',
            amount: total,
            note: `${gameName} · ${lines.length} bids`,
            balanceAfter,
          });
        },
      });
    },
    [
      addBids,
      addLedger,
      balance,
      deduct,
      gameId,
      gameName,
      hasApiAuth,
      marketId,
      marketName,
      refresh,
      refreshBids,
    ]
  );
}
