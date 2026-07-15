import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BidFooter, { useBidCart } from '../../components/BidFooter';
import GameHeader from '../../components/GameHeader';
import NumberGrid from '../../components/NumberGrid';
import SessionPicker from '../../components/SessionPicker';
import {
  getCutDigit,
  getFamilyBreakdown,
  isValidPana,
  normalizePana,
} from '../../data/panas';
import { usePlaceBids } from '../../utils/usePlaceBids';
import { colors, fonts, shadow } from '../../theme';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
};

const CUT_HINT = '1↔6  2↔7  3↔8  4↔9  5↔0';

export default function PanaFamilyScreen(props: Props) {
  const cart = useBidCart('open');
  const place = usePlaceBids(props);
  const [manual, setManual] = useState('123');
  const [base, setBase] = useState('123');

  const breakdown = useMemo(() => getFamilyBreakdown(base), [base]);
  const { all, type, expectedSize, ank } = breakdown;

  const applyBase = (raw: string) => {
    const code = raw.trim();
    if (!/^\d{3}$/.test(code)) {
      Alert.alert('Galat', '3 digit pana likho (jaise 123)');
      return;
    }
    if (!isValidPana(code)) {
      Alert.alert('Invalid', 'Ye official SP/DP/TP pana nahi hai');
      return;
    }
    const n = normalizePana(code);
    setBase(n);
    setManual(n);
    cart.clear();
  };

  const selectAllFamily = () => {
    const pts = Number(cart.points);
    if (!pts || pts <= 0) {
      Alert.alert('Points', 'Pehle points bharo');
      return;
    }
    cart.setBids(
      all.map((number) => ({
        number,
        points: pts,
        session: cart.session,
      }))
    );
  };

  const cutPreview = base
    .split('')
    .map((d) => `${d}→${getCutDigit(Number(d))}`)
    .join('  ');

  return (
    <View style={styles.container}>
      <GameHeader marketName={props.marketName} gameName="Pana Family" />
      <SessionPicker
        marketId={props.marketId}
        value={cart.session}
        onChange={cart.setSession}
      />

      <Text style={styles.label}>1) Base pana (cut family nikalne ke liye)</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          value={manual}
          onChangeText={setManual}
          placeholder="e.g. 123"
          placeholderTextColor={colors.textDim}
          keyboardType="number-pad"
          maxLength={3}
        />
        <Pressable style={styles.addBtn} onPress={() => applyBase(manual)}>
          <Text style={styles.addText}>Family</Text>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLine}>
          Base <Text style={styles.gold}>{base}</Text>
          {'  ·  '}
          {type ?? '—'}
          {'  ·  '}
          Ank {ank}
        </Text>
        <Text style={styles.infoSub}>Cut: {cutPreview}</Text>
        <Text style={styles.infoSub}>{CUT_HINT}</Text>
      </View>

      <View style={styles.familyBar}>
        <Text style={styles.familyLabel}>
          Family {all.length} panas
          {all.length < expectedSize ? ` (max ${expectedSize})` : ''}
        </Text>
        <Pressable onPress={selectAllFamily} style={styles.selectAllBtn}>
          <Text style={styles.selectAll}>Sab {all.length}</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>2) Cut family members</Text>
      <NumberGrid
        data={all}
        columns={4}
        selected={cart.isSelected}
        onToggle={cart.toggleNumber}
        pad={14}
        gap={8}
      />

      <BidFooter
        bids={cart.bids}
        points={cart.points}
        onPointsChange={cart.setPoints}
        onClear={cart.clear}
        onSubmit={(bids) => place(bids, cart.clear)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  label: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    color: colors.goldSoft,
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  search: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 18,
  },
  addBtn: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    ...shadow.gold,
  },
  addText: { color: colors.bg, fontFamily: fonts.bold },
  infoCard: {
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 4,
  },
  infoLine: {
    color: colors.text,
    fontFamily: fonts.semi,
    fontSize: 14,
  },
  gold: { color: colors.goldSoft, fontFamily: fonts.displayExtra },
  infoSub: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
    marginTop: 2,
  },
  familyBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
  },
  familyLabel: { color: colors.textMuted, fontFamily: fonts.semi, fontSize: 12 },
  selectAllBtn: {
    backgroundColor: colors.goldDim,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245,215,110,0.3)',
  },
  selectAll: {
    color: colors.gold,
    fontFamily: fonts.bold,
    fontSize: 12,
  },
});
