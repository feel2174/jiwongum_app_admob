import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { ARTICLES, SITUATIONS, CATEGORIES } from '../data/mock';
import { useStore } from '../lib/store';
import Header from '../components/Header';
import ArticleCard from '../components/ArticleCard';

export default function SearchScreen({ navigation }) {
  const t = useTheme();
  const { isBookmarked, toggleBookmark } = useStore();
  const [query, setQuery] = useState('');
  const [sits, setSits] = useState([]);
  const [cat, setCat] = useState('전체');

  const toggleSit = (k) => setSits((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const q = query.trim();
  const list = ARTICLES.filter((a) => {
    const okQ = !q || a.title.includes(q) || a.summary.includes(q) || a.category.includes(q);
    const okSit = sits.length === 0 || a.situations.some((s) => sits.includes(s));
    const okCat = cat === '전체' || a.category === cat;
    return okQ && okSit && okCat;
  });

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="검색" />
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="지원금 검색 (예: 청년, 문화누리)"
          placeholderTextColor={t.faint}
          style={[styles.input, { backgroundColor: t.surface2, color: t.ink, borderColor: t.border }]}
        />
      </View>

      <View style={styles.filters}>
        <Text style={[styles.flabel, { color: t.faint }]}>상황</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {SITUATIONS.map((s) => {
            const on = sits.includes(s.key);
            return (
              <Pressable key={s.key} onPress={() => toggleSit(s.key)} style={[styles.chip, { backgroundColor: on ? t.accent : t.surface2 }]}>
                <Text style={{ color: on ? t.onAccent : t.muted, fontSize: 13, fontWeight: '600' }}>{s.emoji} {s.key}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Text style={[styles.flabel, { color: t.faint, marginTop: 8 }]}>카테고리</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {CATEGORIES.map((c) => {
            const on = cat === c;
            return (
              <Pressable key={c} onPress={() => setCat(c)} style={[styles.chip, { backgroundColor: on ? t.accent : t.surface2 }]}>
                <Text style={{ color: on ? t.onAccent : t.muted, fontSize: 13, fontWeight: '600' }}>{c}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {list.length === 0 ? (
          <Text style={[styles.empty, { color: t.faint }]}>결과가 없어요.{'\n'}필터나 키워드를 바꿔보세요.</Text>
        ) : (
          list.map((item) => (
            <ArticleCard
              key={item.id}
              item={item}
              bookmarked={isBookmarked(item.id)}
              onToggleBookmark={toggleBookmark}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: 16, paddingTop: 10 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14.5 },
  filters: { paddingTop: 10, paddingBottom: 4 },
  flabel: { fontSize: 11.5, fontWeight: '700', paddingHorizontal: 16, marginBottom: 6 },
  chipRow: { gap: 7, paddingHorizontal: 16 },
  chip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20 },
  content: { padding: 16, gap: 11 },
  empty: { textAlign: 'center', fontSize: 13, lineHeight: 22, paddingTop: 40 },
});
