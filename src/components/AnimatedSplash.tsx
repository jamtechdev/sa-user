import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import CrossPattern from './CrossPattern';
import { colors, fonts } from '../theme';

type Props = {
  onFinish: () => void;
};

export default function AnimatedSplash({ onFinish }: Props) {
  const finished = useRef(false);
  const logoScale = useSharedValue(0.75);
  const logoOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.65);
  const ringOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(16);
  const tagOpacity = useSharedValue(0);
  const barWidth = useSharedValue(0);
  const rootOpacity = useSharedValue(1);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onFinish();
  };

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 400 });
    logoScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    ringOpacity.value = withDelay(120, withTiming(1, { duration: 400 }));
    ringScale.value = withDelay(
      120,
      withSequence(
        withTiming(1.06, { duration: 500 }),
        withTiming(1, { duration: 300 })
      )
    );
    titleOpacity.value = withDelay(280, withTiming(1, { duration: 350 }));
    titleY.value = withDelay(280, withTiming(0, { duration: 400 }));
    tagOpacity.value = withDelay(400, withTiming(1, { duration: 350 }));
    barWidth.value = withDelay(
      300,
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) })
    );

    // Always finish via JS timer — Reanimated callbacks can miss on some Android/Expo Go builds
    const fadeTimer = setTimeout(() => {
      rootOpacity.value = withTiming(0, { duration: 350 });
    }, 1800);
    const doneTimer = setTimeout(finish, 2200);
    const safetyTimer = setTimeout(finish, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      clearTimeout(safetyTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: rootOpacity.value,
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value * 0.9,
    transform: [{ scale: ringScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const tagStyle = useAnimatedStyle(() => ({
    opacity: tagOpacity.value,
  }));
  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: Math.max(barWidth.value, 0.02) }],
  }));

  return (
    <Animated.View style={[styles.root, wrapStyle]} pointerEvents="box-none">
      <CrossPattern />
      <View style={styles.center}>
        <View style={styles.logoStage}>
          <Animated.View style={[styles.ring, ringStyle]} />
          <Animated.View style={logoStyle}>
            <Image
              source={require('../../assets/brand-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.title, titleStyle]}>SARA 567</Animated.Text>
        <Animated.Text style={[styles.tag, tagStyle]}>
          Official Matka App
        </Animated.Text>

        <View style={styles.track}>
          <Animated.View style={[styles.fill, barStyle]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoStage: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  ring: {
    position: 'absolute',
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 2,
    borderColor: 'rgba(232,184,74,0.45)',
  },
  logo: {
    width: 168,
    height: 168,
  },
  title: {
    color: colors.gold,
    fontSize: 34,
    fontFamily: fonts.displayExtra,
    letterSpacing: 3,
  },
  tag: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: fonts.medium,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  track: {
    marginTop: 36,
    height: 3,
    width: 160,
    borderRadius: 3,
    backgroundColor: colors.cardBorder,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
});
