import React from 'react';
import { StyleSheet, View } from 'react-native';
import BidFooter, { useBidCart } from '../../components/BidFooter';
import GameHeader from '../../components/GameHeader';
import SessionPicker from '../../components/SessionPicker';
import { DigitBoard } from '../../components/NumberGrid';
import { usePlaceBids } from '../../utils/usePlaceBids';
import { colors } from '../../theme';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
};

export default function SingleDigitScreen(props: Props) {
  const cart = useBidCart('open');
  const place = usePlaceBids(props);

  return (
    <View style={styles.container}>
      <GameHeader marketName={props.marketName} gameName="Single Digit" />
      <SessionPicker
        marketId={props.marketId}
        value={cart.session}
        onChange={cart.setSession}
      />
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
});
