import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CrossPattern from '../components/CrossPattern';
import {
  DepositIcon,
  FundsIcon,
  WalletIcon,
  WithdrawIcon,
} from '../components/Icons';
import { formatMoney, useWallet } from '../context/WalletContext';
import { colors, fonts, shadow } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function FundsScreen() {
  const insets = useSafeAreaInsets();
  const { balance } = useWallet();
  const navigation = useNavigation<Nav>();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <CrossPattern />
      <View style={styles.header}>
        <View style={styles.badge}>
          <FundsIcon size={20} color={colors.gold} />
        </View>
        <View>
          <Text style={styles.title}>Funds</Text>
          <Text style={styles.sub}>Wallet manage karo</Text>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.glow} />
        <View style={styles.balTop}>
          <WalletIcon size={28} color={colors.gold} />
          <View>
            <Text style={styles.balLabel}>Available balance</Text>
            <Text style={styles.balAmt}>{formatMoney(balance)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.action, styles.dep, pressed && styles.pressed]}
          onPress={() => navigation.navigate('Deposit')}
        >
          <DepositIcon size={28} color={colors.live} />
          <Text style={[styles.actionTitle, { color: colors.live }]}>
            Deposit
          </Text>
          <Text style={styles.actionSub}>Paise daalo wallet me</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.action, styles.wd, pressed && styles.pressed]}
          onPress={() => navigation.navigate('Withdraw')}
        >
          <WithdrawIcon size={28} color={colors.gold} />
          <Text style={[styles.actionTitle, { color: colors.gold }]}>
            Withdraw
          </Text>
          <Text style={styles.actionSub}>Points nikaalo</Text>
        </Pressable>
      </View>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>Quick tip</Text>
        <Text style={styles.noteBody}>
          Deposit ke baad Passbook me entry dikhegi. Bid lagane pe points
          wallet se cut hote hain.
        </Text>
      </View>
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
    marginBottom: 16,
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
  balanceCard: {
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(240,193,74,0.28)',
    overflow: 'hidden',
    ...shadow.gold,
  },
  glow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(240,193,74,0.12)',
    top: -40,
    right: -20,
  },
  balTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  balLabel: {
    color: colors.textMuted,
    fontFamily: fonts.semi,
    fontSize: 13,
  },
  balAmt: {
    marginTop: 2,
    color: colors.goldSoft,
    fontFamily: fonts.displayExtra,
    fontSize: 32,
    letterSpacing: -0.6,
  },
  actions: {
    marginTop: 18,
    paddingHorizontal: 16,
    gap: 12,
  },
  action: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    ...shadow.card,
  },
  dep: {
    borderColor: colors.liveBorder,
    backgroundColor: colors.liveBg,
  },
  wd: {
    borderColor: 'rgba(245,215,110,0.35)',
    backgroundColor: colors.goldDim,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  actionTitle: {
    marginTop: 10,
    fontFamily: fonts.displaySemi,
    fontSize: 18,
  },
  actionSub: {
    marginTop: 4,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  note: {
    marginTop: 20,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  noteTitle: {
    color: colors.gold,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  noteBody: {
    marginTop: 6,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 20,
  },
});
