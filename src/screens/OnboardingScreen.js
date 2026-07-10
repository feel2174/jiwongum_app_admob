import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, shadow } from '../theme';
import { SITUATIONS, REGIONS } from '../data/mock';
import { useStore } from '../lib/store';

export default function OnboardingScreen() {
  const t = useTheme();
  const { completeOnboarding } = useStore();
  const [sits, setSits] = useState([]);
  const [region, setRegion] = useState('전국');

  const toggle = (k) =>
    setSits((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={styles.head}>
        <Pressable hitSlop={10} onPress={() => completeOnboarding([], '전국')} style={styles.skip}>
          <Text style={{ color: t.faint, fontSize: 14 }}>건너뛰기</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.title, { color: t.ink }]}>어떤 지원금을{'\n'}찾고 계세요?</Text>
        <Text style={[styles.sub, { color: t.muted }]}>해당되는 상황을 모두 골라주세요. 맞춤으로 추천해드려요.</Text>

        <View style={styles.grid}>
          {SITUATIONS.map((s) => {
            const on = sits.includes(s.key);
            return (
              <Pressable
                key={s.key}
                onPress={() => toggle(s.key)}
                style={[
                  styles.sit,
                  shadow,
                  {
                    backgroundColor: on ? t.accentSoft : t.card,
                    borderColor: on ? t.accent : t.border,
                  },
                ]}
              >
                <Text style={styles.emoji}>{s.emoji}</Text>
                <Text style={[styles.sitLabel, { color: on ? t.accent : t.ink }]}>{s.key}</Text>
                {on ? <Text style={[styles.check, { color: t.accent }]}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.regionTitle, { color: t.ink }]}>내 지역</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionRow}>
          {REGIONS.map((r) => {
            const on = region === r;
            return (
              <Pressable
                key={r}
                onPress={() => setRegion(r)}
                style={[styles.regionChip, { backgroundColor: on ? t.accent : t.surface2 }]}
              >
                <Text style={{ color: on ? t.onAccent : t.muted, fontSize: 14, fontWeight: '600' }}>{r}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: t.bg, borderTopColor: t.line }]}>
        <Pressable
          onPress={() => completeOnboarding(sits, region)}
          style={({ pressed }) => [styles.cta, { backgroundColor: t.accent, opacity: pressed ? 0.92 : 1 }]}
        >
          <Text style={{ color: t.onAccent, fontSize: 16, fontWeight: '700' }}>
            {sits.length > 0 ? `맞춤 지원금 보기 (${sits.length})` : '시작하기'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  head: { height: 44, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 18 },
  skip: { padding: 6 },
  body: { paddingHorizontal: 20, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', lineHeight: 37, letterSpacing: -0.5 },
  sub: { fontSize: 14.5, lineHeight: 21, marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 22 },
  sit: {
    width: '47%', flexGrow: 1, borderWidth: 1.5, borderRadius: 16, paddingVertical: 18,
    paddingHorizontal: 14, alignItems: 'center', gap: 6,
  },
  emoji: { fontSize: 30 },
  sitLabel: { fontSize: 14.5, fontWeight: '700' },
  check: { position: 'absolute', top: 10, right: 12, fontSize: 15, fontWeight: '800' },
  regionTitle: { fontSize: 16, fontWeight: '700', marginTop: 26, marginBottom: 10 },
  regionRow: { gap: 8, paddingRight: 20 },
  regionChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20 },
  footer: { padding: 16, borderTopWidth: 1 },
  cta: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
});
