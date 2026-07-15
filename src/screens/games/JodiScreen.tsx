import React from 'react';
import { StyleSheet, View } from 'react-native';
import BidFooter, { useBidCart } from '../../components/BidFooter';
import GameHeader from '../../components/GameHeader';
import NumberGrid from '../../components/NumberGrid';
import { JODIS } from '../../data/panas';
import { usePlaceBids } from '../../utils/usePlaceBids';
import { colors } from '../../theme';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
};

export default function JodiScreen(props: Props) {
  const cart = useBidCart();
  const place = usePlaceBids(props);

  return (
    <View style={styles.container}>
      <GameHeader marketName={props.marketName} gameName="Jodi" />
      <NumberGrid
        data={JODIS}
        columns={5}
        selected={cart.isSelected}
        onToggle={cart.toggleNumber}
        accent={colors.gold}
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
});
