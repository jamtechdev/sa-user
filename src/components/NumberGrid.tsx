import React, { memo, useCallback, useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, fonts } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  data: string[];
  columns?: number;
  selected: (value: string) => boolean;
  onToggle: (value: string) => void;
  accent?: string;
  /** Extra horizontal padding outside grid */
  pad?: number;
  gap?: number;
  /** When false, renders a non-scrolling wrap grid (for nested lists) */
  scrollEnabled?: boolean;
};

type CellProps = {
  label: string;
  size: number;
  isOn: boolean;
  accent: string;
  onPress: () => void;
};

const Cell = memo(function Cell({
  label,
  size,
  isOn,
  accent,
  onPress,
}: CellProps) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.94, { damping: 16, stiffness: 420 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 380 });
      }}
      onPress={onPress}
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          borderRadius: Math.max(12, size * 0.22),
          backgroundColor: isOn ? accent : colors.card,
          borderColor: isOn ? accent : 'rgba(255,255,255,0.08)',
        },
        isOn && styles.cellOn,
        anim,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: isOn ? colors.bg : colors.text,
            fontSize: size > 64 ? 26 : size > 52 ? 18 : 15,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
});

function StaticGrid({
  data,
  columns,
  cell,
  gap,
  pad,
  selected,
  onToggle,
  accent,
}: {
  data: string[];
  columns: number;
  cell: number;
  gap: number;
  pad: number;
  selected: (value: string) => boolean;
  onToggle: (value: string) => void;
  accent: string;
}) {
  return (
    <View style={[styles.staticGrid, { paddingHorizontal: pad, gap }]}>
      {data.map((item) => (
        <Cell
          key={item}
          label={item}
          size={cell}
          isOn={selected(item)}
          accent={accent}
          onPress={() => onToggle(item)}
        />
      ))}
    </View>
  );
}

/**
 * Even number board — every tile same size (fixes uneven digit layout).
 */
export default function NumberGrid({
  data,
  columns = 5,
  selected,
  onToggle,
  accent = colors.gold,
  pad = 16,
  gap = 10,
  scrollEnabled = true,
}: Props) {
  const screenW = Dimensions.get('window').width;
  const cell = Math.floor((screenW - pad * 2 - gap * (columns - 1)) / columns);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <Cell
        label={item}
        size={cell}
        isOn={selected(item)}
        accent={accent}
        onPress={() => onToggle(item)}
      />
    ),
    [accent, cell, onToggle, selected]
  );

  if (!scrollEnabled) {
    return (
      <StaticGrid
        data={data}
        columns={columns}
        cell={cell}
        gap={gap}
        pad={pad}
        selected={selected}
        onToggle={onToggle}
        accent={accent}
      />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item}
      numColumns={columns}
      contentContainerStyle={{
        paddingHorizontal: pad,
        paddingTop: 8,
        paddingBottom: 20,
      }}
      columnWrapperStyle={{
        gap,
        marginBottom: gap,
      }}
      showsVerticalScrollIndicator={false}
      initialNumToRender={columns * 6}
      maxToRenderPerBatch={columns * 4}
      windowSize={5}
      removeClippedSubviews
      extraData={data.length}
      renderItem={renderItem}
      ListFooterComponent={<View style={{ height: 4 }} />}
      getItemLayout={(_d, index) => {
        const row = Math.floor(index / columns);
        const rowH = cell + gap;
        return { length: rowH, offset: rowH * row, index };
      }}
    />
  );
}

/** Fixed 2-row board for 0–9 (even, large, beginner-friendly) */
export function DigitBoard({
  selected,
  onToggle,
  accent = colors.gold,
}: {
  selected: (v: string) => boolean;
  onToggle: (v: string) => void;
  accent?: string;
}) {
  const digits = useMemo(
    () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    []
  );
  const screenW = Dimensions.get('window').width;
  const pad = 20;
  const gap = 12;
  const cols = 5;
  const cell = Math.floor((screenW - pad * 2 - gap * (cols - 1)) / cols);

  return (
    <View style={[styles.board, { paddingHorizontal: pad }]}>
      <View style={[styles.boardRow, { gap }]}>
        {digits.slice(0, 5).map((d) => (
          <Cell
            key={d}
            label={d}
            size={cell}
            isOn={selected(d)}
            accent={accent}
            onPress={() => onToggle(d)}
          />
        ))}
      </View>
      <View style={[styles.boardRow, { gap, marginTop: gap }]}>
        {digits.slice(5).map((d) => (
          <Cell
            key={d}
            label={d}
            size={cell}
            isOn={selected(d)}
            accent={accent}
            onPress={() => onToggle(d)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  cellOn: {
    borderWidth: 2,
  },
  label: {
    fontFamily: fonts.displayExtra,
    textAlign: 'center',
    includeFontPadding: false,
  },
  board: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 12,
  },
  boardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  staticGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 4,
    paddingBottom: 8,
  },
});
