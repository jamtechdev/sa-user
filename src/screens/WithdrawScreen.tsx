import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CrossPattern from '../components/CrossPattern';
import { WithdrawIcon } from '../components/Icons';
import { useActivity } from '../context/ActivityContext';
import { formatMoney, useWallet } from '../context/WalletContext';
import { colors, fonts } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'Withdraw'>;

const QUICK = [100, 500, 1000, 2000];

export default function WithdrawScreen({ navigation }: Props) {
  const { balance, withdraw } = useWallet();
  const { addLedger, refreshLedger } = useActivity();
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  const onWithdraw = async () => {
    const n = Number(amount);
    setBusy(true);
    const err = await withdraw(n);
    setBusy(false);
    if (err) {
      Alert.alert('Withdraw', err);
      return;
    }
    await addLedger({
      type: 'withdraw',
      amount: n,
      note: 'Wallet withdraw',
      balanceAfter: balance - n,
    });
    await refreshLedger();
    Alert.alert('Success', `Withdrawn ${formatMoney(n)}`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <CrossPattern />
      <View style={styles.hero}>
        <WithdrawIcon size={36} color={colors.gold} />
        <Text style={styles.title}>Withdraw</Text>
        <Text style={styles.balance}>Available {formatMoney(balance)}</Text>
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor={colors.textDim}
      />

      <View style={styles.quick}>
        {QUICK.map((q) => (
          <Pressable
            key={q}
            style={[styles.chip, amount === String(q) && styles.chipOn]}
            onPress={() => setAmount(String(q))}
          >
            <Text style={[styles.chipText, amount === String(q) && styles.chipTextOn]}>
              ₹{q}
            </Text>
          </Pressable>
        ))}
        <Pressable
          style={[styles.chip, amount === String(balance) && styles.chipOn]}
          onPress={() => setAmount(String(balance))}
        >
          <Text
            style={[
              styles.chipText,
              amount === String(balance) && styles.chipTextOn,
            ]}
          >
            All
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}
        onPress={onWithdraw}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color={colors.bg} />
        ) : (
          <Text style={styles.btnText}>Withdraw</Text>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 20,
  },
  hero: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  title: {
    marginTop: 10,
    fontSize: 22,
    fontFamily: fonts.displaySemi,
    color: colors.text,
  },
  balance: {
    marginTop: 4,
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.semi,
    marginBottom: 8,
    fontSize: 12,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: 'rgba(232,184,74,0.4)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    fontFamily: fonts.displaySemi,
    color: colors.text,
  },
  quick: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  chip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipOn: {
    borderColor: 'rgba(232,184,74,0.45)',
    backgroundColor: colors.goldDim,
  },
  chipText: { color: colors.textMuted, fontFamily: fonts.semi },
  chipTextOn: { color: colors.gold },
  btn: {
    marginTop: 28,
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: { color: colors.bg, fontFamily: fonts.bold, fontSize: 16 },
});
