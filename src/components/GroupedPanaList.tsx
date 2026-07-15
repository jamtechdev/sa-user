import React, { memo, useCallback, useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import type { PanaAnkSection } from '../data/panaCharts';
import NumberGrid from './NumberGrid';
import { colors, fonts } from '../theme';

type Props = {
  sections: PanaAnkSection[];
  selected: (value: string) => boolean;
  onToggle: (value: string) => void;
  columns?: number;
};

type Row = {
  title: string;
  ank: number;
  panas: string[];
};

const SectionHeader = memo(function SectionHeader({
  ank,
  title,
  count,
}: {
  ank: number;
  title: string;
  count: number;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{ank}</Text>
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
});

export default function GroupedPanaList({
  sections,
  selected,
  onToggle,
  columns = 4,
}: Props) {
  const data = useMemo(
    () =>
      sections.map((s) => ({
        title: s.title,
        ank: s.ank,
        data: [{ panas: s.panas, title: s.title, ank: s.ank } as Row],
      })),
    [sections]
  );

  const renderItem = useCallback(
    ({ item }: { item: Row }) => (
      <NumberGrid
        data={item.panas}
        columns={columns}
        selected={selected}
        onToggle={onToggle}
        pad={14}
        gap={8}
        scrollEnabled={false}
      />
    ),
    [columns, onToggle, selected]
  );

  return (
    <SectionList
      style={styles.flex}
      sections={data}
      keyExtractor={(item) => `${item.ank}-${item.title}`}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      initialNumToRender={4}
      maxToRenderPerBatch={3}
      windowSize={5}
      removeClippedSubviews
      renderSectionHeader={({ section }) => (
        <SectionHeader
          ank={section.ank}
          title={section.title}
          count={section.data[0].panas.length}
        />
      )}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: colors.bg,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.bg,
    fontFamily: fonts.displayExtra,
    fontSize: 14,
  },
  headerTitle: {
    flex: 1,
    color: colors.goldSoft,
    fontFamily: fonts.displaySemi,
    fontSize: 15,
  },
  count: {
    color: colors.textMuted,
    fontFamily: fonts.semi,
    fontSize: 12,
  },
});
