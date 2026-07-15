import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BidFooter, { useBidCart, type BidLine } from '../../components/BidFooter';
import GameHeader from '../../components/GameHeader';
import PanaSearchInput from '../../components/PanaSearchInput';
import {
  CHART_DOUBLE_PANAS,
  CHART_SINGLE_PANAS,
  CHART_TRIPLE_PANAS,
} from '../../data/panaCharts';
import { DIGITS } from '../../data/panas';
import { usePlaceBids } from '../../utils/usePlaceBids';
import { colors, fonts, shadow } from '../../theme';

export type SangamMode = 'full' | 'half-a' | 'half-b';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
  mode: SangamMode;
};

const ALL_CHART_PANAS = Array.from(
  new Set([...CHART_SINGLE_PANAS, ...CHART_DOUBLE_PANAS, ...CHART_TRIPLE_PANAS])
);

function isPana(p: string) {
  return ALL_CHART_PANAS.includes(p.padStart(3, '0'));
}

export default function SangamScreen(props: Props) {
  const cart = useBidCart();
  const place = usePlaceBids(props);
  const [openPana, setOpenPana] = useState('');
  const [closePana, setClosePana] = useState('');
  const [openDigit, setOpenDigit] = useState('');
  const [closeDigit, setCloseDigit] = useState('');

  const title =
    props.mode === 'full'
      ? 'Full Sangam'
      : props.mode === 'half-a'
        ? 'Half Sangam (A)'
        : 'Half Sangam (B)';

  /** Half A = Open Pana + Close Digit · Half B = Open Digit + Close Pana */
  const subtitle =
    props.mode === 'full'
      ? 'Open Pana + Close Pana (dono sahi)'
      : props.mode === 'half-a'
        ? 'Open Pana + Close Single Digit'
        : 'Open Single Digit + Close Pana';

  const addCombo = () => {
    const pts = Number(cart.points);
    if (!pts || pts <= 0) {
      Alert.alert('Points', 'Pehle points bharo');
      return;
    }

    let label = '';
    if (props.mode === 'full') {
      const open = openPana.trim().padStart(3, '0');
      const close = closePana.trim().padStart(3, '0');
      if (!isPana(open) || !isPana(close)) {
        Alert.alert('Invalid', 'Open & Close dono valid pana hone chahiye');
        return;
      }
      label = `${open}-${close}`;
    } else if (props.mode === 'half-a') {
      const open = openPana.trim().padStart(3, '0');
      const close = closeDigit.trim();
      if (!isPana(open) || !/^[0-9]$/.test(close)) {
        Alert.alert('Invalid', 'Open Pana + Close Digit (0–9) chahiye');
        return;
      }
      label = `${open}-${close}`;
    } else {
      const open = openDigit.trim();
      const close = closePana.trim().padStart(3, '0');
      if (!/^[0-9]$/.test(open) || !isPana(close)) {
        Alert.alert('Invalid', 'Open Digit (0–9) + Close Pana chahiye');
        return;
      }
      label = `${open}-${close}`;
    }

    cart.setBids((prev: BidLine[]) => {
      if (prev.some((b) => b.number === label)) {
        return prev.filter((b) => b.number !== label);
      }
      return [...prev, { number: label, points: pts }];
    });
    setOpenPana('');
    setClosePana('');
    setOpenDigit('');
    setCloseDigit('');
  };

  const digitChoices = useMemo(() => DIGITS, []);

  const DigitPicker = ({
    value,
    onPick,
    label,
  }: {
    value: string;
    onPick: (d: string) => void;
    label: string;
  }) => (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.digitRow}>
        {digitChoices.map((d) => {
          const on = value === d;
          return (
            <Pressable
              key={d}
              onPress={() => onPick(d)}
              style={[styles.digit, on && styles.digitOn]}
            >
              <Text style={[styles.digitText, on && styles.digitTextOn]}>
                {d}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <GameHeader marketName={props.marketName} gameName={title} />
      <Text style={styles.sub}>{subtitle}</Text>

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollInner}
      >
        {(props.mode === 'full' || props.mode === 'half-a') && (
          <View style={styles.block}>
            <Text style={styles.label}>Open Pana</Text>
            <PanaSearchInput
              value={openPana}
              onChange={setOpenPana}
              pool={ALL_CHART_PANAS}
              placeholder="e.g. 257"
            />
          </View>
        )}

        {props.mode === 'half-b' && (
          <DigitPicker
            value={openDigit}
            onPick={setOpenDigit}
            label="Open Single Digit"
          />
        )}

        {(props.mode === 'full' || props.mode === 'half-b') && (
          <View style={styles.block}>
            <Text style={styles.label}>Close Pana</Text>
            <PanaSearchInput
              value={closePana}
              onChange={setClosePana}
              pool={ALL_CHART_PANAS}
              placeholder="e.g. 368"
            />
          </View>
        )}

        {props.mode === 'half-a' && (
          <DigitPicker
            value={closeDigit}
            onPick={setCloseDigit}
            label="Close Single Digit"
          />
        )}

        <Pressable style={styles.addBtn} onPress={addCombo}>
          <Text style={styles.addText}>Combo Add</Text>
        </Pressable>

        {cart.bids.length > 0 ? (
          <View style={styles.list}>
            {cart.bids.map((b) => (
              <Pressable
                key={b.number}
                style={styles.chip}
                onPress={() =>
                  cart.setBids((prev) =>
                    prev.filter((x) => x.number !== b.number)
                  )
                }
              >
                <Text style={styles.chipText}>
                  {b.number} · {b.points}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>

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
  sub: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: colors.goldSoft,
    fontFamily: fonts.semi,
    fontSize: 13,
  },
  scroll: { flex: 1 },
  scrollInner: { paddingBottom: 20 },
  block: { marginBottom: 12 },
  label: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  digitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 14,
  },
  digit: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitOn: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  digitText: {
    color: colors.text,
    fontFamily: fonts.displayExtra,
    fontSize: 18,
  },
  digitTextOn: { color: colors.bg },
  addBtn: {
    marginHorizontal: 14,
    marginTop: 8,
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadow.gold,
  },
  addText: { color: colors.bg, fontFamily: fonts.bold, fontSize: 15 },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  chip: {
    backgroundColor: colors.goldDim,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(245,215,110,0.35)',
  },
  chipText: {
    color: colors.goldSoft,
    fontFamily: fonts.bold,
    fontSize: 12,
  },
});
