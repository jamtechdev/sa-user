import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '../theme';

export type BidSession = 'open' | 'close';

export type BidLine = {
  number: string;
  points: number;
  /** Open / Close session — for single/pana games */
  session?: BidSession;
};

type Props = {
  bids: BidLine[];
  onClear: () => void;
  onSubmit: (bids: BidLine[]) => void;
  points: string;
  onPointsChange: (v: string) => void;
  accent?: string;
};

export default function BidFooter({
  bids,
  onClear,
  onSubmit,
  points,
  onPointsChange,
  accent = colors.gold,
}: Props) {
  const insets = useSafeAreaInsets();
  const total = useMemo(
    () => bids.reduce((sum, b) => sum + b.points, 0),
    [bids]
  );

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={styles.row}>
        <View style={styles.pointsBox}>
          <Text style={styles.label}>Points</Text>
          <TextInput
            style={[styles.input, { borderColor: accent }]}
            value={points}
            onChangeText={onPointsChange}
            keyboardType="number-pad"
            placeholder="10"
            placeholderTextColor={colors.textDim}
          />
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaText}>
            Select <Text style={{ color: accent }}>{bids.length}</Text>
          </Text>
          <Text style={styles.metaText}>
            Total <Text style={{ color: colors.goldSoft }}>{total}</Text>
          </Text>
        </View>
      </View>

      {bids.length > 0 ? (
        <Text style={styles.preview} numberOfLines={2}>
          {bids
            .slice(0, 6)
            .map((b) =>
              b.session
                ? `${b.session === 'open' ? 'O' : 'C'}-${b.number}`
                : b.number
            )
            .join('  ·  ')}
          {bids.length > 6 ? ' …' : ''}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Pressable style={styles.clearBtn} onPress={onClear}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
        <Pressable
          style={[styles.submitBtn, { backgroundColor: accent }]}
          onPress={() => {
            if (!bids.length) {
              Alert.alert('Number choose karo', 'Pehle upar se number dabao');
              return;
            }
            onSubmit(bids);
          }}
        >
          <Text style={styles.submitText}>Bid Lagao</Text>
        </Pressable>
      </View>
    </View>
  );
}

function bidKey(number: string, sess?: BidSession) {
  return sess ? `${sess}:${number}` : number;
}

export function useBidCart(defaultSession: BidSession = 'open') {
  const [bids, setBids] = useState<BidLine[]>([]);
  const [points, setPoints] = useState('10');
  const [session, setSession] = useState<BidSession>(defaultSession);

  const selectedSet = useMemo(() => {
    const set = new Set<string>();
    for (const b of bids) set.add(bidKey(b.number, b.session));
    return set;
  }, [bids]);

  const toggleNumber = useCallback(
    (number: string, sess: BidSession = session) => {
      const pts = Number(points);
      if (!pts || pts <= 0) {
        Alert.alert('Points', 'Pehle points bharo (jaise 10)');
        return;
      }
      const key = bidKey(number, sess);
      setBids((prev) => {
        const existing = prev.find((b) => bidKey(b.number, b.session) === key);
        if (existing) {
          return prev.filter((b) => bidKey(b.number, b.session) !== key);
        }
        return [...prev, { number, points: pts, session: sess }];
      });
    },
    [points, session]
  );

  const clear = useCallback(() => setBids([]), []);

  const isSelected = useCallback(
    (number: string, sess: BidSession = session) =>
      selectedSet.has(bidKey(number, sess)),
    [selectedSet, session]
  );

  return {
    bids,
    points,
    setPoints,
    session,
    setSession,
    toggleNumber,
    clear,
    isSelected,
    setBids,
  };
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
    ...shadow.deep,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsBox: { flex: 1 },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 6,
    fontFamily: fonts.semi,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 20,
    fontFamily: fonts.displayExtra,
  },
  meta: { gap: 6, minWidth: 96 },
  metaText: {
    color: colors.textMuted,
    fontFamily: fonts.semi,
    fontSize: 13,
  },
  preview: {
    color: colors.goldSoft,
    fontFamily: fonts.semi,
    fontSize: 11,
    lineHeight: 16,
  },
  actions: { flexDirection: 'row', gap: 10 },
  clearBtn: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  clearText: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  submitBtn: {
    flex: 2,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    ...shadow.gold,
  },
  submitText: {
    color: colors.bg,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
