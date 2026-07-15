import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GAMES } from '../data/markets';
import CrossPattern from '../components/CrossPattern';
import {
  DoubleDigitIcon,
  DoublePanaIcon,
  JodiIcon,
  PanaFamilyIcon,
  SingleDigitIcon,
  SinglePanaIcon,
} from '../components/Icons';
import { formatMoney, useWallet } from '../context/WalletContext';
import { colors, fonts, shadow } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'Games'>;

function GameIcon({ id, color }: { id: string; color: string }) {
  switch (id) {
    case 'single-digit':
    case 'bulk':
      return <SingleDigitIcon color={color} size={36} />;
    case 'double-digit':
    case 'two-digit-pana':
      return <DoubleDigitIcon color={color} size={36} />;
    case 'jodi':
    case 'full-sangam':
    case 'half-sangam':
      return <JodiIcon color={color} size={36} />;
    case 'single-pana':
      return <SinglePanaIcon color={color} size={36} />;
    case 'double-pana':
      return <DoublePanaIcon color={color} size={36} />;
    case 'triple-pana':
      return <SinglePanaIcon color={color} size={36} />;
    default:
      return <PanaFamilyIcon color={color} size={36} />;
  }
}

export default function GamesScreen({ route, navigation }: Props) {
  const { marketId, marketName } = route.params;
  const { balance } = useWallet();

  return (
    <View style={styles.root}>
      <CrossPattern />

      <Animated.View entering={FadeInDown.duration(360)} style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>Market</Text>
          <Text style={styles.market} numberOfLines={1}>
            {marketName}
          </Text>
        </View>
        <View style={styles.wallet}>
          <Text style={styles.walletLabel}>Wallet</Text>
          <Text style={styles.walletAmt}>{formatMoney(balance)}</Text>
        </View>
      </Animated.View>

      <FlatList
        data={GAMES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                navigation.navigate('GamePlay', {
                  marketId,
                  marketName,
                  gameId: item.id,
                  gameName: item.name,
                })
              }
            >
              <View style={styles.glow} />
              <View style={[styles.iconBox, { borderColor: `${item.tint}66` }]}>
                <View
                  style={[styles.iconInner, { backgroundColor: `${item.tint}22` }]}
                >
                  <GameIcon id={item.icon} color={item.tint} />
                </View>
              </View>

              <Text style={styles.name}>{item.name}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadow.gold,
  },
  kicker: {
    color: colors.gold,
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  market: {
    color: colors.text,
    fontSize: 18,
    fontFamily: fonts.displayExtra,
    marginTop: 2,
  },
  wallet: {
    backgroundColor: colors.bg,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(245,215,110,0.28)',
    alignItems: 'flex-end',
  },
  walletLabel: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.semi,
  },
  walletAmt: {
    color: colors.goldSoft,
    fontFamily: fonts.bold,
    fontSize: 14,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 14,
    paddingBottom: 36,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  cell: {
    flex: 1,
    ...shadow.deep,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    minHeight: 148,
    overflow: 'hidden',
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    borderColor: 'rgba(245,215,110,0.5)',
    backgroundColor: colors.cardHover,
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245,215,110,0.07)',
    top: -30,
    right: -20,
  },
  iconBox: {
    width: 76,
    height: 76,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: colors.bg,
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.displaySemi,
    textAlign: 'center',
  },
});
