import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

const ROW_H = 46;
const DWELL_MS = 5000; // 5초 정지
const SLIDE_MS = 550; // 아래→위 슬라이드 시간

// 속보 영역 — 네이버 뉴스(get-breaking-news)를 세로 티커로 표시.
// 한 헤드라인씩 5초 머물다 위로 흐름. items는 store.breakingNews.
export default function NewsSection({ items = [], onPressItem }) {
  const t = useTheme();
  const y = useRef(new Animated.Value(0)).current;
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    y.setValue(0);
    if (!items || items.length <= 1) return;
    const timer = setInterval(() => {
      const next = idx.current + 1;
      Animated.timing(y, {
        toValue: -next * ROW_H,
        duration: SLIDE_MS,
        useNativeDriver: true,
      }).start(() => {
        if (next >= items.length) {
          idx.current = 0;
          y.setValue(0); // 마지막(복제된 첫 항목) → 실제 첫 항목으로 순간 리셋
        } else {
          idx.current = next;
        }
      });
    }, DWELL_MS);
    return () => clearInterval(timer);
  }, [items, y]);

  if (!items || items.length === 0) return null;

  // 마지막에 첫 항목 복제 → 끝에서 처음으로 매끄럽게 순환
  const rows = items.length > 1 ? [...items, items[0]] : items;

  return (
    <View style={[styles.sec, { backgroundColor: t.card, borderColor: t.border }]}>
      <View style={styles.head}>
        <View style={[styles.live, { backgroundColor: t.danger }]} />
        <Text style={[styles.headTitle, { color: t.danger }]}>속보</Text>
      </View>
      <View style={styles.window}>
        <Animated.View style={{ transform: [{ translateY: y }] }}>
          {rows.map((n, i) => (
            <Pressable key={`${n.id}-${i}`} onPress={() => onPressItem(n)} style={styles.row}>
              <View style={[styles.tag, { backgroundColor: t.danger }]}>
                <Text style={styles.tagText}>속보</Text>
              </View>
              <Text style={[styles.title, { color: t.ink }]} numberOfLines={1}>
                {n.title}
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sec: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, paddingTop: 10, paddingBottom: 4 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 2 },
  live: { width: 7, height: 7, borderRadius: 4 },
  headTitle: { fontSize: 12, fontWeight: '700' },
  window: { height: ROW_H, overflow: 'hidden' },
  row: { height: ROW_H, flexDirection: 'row', alignItems: 'center', gap: 9 },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 9.5, fontWeight: '700', color: '#fff' },
  title: { flex: 1, fontSize: 12.5, fontWeight: '600', lineHeight: 17 },
});
