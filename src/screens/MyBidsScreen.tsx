import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CrossPattern from '../components/CrossPattern';
import { BidsIcon } from '../components/Icons';
import { useActivity } from '../context/ActivityContext';
import { colors, fonts, shadow } from '../theme';

function formatWhen(ts: number) {
  const d = new Date(ts);
  return `${d.toLocaleDateString('en-IN')} · ${d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export default function MyBidsScreen() {
  const insets = useSafeAreaInsets();
  const { bids } = useActivity();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <CrossPattern />
      <View style={styles.header}>
        <View style={styles.badge}>
          <BidsIcon size={20} color={colors.gold} />
        </View>
        <View>
          <Text style={styles.title}>My Bids</Text>
          <Text style={styles.sub}>{bids.length} bids placed</Text>
        </View>
      </View>

      <FlatList
        data={bids}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Abhi koi bid nahi</Text>
            <Text style={styles.emptySub}>
              Home pe market kholo · game choose karo · Bid Lagao
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.game}>{item.gameName}</Text>
              <View style={styles.status}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.market}>{item.marketName}</Text>
            <View style={styles.row}>
              <Text style={styles.num}>#{item.number}</Text>
              <Text style={styles.pts}>{item.points} pts</Text>
            </View>
            <Text style={styles.when}>{formatWhen(item.createdAt)}</Text>
          </View>
        )}
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
    ...shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  game: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 16,
  },
  status: {
    backgroundColor: colors.goldDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: colors.gold,
    fontFamily: fonts.bold,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  market: {
    marginTop: 4,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  row: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  num: {
    color: colors.goldSoft,
    fontFamily: fonts.displayExtra,
    fontSize: 22,
  },
  pts: {
    color: colors.live,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  when: {
    marginTop: 8,
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 11,
  },
});
