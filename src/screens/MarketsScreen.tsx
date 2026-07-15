import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { MARKETS } from '../data/markets';
import { getMarketSessionGate } from '../utils/marketSession';
import WalletCard from '../components/WalletCard';
import CrossPattern from '../components/CrossPattern';
import StatusBadge from '../components/StatusBadge';
import BrandLogo from '../components/BrandLogo';
import { ChevronRightIcon, ClockIcon, LogoutIcon } from '../components/Icons';
import { colors, fonts, shadow } from '../theme';
import type { AppStackParamList, MainTabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function MarketsScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <CrossPattern />
      <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.brandRow}>
            <BrandLogo size={44} />
            <View>
              <Text style={styles.brand}>SARA 567</Text>
              <Text style={styles.tag}>Market select karke khelo</Text>
            </View>
          </View>
          <Pressable onPress={logout} style={styles.logoutBtn} hitSlop={8}>
            <LogoutIcon />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(50).duration(420)}>
          <WalletCard />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(90).duration(420)} style={styles.titleBlock}>
          <Text style={styles.heading}>Main Markets</Text>
          <Text style={styles.sub}>LIVE market pe tap karo · andar games milenge</Text>
        </Animated.View>

        <FlatList
          data={MARKETS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          windowSize={5}
          removeClippedSubviews
          renderItem={({ item }) => {
            const gate = getMarketSessionGate(item.id);
            const closed = gate.phase === 'after-close';
            const sessionLabel =
              gate.phase === 'pre-open'
                ? 'Open + Close'
                : gate.phase === 'between'
                  ? 'Close only'
                  : 'Closed';
            return (
              <View style={styles.cardShadow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.card,
                    closed && styles.cardClosed,
                    pressed && !closed && styles.cardPressed,
                  ]}
                  disabled={closed}
                  onPress={() =>
                    navigation.navigate('Games', {
                      marketId: item.id,
                      marketName: item.name,
                    })
                  }
                >
                  <View
                    style={[
                      styles.accent,
                      { backgroundColor: closed ? colors.closed : colors.gold },
                    ]}
                  />
                  <View style={styles.cardInner}>
                    <View style={styles.cardTop}>
                      <Text style={styles.name}>{item.name}</Text>
                      <StatusBadge status={closed ? 'closed' : 'live'} />
                    </View>

                    <View style={styles.times}>
                      <ClockIcon size={14} />
                      <Text style={styles.time}>
                        {item.openTime}  →  {item.closeTime}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.sessionTag,
                        closed && { color: colors.closed },
                        gate.phase === 'between' && { color: colors.gold },
                        gate.phase === 'pre-open' && { color: colors.live },
                      ]}
                    >
                      {sessionLabel}
                    </Text>

                    {!closed ? (
                      <View style={styles.ctaRow}>
                        <Text style={styles.cta}>Games kholo</Text>
                        <ChevronRightIcon size={18} color={colors.gold} />
                      </View>
                    ) : (
                      <Text style={styles.closedHint}>Abhi band hai</Text>
                    )}
                  </View>
                </Pressable>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: { flex: 1 },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brand: {
    color: colors.goldSoft,
    fontSize: 22,
    fontFamily: fonts.displayExtra,
    letterSpacing: 1,
  },
  tag: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.medium,
    marginTop: 2,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  titleBlock: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  heading: {
    color: colors.goldSoft,
    fontSize: 24,
    fontFamily: fonts.displayExtra,
  },
  sub: {
    color: colors.textDim,
    fontSize: 13,
    fontFamily: fonts.medium,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 14,
  },
  cardShadow: {
    borderRadius: 18,
    ...shadow.card,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 118,
  },
  cardClosed: {
    opacity: 0.72,
  },
  cardPressed: {
    borderColor: 'rgba(240,193,74,0.5)',
    backgroundColor: colors.cardHover,
  },
  accent: {
    width: 5,
  },
  cardInner: {
    flex: 1,
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontFamily: fonts.displaySemi,
  },
  times: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 12,
  },
  time: {
    color: colors.goldSoft,
    fontSize: 13,
    fontFamily: fonts.semi,
  },
  sessionTag: {
    marginTop: 8,
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  ctaRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cta: {
    color: colors.gold,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  closedHint: {
    marginTop: 14,
    color: colors.closed,
    fontFamily: fonts.semi,
    fontSize: 12,
  },
});
