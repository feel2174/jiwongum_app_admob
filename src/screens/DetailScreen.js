import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, shadow } from '../theme';
import { formatDate } from '../data/mock';
import { related, findArticle } from '../lib/reco';
import { recordDetailView } from '../lib/adManager';
import { openExternal } from '../lib/openLink';
import { useStore } from '../lib/store';
import Header, { HeaderButton } from '../components/Header';

export default function DetailScreen({ route, navigation }) {
  const t = useTheme();
  const { id } = route.params;
  const { isBookmarked, toggleBookmark, articles } = useStore();
  const item = findArticle(articles, id);

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
  const recos = related(articles, item, 3);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header
        title="지원금 상세"
        left={<HeaderButton label="←" onPress={() => navigation.goBack()} />}
        right={<HeaderButton label={marked ? '★' : '☆'} color={marked ? t.amber : t.faint} onPress={() => toggleBookmark(item.id)} />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: t.accentSoft }]}>
            <Text style={{ color: t.accent, fontSize: 12, fontWeight: '700' }}>{item.category}</Text>
          </View>
          {item.situations.map((s) => (
            <View key={s} style={[styles.tag, { backgroundColor: t.surface2 }]}>
              <Text style={{ color: t.muted, fontSize: 12, fontWeight: '600' }}>{s}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.title, { color: t.ink }]}>{item.title}</Text>
        <Text style={[styles.meta, { color: t.faint }]}>{formatDate(item.date)}</Text>
        <Text style={[styles.summary, { color: t.muted }]}>{item.summary}</Text>

        <Pressable
          onPress={() => openExternal(item.url)}
          style={({ pressed }) => [styles.cta, shadow, { backgroundColor: t.accent, opacity: pressed ? 0.92 : 1 }]}
        >
          <Text style={{ color: t.onAccent, fontWeight: '700', fontSize: 15 }}>자세히 보기  →</Text>
        </Pressable>
        <Text style={[styles.note, { color: t.faint }]}>탭하면 해당 글로 이동합니다.</Text>

        {recos.length > 0 && (
          <View style={styles.reco}>
            <Text style={[styles.recoTitle, { color: t.ink }]}>이런 지원금도</Text>
            {recos.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => navigation.push('Detail', { id: r.id })}
                style={[styles.recoItem, { backgroundColor: t.card, borderColor: t.border }]}
              >
                <View style={[styles.recoTag, { backgroundColor: t.accentSoft }]}>
                  <Text style={{ color: t.accent, fontSize: 10, fontWeight: '700' }}>{r.category}</Text>
                </View>
                <Text style={[styles.recoName, { color: t.ink }]} numberOfLines={1}>{r.title}</Text>
                <Text style={{ color: t.faint, fontSize: 16 }}>›</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  title: { fontSize: 22, fontWeight: '800', lineHeight: 30, letterSpacing: -0.3 },
  meta: { fontSize: 12.5, marginTop: -4 },
  summary: { fontSize: 15, lineHeight: 23 },
  cta: { marginTop: 6, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  note: { fontSize: 11.5, textAlign: 'center', marginTop: -4 },
  reco: { marginTop: 18, gap: 9 },
  recoTitle: { fontSize: 16, fontWeight: '750', marginBottom: 2 },
  recoItem: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 13 },
  recoTag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  recoName: { flex: 1, fontSize: 13.5, fontWeight: '600' },
});
