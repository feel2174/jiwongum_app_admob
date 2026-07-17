import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, shadow } from '../theme';
import { useStore } from '../lib/store';
import { openContent } from '../lib/openLink';
import Header from '../components/Header';
import NewsSection from '../components/NewsSection';

export default function BreakingNewsScreen({ navigation }) {
  const t = useTheme();
  const { breakingNews } = useStore();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#f6f2ea' }}>
      <Header title="기타" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.heroCard, shadow]}>
          <Text style={styles.kicker}>빠른 소식</Text>
          <Text style={styles.title}>지금 확인할 속보를 모았습니다</Text>
          <Text style={styles.body}>
            주요 소식을 간단히 확인하고, 필요한 경우 원문으로 이동해 자세히 볼 수 있습니다.
          </Text>
        </View>

        <NewsSection items={breakingNews} onPressItem={(n) => openContent(navigation, n.url, '속보')} />

        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>확인 팁</Text>
          <Text style={styles.guideBody}>
            제목을 누르면 원문으로 이동합니다. 지원금, 복지, 건강, 생활 관련 소식은 홈 화면의 시니어 혜택과 함께 확인해보세요.
          </Text>
        </View>

        {breakingNews.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: t.card, borderColor: t.border }]}>
            <Text style={[styles.emptyTitle, { color: t.ink }]}>표시할 속보가 없습니다</Text>
            <Text style={[styles.emptyBody, { color: t.muted }]}>잠시 후 다시 확인해주세요.</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  heroCard: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#173c2d',
  },
  kicker: { color: '#ffd99a', fontSize: 13, fontWeight: '800', marginBottom: 8 },
  title: { color: '#fffdf8', fontSize: 23, lineHeight: 30, fontWeight: '800' },
  body: { color: 'rgba(255,253,248,0.82)', fontSize: 15, lineHeight: 22, marginTop: 10 },
  empty: { borderWidth: 1, borderRadius: 12, padding: 18 },
  emptyTitle: { fontSize: 17, fontWeight: '800' },
  emptyBody: { fontSize: 14, marginTop: 5 },
  guideCard: {
    borderWidth: 1,
    borderColor: '#ded8cc',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#fffdf8',
  },
  guideTitle: { color: '#295f48', fontSize: 17, fontWeight: '800' },
  guideBody: { color: '#66736a', fontSize: 14, lineHeight: 21, marginTop: 6 },
});
