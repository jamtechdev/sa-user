import React, { Suspense, lazy } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'GamePlay'>;

const SingleDigitScreen = lazy(() => import('./games/SingleDigitScreen'));
const DoubleDigitScreen = lazy(() => import('./games/DoubleDigitScreen'));
const JodiScreen = lazy(() => import('./games/JodiScreen'));
const SinglePanaScreen = lazy(() => import('./games/SinglePanaScreen'));
const DoublePanaScreen = lazy(() => import('./games/DoublePanaScreen'));
const TriplePanaScreen = lazy(() => import('./games/TriplePanaScreen'));
const PanaFamilyScreen = lazy(() => import('./games/PanaFamilyScreen'));
const SangamScreen = lazy(() => import('./games/SangamScreen'));
const SingleDigitBulkScreen = lazy(() => import('./games/SingleDigitBulkScreen'));
const PanaBulkScreen = lazy(() => import('./games/PanaBulkScreen'));
const TwoDigitPanaScreen = lazy(() => import('./games/TwoDigitPanaScreen'));

function GameFallback() {
  return (
    <View style={styles.fallback}>
      <ActivityIndicator color={colors.gold} size="large" />
    </View>
  );
}

export default function GamePlayScreen({ route }: Props) {
  const params = route.params;
  const { gameId, gameName } = params;

  let screen: React.ReactNode;
  switch (gameId) {
    case 'single-digit':
      screen = <SingleDigitScreen {...params} />;
      break;
    case 'double-digit':
      screen = <DoubleDigitScreen {...params} />;
      break;
    case 'jodi':
      screen = <JodiScreen {...params} />;
      break;
    case 'single-pana':
      screen = <SinglePanaScreen {...params} />;
      break;
    case 'double-pana':
      screen = <DoublePanaScreen {...params} />;
      break;
    case 'triple-pana':
      screen = <TriplePanaScreen {...params} />;
      break;
    case 'pana-family':
      screen = <PanaFamilyScreen {...params} />;
      break;
    case 'full-sangam':
      screen = <SangamScreen {...params} mode="full" />;
      break;
    case 'half-sangam-a':
      screen = <SangamScreen {...params} mode="half-a" />;
      break;
    case 'half-sangam-b':
      screen = <SangamScreen {...params} mode="half-b" />;
      break;
    case 'single-digit-bulk':
      screen = <SingleDigitBulkScreen {...params} />;
      break;
    case 'single-pana-bulk':
      screen = <PanaBulkScreen {...params} kind="single-pana" />;
      break;
    case 'double-pana-bulk':
      screen = <PanaBulkScreen {...params} kind="double-pana" />;
      break;
    case 'triple-pana-bulk':
      screen = <PanaBulkScreen {...params} kind="triple-pana" />;
      break;
    case 'two-digit-pana':
      screen = <TwoDigitPanaScreen {...params} />;
      break;
    default:
      screen = (
        <View style={styles.fallback}>
          <Text style={styles.title}>{gameName}</Text>
          <Text style={styles.sub}>Game screen not found</Text>
        </View>
      );
  }

  return <Suspense fallback={<GameFallback />}>{screen}</Suspense>;
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  sub: { color: colors.textMuted, marginTop: 8 },
});
