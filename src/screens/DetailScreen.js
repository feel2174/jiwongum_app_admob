import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { findSubsidy, ddayOf } from '../data/mock';
import { recordDetailView } from '../lib/adManager';
import { openExternal } from '../lib/openLink';
import { useStore } from '../lib/store';
import Header, { HeaderButton } from '../components/Header';

function Row({ label, value, danger }) {
  const t = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: t.line }]}>
      <Text style={[styles.rowLabel, { color: t.faint }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: danger ? t.danger : t.ink }]}>{value}</Text>
    </View>
  );
}

export default function DetailScreen({ route, navigation }) {
  const t = useTheme();
  const { id } = route.params;
  const item = findSubsidy(id);
  const { isBookmarked, toggleBookmark } = useStore();

  useEffect(() => {
    recordDetailView();
  }, [id]);

  if (!item) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
        <Header
          title="지원금 상세"
          left={<HeaderButton label="←" onPress={() => navigation.goBack()} />}
        />
        <Text style={{ color: t.faint, padding: 20 }}>정보를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const dd = ddayOf(item.applyEnd);
  const marked = isBookmarked(item.id);
  const period = item.applyEnd
    ? `~${item.applyEnd.slice(5).replace('-', '.')} (${dd.label})`
    : '상시';

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header
        title="지원금 상세"
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
        <Text style={[styles.title, { color: t.ink }]}>{item.title}</Text>
        <View style={styles.tags}>
          {item.categories.map((c) => (
            <View key={c} style={[styles.tag, { backgroundColor: t.accentSoft }]}>
              <Text style={{ color: t.accent, fontSize: 11, fontWeight: '600' }}>{c}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.summary, { backgroundColor: t.card, borderColor: t.border }]}>
          <Row label="대상" value={item.target} />
          <Row label="지원 금액" value={item.amount} />
          <Row label="신청 기간" value={period} danger={!dd.soft} />
          <Row label="지역" value={item.region} />
          <Row label="출처" value={item.source} />
        </View>

        {item.sections.map((s) => (
          <View key={s.h} style={styles.sec}>
            <Text style={[styles.secH, { color: t.accent }]}>{s.h}</Text>
            <Text style={[styles.secBody, { color: t.muted }]}>{s.body}</Text>
          </View>
        ))}

        <Pressable
          onPress={() => openExternal(item.sourceUrl)}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: t.accent, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={{ color: t.onAccent, fontWeight: '700', fontSize: 14 }}>
            자세히 보기 (원문) →
          </Text>
        </Pressable>
        <Text style={[styles.note, { color: t.faint }]}>
          탭하면 시스템 브라우저로 원문 페이지가 열립니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', lineHeight: 27 },
  tags: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  tag: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  summary: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 11, borderBottomWidth: 1 },
  rowLabel: { fontSize: 13 },
  rowValue: { fontSize: 13, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  sec: { gap: 3 },
  secH: { fontSize: 13, fontWeight: '700' },
  secBody: { fontSize: 13, lineHeight: 20 },
  cta: { marginTop: 4, borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  note: { fontSize: 11, textAlign: 'center', marginTop: 2 },
});
