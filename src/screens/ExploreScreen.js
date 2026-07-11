import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, shadow } from '../theme';
import { SITUATIONS, CATEGORIES } from '../data/mock';
import { countBySituation } from '../lib/reco';
import { useStore } from '../lib/store';
import Header from '../components/Header';
import SectionHeader from '../components/SectionHeader';

export default function ExploreScreen({ navigation }) {
  const t = useTheme();
  const { articles } = useStore();
  const cats = CATEGORIES.filter((c) => c !== '전체');

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="탐색" />
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader title="상황별 모아보기" />
        <View style={styles.grid}>
          {SITUATIONS.map((s) => (
            <Pressable
              key={s.key}
              onPress={() => navigation.navigate('Collection', { type: 'situation', value: s.key, title: s.key + ' 지원금' })}
              style={[styles.coll, shadow, { backgroundColor: t.card, borderColor: t.border }]}
            >
              <Text style={styles.emoji}>{s.emoji}</Text>
              <Text style={[styles.collT, { color: t.ink }]}>{s.key}</Text>
              <Text style={[styles.collC, { color: t.faint }]}>{countBySituation(articles, s.key)}개</Text>
            </Pressable>
          ))}
        </View>

        <SectionHeader title="카테고리" />
        <View style={styles.catWrap}>
          {cats.map((c) => (
            <Pressable
              key={c}
              onPress={() => navigation.navigate('Collection', { type: 'category', value: c, title: c })}
              style={[styles.catRow, { backgroundColor: t.card, borderColor: t.border }]}
            >
              <Text style={[styles.catT, { color: t.ink }]}>{c}</Text>
              <Text style={{ color: t.faint, fontSize: 18 }}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11, marginTop: 4, marginBottom: 8 },
  coll: { width: '47%', flexGrow: 1, borderWidth: 1, borderRadius: 16, paddingVertical: 18, alignItems: 'center', gap: 5 },
  emoji: { fontSize: 28 },
  collT: { fontSize: 14.5, fontWeight: '700' },
  collC: { fontSize: 12, fontWeight: '600' },
  catWrap: { gap: 9, marginTop: 4 },
  catRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 16 },
  catT: { fontSize: 15, fontWeight: '650' },
});
