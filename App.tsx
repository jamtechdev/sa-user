import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/context/AuthContext';
import { WalletProvider } from './src/context/WalletContext';
import { ActivityProvider } from './src/context/ActivityContext';
import RootNavigator from './src/navigation/RootNavigator';
import AnimatedSplash from './src/components/AnimatedSplash';
import { colors } from './src/theme';

// Keep native splash until we explicitly hide it
SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });
  const [showSplash, setShowSplash] = useState(true);
  const fontsReady = fontsLoaded || !!fontError;

  // Hide native Expo splash as soon as JS is up (don't wait forever on fonts)
  useEffect(() => {
    let cancelled = false;
    const hide = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // ignore
      }
    };

    if (fontsReady) {
      hide();
    }

    // Safety: never leave user stuck on native splash
  const t = setTimeout(() => {
      if (!cancelled) hide();
    }, 1800);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [fontsReady]);

  // Another safety if animated splash never calls back
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3200);
    return () => clearTimeout(t);
  }, []);

  if (!fontsReady) {
    return <View style={styles.boot} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <WalletProvider>
            <ActivityProvider>
              <StatusBar style="light" />
              <RootNavigator />
              {showSplash ? (
                <AnimatedSplash onFinish={() => setShowSplash(false)} />
              ) : null}
            </ActivityProvider>
          </WalletProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  boot: { flex: 1, backgroundColor: colors.bg },
});
