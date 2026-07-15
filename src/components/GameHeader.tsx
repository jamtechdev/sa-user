import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  marketName: string;
  gameName: string;
  accent?: string;
};

export default function GameHeader({
  marketName,
  gameName,
  accent = colors.gold,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.bar, { backgroundColor: accent }]} />
      <Text style={styles.game}>{gameName}</Text>
      <Text style={[styles.market, { color: accent }]}>{marketName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  bar: {
    height: 3,
    width: 40,
    borderRadius: 3,
    marginBottom: 10,
  },
  game: {
    color: colors.text,
    fontSize: 24,
    fontFamily: fonts.displayExtra,
  },
  market: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: fonts.semi,
  },
});
