import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { SUBSIDIES, ddayOf } from '../data/mock';
import { useStore } from '../lib/store';
import Header from '../components/Header';
import SubsidyCard from '../components/SubsidyCard';

export default function SavedScreen({ navigation }) {
  const t = useTheme();
  const { bookmarks, isBookmarked, toggleBookmark } = useStore();

  const list = SUBSIDIES.filter((x) => bookmarks.includes(x.id)).sort(
    (a, b) => ddayOf(a.applyEnd).days - ddayOf(b.applyEnd).days
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="저장함" />
      <ScrollView contentContainerStyle={styles.content}>
        {list.length === 0 ? (
          <Text style={[styles.empty, { color: t.faint }]}>
            저장한 지원금이 없어요.{'\n'}관심 있는 지원금의 ☆를 눌러보세요.
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
  content: { padding: 14, gap: 9 },
  empty: { textAlign: 'center', fontSize: 13, lineHeight: 22, paddingTop: 50 },
});
