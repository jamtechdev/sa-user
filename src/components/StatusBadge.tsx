import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  status: 'live' | 'closed';
};

export default function StatusBadge({ status }: Props) {
  const live = status === 'live';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: live ? colors.liveBg : colors.closedBg,
          borderColor: live ? colors.liveBorder : colors.closedBorder,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: live ? colors.live : colors.closed },
        ]}
      />
      <Text
        style={[
          styles.text,
          { color: live ? colors.live : '#F87171' },
        ]}
      >
        {live ? 'LIVE' : 'Closed'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 0.6,
  },
});
