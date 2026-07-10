import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { SUBSIDIES, ddayOf } from '../data/mock';
import { useStore } from '../lib/store';
import Header from '../components/Header';
import SubsidyCard from '../components/SubsidyCard';

export default function SearchScreen({ navigation }) {
  const t = useTheme();
  const { isBookmarked, toggleBookmark } = useStore();
  const [query, setQuery] = useState('');
  const [onlySoon, setOnlySoon] = useState(false);

  const q = query.trim();
  const list = SUBSIDIES.filter((x) => {
    const okQ =
      !q || x.title.includes(q) || x.categories.join('').includes(q);
    const okSoon = !onlySoon || ddayOf(x.applyEnd).days <= 14;
    return okQ && okSoon;
  });

  const staticChips = ['지역', '대상', '금액'];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="검색" />
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="지원금 검색…"
          placeholderTextColor={t.faint}
          style={[
            styles.input,
            { backgroundColor: t.surface2, color: t.ink, borderColor: t.border },
          ]}
        />
      </View>
      <View style={styles.chipRow}>
        {staticChips.map((c) => (
          <View key={c} style={[styles.chip, { backgroundColor: t.surface2 }]}>
            <Text style={{ color: t.muted, fontSize: 13, fontWeight: '600' }}>{c}</Text>
          </View>
        ))}
        <Pressable
          onPress={() => setOnlySoon((v) => !v)}
          style={[styles.chip, { backgroundColor: onlySoon ? t.accent : t.surface2 }]}
        >
          <Text
            style={{ color: onlySoon ? t.onAccent : t.muted, fontSize: 13, fontWeight: '600' }}
          >
            마감임박
          </Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {list.length === 0 ? (
          <Text style={[styles.empty, { color: t.faint }]}>
            결과가 없어요.{'\n'}다른 키워드로 검색해보세요.
          </Text>
        ) : (
          list.map((item) => (
            <SubsidyCard
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
  searchWrap: { paddingHorizontal: 14, paddingTop: 10 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  chipRow: { flexDirection: 'row', gap: 7, paddingHorizontal: 14, paddingTop: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  content: { padding: 14, gap: 9 },
  empty: { textAlign: 'center', fontSize: 13, lineHeight: 22, paddingTop: 50 },
});
