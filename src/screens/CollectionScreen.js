import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useStore } from '../lib/store';
import { bySituation, byCategory } from '../lib/reco';
import Header, { HeaderButton } from '../components/Header';
import ArticleCard from '../components/ArticleCard';

export default function CollectionScreen({ route, navigation }) {
  const t = useTheme();
  const { type, value, title } = route.params;
  const { isBookmarked, toggleBookmark } = useStore();

  const list = type === 'situation' ? bySituation(value) : byCategory(value);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title={title} left={<HeaderButton label="←" onPress={() => navigation.goBack()} />} />
      <ScrollView contentContainerStyle={styles.content}>
        {list.length === 0 ? (
          <Text style={[styles.empty, { color: t.faint }]}>해당 지원금이 아직 없어요.</Text>
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
  content: { padding: 16, gap: 11 },
  empty: { textAlign: 'center', fontSize: 13, paddingTop: 50 },
});
