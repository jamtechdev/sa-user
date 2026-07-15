import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import BidFooter, { useBidCart } from '../../components/BidFooter';
import GameHeader from '../../components/GameHeader';
import { DigitBoard } from '../../components/NumberGrid';
import SessionPicker from '../../components/SessionPicker';
import { DIGITS } from '../../data/panas';
import { usePlaceBids } from '../../utils/usePlaceBids';
import { colors, fonts, shadow } from '../../theme';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
};

const ODD = ['1', '3', '5', '7', '9'];
const EVEN = ['0', '2', '4', '6', '8'];

export default function SingleDigitBulkScreen(props: Props) {
  const cart = useBidCart('open');
  const place = usePlaceBids(props);

  const loadGroup = (nums: string[]) => {
    const pts = Number(cart.points);
    if (!pts || pts <= 0) {
      Alert.alert('Points', 'Pehle points bharo');
      return;
    }
    cart.setBids(
      nums.map((number) => ({
        number,
        points: pts,
        session: cart.session,
      }))
    );
  };

  return (
    <View style={styles.container}>
      <GameHeader marketName={props.marketName} gameName="Single Digit Bulk" />
      <SessionPicker
        marketId={props.marketId}
        value={cart.session}
        onChange={cart.setSession}
      />
      <Text style={styles.sub}>
        Kai single digits ek saath · group par bulk bid
      </Text>

      <View style={styles.quickRow}>
        <Pressable style={styles.quick} onPress={() => loadGroup([...DIGITS])}>
          <Text style={styles.quickText}>Sab 10</Text>
        </Pressable>
        <Pressable style={styles.quick} onPress={() => loadGroup(ODD)}>
          <Text style={styles.quickText}>Odd</Text>
        </Pressable>
        <Pressable style={styles.quick} onPress={() => loadGroup(EVEN)}>
          <Text style={styles.quickText}>Even</Text>
        </Pressable>
      </View>

      <DigitBoard
        selected={cart.isSelected}
        onToggle={cart.toggleNumber}
        accent={colors.gold}
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
  sub: {
    paddingHorizontal: 16,
    marginBottom: 10,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  quick: {
    flex: 1,
    backgroundColor: colors.goldDim,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,215,110,0.35)',
    ...shadow.soft,
  },
  quickText: {
    color: colors.gold,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
});
