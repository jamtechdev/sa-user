import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import BidFooter, { useBidCart } from '../../components/BidFooter';
import GameHeader from '../../components/GameHeader';
import GroupedPanaList from '../../components/GroupedPanaList';
import PanaSearchInput from '../../components/PanaSearchInput';
import SessionPicker from '../../components/SessionPicker';
import type { PanaAnkSection } from '../../data/panaCharts';
import {
  CHART_DOUBLE_PANAS,
  CHART_SINGLE_PANAS,
  CHART_TRIPLE_PANAS,
  DOUBLE_PANA_BY_ANK,
  filterChartSections,
  SINGLE_PANA_BY_ANK,
  TRIPLE_PANA_BY_ANK,
} from '../../data/panaCharts';
import { usePlaceBids } from '../../utils/usePlaceBids';
import { colors, fonts } from '../../theme';

type PanaKind = 'single' | 'double' | 'triple';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
  kind: PanaKind;
};

const CONFIG: Record<
  PanaKind,
  {
    sections: PanaAnkSection[];
    pool: string[];
    total: number;
    invalidMsg: string;
    isValid: (p: string) => boolean;
    columns: number;
  }
> = {
  single: {
    sections: SINGLE_PANA_BY_ANK,
    pool: CHART_SINGLE_PANAS,
    total: 120,
    invalidMsg: 'Ye Single Pana chart me nahi hai',
    isValid: (p) => CHART_SINGLE_PANAS.includes(p),
    columns: 4,
  },
  double: {
    sections: DOUBLE_PANA_BY_ANK,
    pool: CHART_DOUBLE_PANAS,
    total: 94,
    invalidMsg: 'Ye Double Pana chart me nahi hai',
    isValid: (p) => CHART_DOUBLE_PANAS.includes(p),
    columns: 4,
  },
  triple: {
    sections: TRIPLE_PANA_BY_ANK,
    pool: CHART_TRIPLE_PANAS,
    total: 10,
    invalidMsg: 'Ye Triple Pana chart me nahi hai',
    isValid: (p) => CHART_TRIPLE_PANAS.includes(p),
    columns: 3,
  },
};

export default function ChartPanaScreen(props: Props) {
  const cfg = CONFIG[props.kind];
  const cart = useBidCart('open');
  const place = usePlaceBids(props);
  const [query, setQuery] = useState('');

  const sections = useMemo(
    () => filterChartSections(cfg.sections, query),
    [cfg.sections, query]
  );

  const addFromQuery = (raw?: string) => {
    const code = (raw ?? query).trim().padStart(3, '0');
    if (!/^\d{3}$/.test(code)) {
      Alert.alert('Galat', '3 digit pana likho');
      return;
    }
    if (!cfg.isValid(code)) {
      Alert.alert('Invalid', cfg.invalidMsg);
      return;
    }
    cart.toggleNumber(code);
    setQuery('');
  };

  return (
    <View style={styles.container}>
      <GameHeader
        marketName={props.marketName}
        gameName={props.gameName}
      />

      <SessionPicker
        marketId={props.marketId}
        value={cart.session}
        onChange={cart.setSession}
      />

      <PanaSearchInput
        value={query}
        onChange={setQuery}
        pool={cfg.pool}
        placeholder="Type pana number…"
        onSelect={(p) => addFromQuery(p)}
      />

      {query.length > 0 ? (
        <Pressable style={styles.addBtn} onPress={() => addFromQuery()}>
          <Text style={styles.addText}>Add {query.padStart(3, '0')}</Text>
        </Pressable>
      ) : null}

      <Text style={styles.meta}>
        {query ? `${sections.reduce((n, s) => n + s.panas.length, 0)} match` : cfg.total}{' '}
        · grouped 0 → 9
      </Text>

      <View style={styles.listWrap}>
        <GroupedPanaList
          sections={sections}
          selected={cart.isSelected}
          onToggle={cart.toggleNumber}
          columns={cfg.columns}
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
  addBtn: {
    alignSelf: 'flex-start',
    marginLeft: 14,
    marginBottom: 6,
    backgroundColor: colors.goldDim,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(245,215,110,0.35)',
  },
  addText: { color: colors.gold, fontFamily: fonts.bold, fontSize: 12 },
  meta: {
    paddingHorizontal: 16,
    marginBottom: 4,
    color: colors.textMuted,
    fontFamily: fonts.semi,
    fontSize: 12,
  },
  listWrap: { flex: 1 },
});
