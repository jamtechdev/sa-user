import { Alert } from 'react-native';
import type { BidLine } from '../components/BidFooter';

export type BidMeta = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
};

export async function submitBids(options: {
  bids: BidLine[];
  deduct: (amount: number) => Promise<string | null>;
  clear: () => void;
  title?: string;
  meta?: BidMeta;
  balanceBefore?: number;
  onRecord?: (args: {
    bids: BidLine[];
    total: number;
    balanceAfter: number;
  }) => Promise<void> | void;
}) {
  const total = options.bids.reduce((s, b) => s + b.points, 0);
  const err = await options.deduct(total);
  if (err) {
    Alert.alert('Wallet', err);
    return;
  }

  const balanceAfter =
    typeof options.balanceBefore === 'number'
      ? options.balanceBefore - total
      : 0;

  if (options.onRecord) {
    await options.onRecord({
      bids: options.bids,
      total,
      balanceAfter,
    });
  }

  Alert.alert(
    options.title ?? 'Bid Placed',
    options.bids.map((b) => `${b.number}  ·  ${b.points}`).join('\n'),
    [{ text: 'OK', onPress: options.clear }]
  );
}
