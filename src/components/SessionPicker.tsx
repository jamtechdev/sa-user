import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BidSession } from './BidFooter';
import {
  getMarketSessionGate,
  type MarketSessionGate,
} from '../utils/marketSession';
import { colors, fonts, shadow } from '../theme';

type Props = {
  marketId: string;
  value: BidSession;
  onChange: (v: BidSession) => void;
};

function useLiveGate(marketId: string): MarketSessionGate {
  const [gate, setGate] = useState(() => getMarketSessionGate(marketId));

  useEffect(() => {
    const tick = () => setGate(getMarketSessionGate(marketId));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [marketId]);

  return gate;
}

export default function SessionPicker({ marketId, value, onChange }: Props) {
  const gate = useLiveGate(marketId);

  useEffect(() => {
    if (gate.forced && value !== gate.forced) {
      onChange(gate.forced);
    }
  }, [gate.forced, value, onChange]);

  const pick = (s: BidSession) => {
    if (s === 'open' && !gate.openEnabled) return;
    if (s === 'close' && !gate.closeEnabled) return;
    onChange(s);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Session</Text>
      <View style={styles.row}>
        <Pressable
          disabled={!gate.openEnabled}
          style={[
            styles.btn,
            value === 'open' && gate.openEnabled && styles.btnOn,
            !gate.openEnabled && styles.btnDisabled,
          ]}
          onPress={() => pick('open')}
        >
          <Text
            style={[
              styles.btnText,
              value === 'open' && gate.openEnabled && styles.btnTextOn,
              !gate.openEnabled && styles.btnTextDisabled,
            ]}
          >
            Open
          </Text>
        </Pressable>
        <Pressable
          disabled={!gate.closeEnabled}
          style={[
            styles.btn,
            value === 'close' && gate.closeEnabled && styles.btnOn,
            !gate.closeEnabled && styles.btnDisabled,
          ]}
          onPress={() => pick('close')}
        >
          <Text
            style={[
              styles.btnText,
              value === 'close' && gate.closeEnabled && styles.btnTextOn,
              !gate.closeEnabled && styles.btnTextDisabled,
            ]}
          >
            Close
          </Text>
        </Pressable>
      </View>
      <Text style={styles.hint}>{gate.hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 14,
    marginBottom: 10,
  },
  title: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 11,
    marginBottom: 8,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    ...shadow.soft,
  },
  btnOn: {
    backgroundColor: colors.gold,
    borderColor: colors.goldSoft,
    ...shadow.gold,
  },
  btnDisabled: {
    opacity: 0.35,
    backgroundColor: colors.bgElevated,
  },
  btnText: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  btnTextOn: {
    color: colors.bg,
    fontFamily: fonts.displayExtra,
  },
  btnTextDisabled: {
    color: colors.textDim,
  },
  hint: {
    marginTop: 8,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 16,
  },
});
