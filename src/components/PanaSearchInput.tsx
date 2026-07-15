import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { searchChartPanas } from '../data/panaCharts';
import { colors, fonts, shadow } from '../theme';

type Props = {
  value: string;
  onChange: (v: string) => void;
  pool: string[];
  placeholder?: string;
  onSelect?: (pana: string) => void;
  maxLength?: number;
};

export default function PanaSearchInput({
  value,
  onChange,
  pool,
  placeholder = 'Type pana…',
  onSelect,
  maxLength = 3,
}: Props) {
  const suggestions = useMemo(
    () => searchChartPanas(pool, value),
    [pool, value]
  );

  const showDropdown = value.length > 0 && suggestions.length > 0;

  const pick = (pana: string) => {
    onChange(pana);
    onSelect?.(pana);
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        keyboardType="number-pad"
        maxLength={maxLength}
        autoCorrect={false}
      />
      {showDropdown ? (
        <View style={styles.dropdown}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={styles.scroll}
          >
            {suggestions.map((p) => (
              <Pressable
                key={p}
                style={({ pressed }) => [
                  styles.row,
                  pressed && styles.rowPressed,
                ]}
                onPress={() => pick(p)}
              >
                <Text style={styles.pana}>{p}</Text>
                <Text style={styles.hint}>Tap to select</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 20,
    marginHorizontal: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: 'rgba(245,215,110,0.45)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 20,
    ...shadow.soft,
  },
  dropdown: {
    marginTop: 6,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    maxHeight: 220,
    overflow: 'hidden',
    ...shadow.card,
  },
  scroll: { maxHeight: 220 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  rowPressed: { backgroundColor: colors.goldDim },
  pana: {
    color: colors.goldSoft,
    fontFamily: fonts.displayExtra,
    fontSize: 18,
  },
  hint: {
    color: colors.textDim,
    fontFamily: fonts.medium,
    fontSize: 11,
  },
});
