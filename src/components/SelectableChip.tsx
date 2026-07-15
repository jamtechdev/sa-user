import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, fonts } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
};

export default function SelectableChip({
  label,
  selected,
  onPress,
  color = colors.gold,
  style,
  size = 'md',
}: Props) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const dim = size === 'sm' ? 52 : size === 'lg' ? 76 : 60;

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 350 });
      }}
      onPress={onPress}
      style={[
        styles.base,
        {
          width: dim,
          height: dim,
          borderColor: selected ? color : colors.cardBorder,
          backgroundColor: selected ? color : colors.card,
        },
        animStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: selected ? colors.bg : colors.text,
            fontSize: size === 'lg' ? 20 : 14,
          },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.bold,
  },
});
