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
import { DepositIcon } from '../components/Icons';
import { useActivity } from '../context/ActivityContext';
import { formatMoney, useWallet } from '../context/WalletContext';
import { colors, fonts } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'Deposit'>;

const QUICK = [100, 500, 1000, 2000, 5000];

export default function DepositScreen({ navigation }: Props) {
  const { balance, deposit } = useWallet();
  const { addLedger, refreshLedger } = useActivity();
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  const onDeposit = async () => {
    const n = Number(amount);
    setBusy(true);
    const err = await deposit(n);
    setBusy(false);
    if (err) {
      Alert.alert('Deposit', err);
      return;
    }
    await addLedger({
      type: 'deposit',
      amount: n,
      note: 'Wallet deposit',
      balanceAfter: balance + n,
    });
    await refreshLedger();
    Alert.alert('Success', `Deposited ${formatMoney(n)}`, [
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
        <DepositIcon size={36} color={colors.live} />
        <Text style={styles.title}>Deposit</Text>
        <Text style={styles.balance}>Balance {formatMoney(balance)}</Text>
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
      </View>

      <Pressable
        style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}
        onPress={onDeposit}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color={colors.bg} />
        ) : (
          <Text style={styles.btnText}>Add Money</Text>
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
    borderColor: colors.liveBorder,
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
    borderColor: colors.liveBorder,
    backgroundColor: colors.liveBg,
  },
  chipText: { color: colors.textMuted, fontFamily: fonts.semi },
  chipTextOn: { color: colors.live },
  btn: {
    marginTop: 28,
    backgroundColor: colors.live,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: { color: colors.bg, fontFamily: fonts.bold, fontSize: 16 },
});
