import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import BidFooter, { useBidCart } from '../../components/BidFooter';
import GameHeader from '../../components/GameHeader';
import GroupedPanaList from '../../components/GroupedPanaList';
import PanaSearchInput from '../../components/PanaSearchInput';
import SessionPicker from '../../components/SessionPicker';
import type { PanaAnkSection } from '../../data/panaCharts';
import {
  CHART_SINGLE_PANAS,
  CHART_TRIPLE_PANAS,
  SINGLE_PANA_BY_ANK,
  TRIPLE_PANA_BY_ANK,
  filterChartSections,
} from '../../data/panaCharts';
import { generateDoublePanas, getPanaAnk } from '../../data/panas';
import { usePlaceBids } from '../../utils/usePlaceBids';
import { colors, fonts, shadow } from '../../theme';

export type PanaBulkKind = 'single-pana' | 'double-pana' | 'triple-pana';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
  kind: PanaBulkKind;
  titleOverride?: string;
  subOverride?: string;
};

/** Pure 90 DP — no triple panas (Two Digit Pana / DP Bulk rule). */
const PURE_DOUBLE_PANAS = generateDoublePanas();

function buildPureDpSections(): PanaAnkSection[] {
  const byAnk: string[][] = Array.from({ length: 10 }, () => []);
  for (const p of PURE_DOUBLE_PANAS) {
    byAnk[getPanaAnk(p)].push(p);
  }
  return byAnk.map((panas, ank) => ({
    ank,
    title: `${ank} Double Pana`,
    panas: panas.sort(),
  }));
}

const PURE_DP_SECTIONS = buildPureDpSections();

const CONFIG: Record<
  PanaBulkKind,
  {
    title: string;
    sub: string;
    sections: PanaAnkSection[];
    pool: string[];
    total: number;
    allLabel: string;
  }
> = {
  'single-pana': {
    title: 'Single Pana Bulk',
    sub: '120 SP · poore set ya group par bulk',
    sections: SINGLE_PANA_BY_ANK,
    pool: CHART_SINGLE_PANAS,
    total: 120,
    allLabel: 'Sab 120 SP',
  },
  'double-pana': {
    title: 'Double Pana Bulk',
    sub: '90 DP · do same digit wale pana',
    sections: PURE_DP_SECTIONS,
    pool: PURE_DOUBLE_PANAS,
    total: 90,
    allLabel: 'Sab 90 DP',
  },
  'triple-pana': {
    title: 'Triple Pana Bulk',
    sub: '10 TP · teen same digits',
    sections: TRIPLE_PANA_BY_ANK,
    pool: CHART_TRIPLE_PANAS,
    total: 10,
    allLabel: 'Sab 10 TP',
  },
};

export default function PanaBulkScreen(props: Props) {
  const cfg = CONFIG[props.kind];
  const cart = useBidCart('open');
  const place = usePlaceBids(props);
  const [query, setQuery] = useState('');

  const sections = useMemo(
    () => filterChartSections(cfg.sections, query),
    [cfg.sections, query]
  );

  const loadAll = () => {
    const pts = Number(cart.points);
    if (!pts || pts <= 0) {
      Alert.alert('Points', 'Pehle points bharo');
      return;
    }
    cart.setBids(
      cfg.pool.map((number) => ({
        number,
        points: pts,
        session: cart.session,
      }))
    );
  };

  const loadAnk = (ank: number) => {
    const pts = Number(cart.points);
    if (!pts || pts <= 0) {
      Alert.alert('Points', 'Pehle points bharo');
      return;
    }
    const group = cfg.sections.find((s) => s.ank === ank);
    if (!group) return;
    cart.setBids(
      group.panas.map((number) => ({
        number,
        points: pts,
        session: cart.session,
      }))
    );
  };

  return (
    <View style={styles.container}>
      <GameHeader
        marketName={props.marketName}
        gameName={props.titleOverride ?? cfg.title}
      />
      <SessionPicker
        marketId={props.marketId}
        value={cart.session}
        onChange={cart.setSession}
      />
      <Text style={styles.sub}>{props.subOverride ?? cfg.sub}</Text>

      <PanaSearchInput
        value={query}
        onChange={setQuery}
        pool={cfg.pool}
        placeholder="Filter pana…"
      />

      <View style={styles.actions}>
        <Pressable style={styles.allBtn} onPress={loadAll}>
          <Text style={styles.allText}>{cfg.allLabel}</Text>
        </Pressable>
        <Text style={styles.count}>
          {cart.bids.length}/{cfg.total} selected
        </Text>
      </View>

      <View style={styles.ankStrip}>
        {cfg.sections.map((s) => (
          <Pressable
            key={s.ank}
            style={styles.ankChip}
            onPress={() => loadAnk(s.ank)}
          >
            <Text style={styles.ankChipText}>{s.ank}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.listWrap}>
        <GroupedPanaList
          sections={sections}
          selected={cart.isSelected}
          onToggle={cart.toggleNumber}
          columns={props.kind === 'triple-pana' ? 3 : 4}
        />
      </View>

      <BidFooter
        bids={cart.bids}
        points={cart.points}
        onPointsChange={cart.setPoints}
        onClear={cart.clear}
        onSubmit={(bids) => place(bids, cart.clear)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  sub: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  allBtn: {
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...shadow.gold,
  },
  allText: { color: colors.bg, fontFamily: fonts.bold, fontSize: 13 },
  count: {
    color: colors.goldSoft,
    fontFamily: fonts.semi,
    fontSize: 12,
  },
  ankStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  ankChip: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ankChipText: {
    color: colors.gold,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  listWrap: { flex: 1 },
});
