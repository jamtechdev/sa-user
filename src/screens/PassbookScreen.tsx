import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CrossPattern from '../components/CrossPattern';
import { PassbookIcon } from '../components/Icons';
import { useActivity, type LedgerEntry } from '../context/ActivityContext';
import { formatMoney } from '../context/WalletContext';
import { colors, fonts, shadow } from '../theme';

function formatWhen(ts: number) {
  const d = new Date(ts);
  return `${d.toLocaleDateString('en-IN')} · ${d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

function typeColor(type: LedgerEntry['type']) {
  if (type === 'deposit') return colors.live;
  if (type === 'withdraw') return colors.closed;
  return colors.gold;
}

function typeSign(type: LedgerEntry['type']) {
  if (type === 'deposit') return '+';
  return '−';
}

export default function PassbookScreen() {
  const insets = useSafeAreaInsets();
  const { ledger } = useActivity();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <CrossPattern />
      <View style={styles.header}>
        <View style={styles.badge}>
          <PassbookIcon size={20} color={colors.gold} />
        </View>
        <View>
          <Text style={styles.title}>Passbook</Text>
          <Text style={styles.sub}>Saare transactions</Text>
        </View>
      </View>

      <FlatList
        data={ledger}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Passbook empty</Text>
            <Text style={styles.emptySub}>
              Deposit, withdraw ya bid ke baad yahan dikhega
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const c = typeColor(item.type);
          return (
            <View style={styles.card}>
              <View style={styles.left}>
                <Text style={[styles.type, { color: c }]}>
                  {item.type.toUpperCase()}
                </Text>
                <Text style={styles.note}>{item.note}</Text>
                <Text style={styles.when}>{formatWhen(item.createdAt)}</Text>
              </View>
              <View style={styles.right}>
                <Text style={[styles.amount, { color: c }]}>
                  {typeSign(item.type)}
                  {formatMoney(item.amount)}
                </Text>
                <Text style={styles.bal}>
                  Bal {formatMoney(item.balanceAfter)}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: 'rgba(245,215,110,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.goldSoft,
    fontSize: 24,
    fontFamily: fonts.displayExtra,
  },
  sub: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
    marginTop: 2,
  },
  list: { paddingHorizontal: 16, paddingBottom: 100, gap: 10 },
  empty: {
    marginTop: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 18,
  },
  emptySub: {
    marginTop: 8,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: fonts.medium,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    ...shadow.card,
  },
  left: { flex: 1 },
  type: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  note: {
    marginTop: 4,
    color: colors.text,
    fontFamily: fonts.semi,
    fontSize: 14,
  },
  when: {
    marginTop: 8,
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 11,
  },
  right: { alignItems: 'flex-end' },
  amount: {
    fontFamily: fonts.displayExtra,
    fontSize: 16,
  },
  bal: {
    marginTop: 6,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 11,
  },
});
