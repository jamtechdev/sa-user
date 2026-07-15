import React from 'react';
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CrossPattern from '../components/CrossPattern';
import { SupportIcon } from '../components/Icons';
import { colors, fonts, shadow } from '../theme';

const WHATSAPP = 'https://wa.me/919999999999';
const TELEGRAM = 'https://t.me/sara567';
const EMAIL = 'mailto:support@sara567.com';

async function openUrl(url: string) {
  try {
    const ok = await Linking.canOpenURL(url);
    if (!ok) {
      Alert.alert('Support', 'Link open nahi ho paya');
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert('Support', 'Link open nahi ho paya');
  }
}

export default function SupportScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <CrossPattern />
      <View style={styles.header}>
        <View style={styles.badge}>
          <SupportIcon size={20} color={colors.gold} />
        </View>
        <View>
          <Text style={styles.title}>Support</Text>
          <Text style={styles.sub}>Help chahiye? Hum yahan hain</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>SARA 567 Help Desk</Text>
        <Text style={styles.heroBody}>
          Market timing, bid cancel, deposit/withdraw — team se seedha baat
          karo.
        </Text>
      </View>

      <View style={styles.list}>
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={() => openUrl(WHATSAPP)}
        >
          <View style={[styles.dot, { backgroundColor: colors.live }]} />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>WhatsApp</Text>
            <Text style={styles.rowSub}>Fast chat · 24×7</Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={() => openUrl(TELEGRAM)}
        >
          <View style={[styles.dot, { backgroundColor: colors.gold }]} />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Telegram</Text>
            <Text style={styles.rowSub}>Updates & announcements</Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={() => openUrl(EMAIL)}
        >
          <View style={[styles.dot, { backgroundColor: colors.closed }]} />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Email</Text>
            <Text style={styles.rowSub}>support@sara567.com</Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </Pressable>
      </View>

      <View style={styles.faq}>
        <Text style={styles.faqTitle}>Common</Text>
        <Text style={styles.faqItem}>
          · Bid lagane se pehle market LIVE hona chahiye
        </Text>
        <Text style={styles.faqItem}>
          · Minimum points game rules ke hisaab se
        </Text>
        <Text style={styles.faqItem}>
          · Transaction history Passbook tab me milti hai
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: 'rgba(245,215,110,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.goldSoft,
    fontSize: 24,
    fontFamily: fonts.displayExtra,
  },
  sub: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
    marginTop: 2,
  },
  hero: {
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadow.card,
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 18,
  },
  heroBody: {
    marginTop: 8,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 20,
  },
  list: {
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadow.soft,
  },
  pressed: { opacity: 0.88 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rowText: { flex: 1 },
  rowTitle: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 16,
  },
  rowSub: {
    marginTop: 2,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  chev: {
    color: colors.gold,
    fontSize: 28,
    fontFamily: fonts.displaySemi,
    lineHeight: 28,
  },
  faq: {
    marginTop: 22,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  faqTitle: {
    color: colors.gold,
    fontFamily: fonts.bold,
    fontSize: 13,
    marginBottom: 8,
  },
  faqItem: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 22,
  },
});
