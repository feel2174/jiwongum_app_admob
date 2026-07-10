import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { ARTICLES } from '../data/mock';
import { useStore } from '../lib/store';
import Header from '../components/Header';
import SubsidyCard from '../components/SubsidyCard';

export default function SearchScreen({ navigation }) {
  const t = useTheme();
  const { isBookmarked, toggleBookmark } = useStore();
  const [query, setQuery] = useState('');

  const q = query.trim();
  const list = q
    ? ARTICLES.filter(
        (x) =>
          x.title.includes(q) || x.summary.includes(q) || x.category.includes(q)
      )
    : ARTICLES;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="검색" />
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="글 검색 (예: 넷플릭스, 문화누리)"
          placeholderTextColor={t.faint}
          style={[
            styles.input,
            { backgroundColor: t.surface2, color: t.ink, borderColor: t.border },
          ]}
        />
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
  content: { padding: 14, gap: 9 },
  empty: { textAlign: 'center', fontSize: 13, lineHeight: 22, paddingTop: 50 },
});
