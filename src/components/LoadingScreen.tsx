import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import CrossPattern from './CrossPattern';
import { colors, fonts } from '../theme';

export default function LoadingScreen({ label = 'Loading' }: { label?: string }) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const barScale = useSharedValue(0.25);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    barScale.value = withDelay(
      120,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.28, { duration: 900, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      )
    );
  }, [barScale, opacity, scale]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: barScale.value }],
  }));

  return (
    <View style={styles.container}>
      <CrossPattern />
      <Animated.View style={logoStyle}>
        <Image
          source={require('../../assets/brand-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Text style={styles.brand}>SARA 567</Text>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logo: { width: 120, height: 120 },
  brand: {
    marginTop: 16,
    fontSize: 28,
    fontFamily: fonts.displayExtra,
    letterSpacing: 3,
    color: colors.gold,
  },
  label: {
    marginTop: 8,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  track: {
    marginTop: 28,
    height: 3,
    width: 140,
    borderRadius: 3,
    backgroundColor: colors.cardBorder,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    width: '100%',
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
});
