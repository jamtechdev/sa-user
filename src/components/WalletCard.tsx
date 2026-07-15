import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DepositIcon, WalletIcon, WithdrawIcon } from './Icons';
import { formatMoney, useWallet } from '../context/WalletContext';
import { colors, fonts, shadow } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function WalletCard() {
  const { balance } = useWallet();
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <View style={styles.glow} />
        <View style={styles.top}>
          <View style={styles.iconWrap}>
            <WalletIcon size={24} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Aapka Wallet</Text>
            <Text style={styles.amount}>{formatMoney(balance)}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.btn, styles.deposit, pressed && styles.pressed]}
            onPress={() => navigation.navigate('Deposit')}
          >
            <DepositIcon size={20} color={colors.live} />
            <Text style={[styles.btnText, { color: colors.live }]}>Paise daalo</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.btn, styles.withdraw, pressed && styles.pressed]}
            onPress={() => navigation.navigate('Withdraw')}
          >
            <WithdrawIcon size={20} color={colors.gold} />
            <Text style={[styles.btnText, { color: colors.gold }]}>Nikaalo</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 22,
    ...shadow.gold,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(240,193,74,0.28)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(240,193,74,0.12)',
    top: -50,
    right: -30,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(240,193,74,0.4)',
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.semi,
  },
  amount: {
    color: colors.goldSoft,
    fontSize: 34,
    fontFamily: fonts.displayExtra,
    marginTop: 2,
    letterSpacing: -0.8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 13,
    borderWidth: 1,
  },
  deposit: {
    backgroundColor: colors.liveBg,
    borderColor: colors.liveBorder,
  },
  withdraw: {
    backgroundColor: colors.goldDim,
    borderColor: 'rgba(240,193,74,0.4)',
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  btnText: {
    fontFamily: fonts.bold,
    fontSize: 14,
  },
});
