import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { findArticle, formatDate } from '../data/mock';
import { recordDetailView } from '../lib/adManager';
import { openExternal } from '../lib/openLink';
import { useStore } from '../lib/store';
import Header, { HeaderButton } from '../components/Header';

export default function DetailScreen({ route, navigation }) {
  const t = useTheme();
  const { id } = route.params;
  const item = findArticle(id);
  const { isBookmarked, toggleBookmark } = useStore();

  useEffect(() => {
    recordDetailView();
  }, [id]);

  if (!item) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
        <Header title="글" left={<HeaderButton label="←" onPress={() => navigation.goBack()} />} />
        <Text style={{ color: t.faint, padding: 20 }}>정보를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const marked = isBookmarked(item.id);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header
        title="글"
        left={<HeaderButton label="←" onPress={() => navigation.goBack()} />}
        right={
          <HeaderButton
            label={marked ? '★' : '☆'}
            color={marked ? t.amber : t.faint}
            onPress={() => toggleBookmark(item.id)}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.tag, { backgroundColor: t.accentSoft }]}>
          <Text style={{ color: t.accent, fontSize: 11, fontWeight: '700' }}>{item.category}</Text>
        </View>
        <Text style={[styles.title, { color: t.ink }]}>{item.title}</Text>
        <Text style={[styles.meta, { color: t.faint }]}>
          zucca100.com · {formatDate(item.date)}
        </Text>

        <Text style={[styles.summary, { color: t.muted }]}>{item.summary}</Text>

        <Pressable
          onPress={() => openExternal(item.url)}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: t.accent, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={{ color: t.onAccent, fontWeight: '700', fontSize: 14 }}>
            자세히 보기 →
          </Text>
        </Pressable>
        <Text style={[styles.note, { color: t.faint }]}>
          탭하면 해당 글로 이동합니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  title: { fontSize: 20, fontWeight: '700', lineHeight: 28 },
  meta: { fontSize: 12 },
  summary: { fontSize: 14, lineHeight: 22, marginTop: 2 },
  cta: { marginTop: 6, borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  note: { fontSize: 11, textAlign: 'center', marginTop: 2 },
});
