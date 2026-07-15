import { useEffect } from 'react';
import { Platform } from 'react-native';
import { TARGET_FPS } from '../theme';

/**
 * Preferred display cadence hint (90–120 Hz on supported devices).
 * No continuous RAF loop — that froze low-end Android.
 */
export function useHighRefreshRate() {
  useEffect(() => {
    if (__DEV__ && Platform.OS !== 'web') {
      // no-op log removed to avoid spam / confusion during boot
    }
  }, []);

  return TARGET_FPS;
}
