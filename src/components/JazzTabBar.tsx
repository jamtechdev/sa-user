import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BidsIcon,
  FundsIcon,
  HomeIcon,
  PassbookIcon,
  SupportIcon,
} from './Icons';
import { colors, fonts, shadow } from '../theme';

const LABELS: Record<string, string> = {
  MyBids: 'My Bids',
  Passbook: 'Passbook',
  Home: 'Home',
  Funds: 'Funds',
  Support: 'Support',
};

function TabGlyph({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) {
  switch (name) {
    case 'MyBids':
      return <BidsIcon color={color} size={size} />;
    case 'Passbook':
      return <PassbookIcon color={color} size={size} />;
    case 'Home':
      return <HomeIcon color={color} size={size} />;
    case 'Funds':
      return <FundsIcon color={color} size={size} />;
    default:
      return <SupportIcon color={color} size={size} />;
  }
}

/** Jazzy floating center Home + gold active tabs */
export default function JazzTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = LABELS[route.name] ?? options.title ?? route.name;
          const isHome = route.name === 'Home';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isHome) {
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.homeSlot}
              >
                <View style={[styles.homeBtn, focused && styles.homeBtnOn]}>
                  <HomeIcon
                    size={26}
                    color={focused ? colors.bg : colors.gold}
                  />
                </View>
                <Text style={[styles.homeLabel, focused && styles.labelOn]}>
                  Home
                </Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.item}
            >
              <View style={[styles.iconWrap, focused && styles.iconWrapOn]}>
                <TabGlyph
                  name={route.name}
                  color={focused ? colors.gold : colors.textDim}
                  size={22}
                />
              </View>
              <Text style={[styles.label, focused && styles.labelOn]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245,215,110,0.22)',
    ...shadow.deep,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingTop: 8,
    minHeight: 62,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingBottom: 4,
  },
  iconWrap: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  iconWrapOn: {
    backgroundColor: colors.goldDim,
  },
  label: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.semi,
  },
  labelOn: {
    color: colors.gold,
    fontFamily: fonts.bold,
  },
  homeSlot: {
    flex: 1,
    alignItems: 'center',
    marginTop: -22,
  },
  homeBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.gold,
  },
  homeBtnOn: {
    backgroundColor: colors.gold,
    borderColor: colors.goldSoft,
  },
  homeLabel: {
    marginTop: 4,
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.semi,
  },
});
