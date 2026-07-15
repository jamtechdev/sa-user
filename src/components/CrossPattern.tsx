import React, { memo, useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

const { width, height } = Dimensions.get('window');

/** Lightweight + pattern (single SVG — avoids hundreds of Views freezing Android) */
function CrossPattern() {
  const d = useMemo(() => {
    const cols = 7;
    const rows = 14;
    const gapX = width / cols;
    const gapY = Math.max(height, 700) / rows;
    const paths: string[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * gapX + gapX / 2;
        const y = r * gapY + gapY / 2;
        paths.push(`M${x - 3.5} ${y}h7M${x} ${y - 3.5}v7`);
      }
    }
    return paths.join('');
  }, []);

  return (
    <Svg
      pointerEvents="none"
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
    >
      <Path
        d={d}
        stroke={colors.pattern}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default memo(CrossPattern);
