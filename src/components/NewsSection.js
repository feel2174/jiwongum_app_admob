import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

const ROW_H = 40;
const VISIBLE = 3; // 한 번에 보이는 줄 수
const DWELL_MS = 3500; // 각 줄 머무는 시간
const SLIDE_MS = 650; // 위로 한 줄 흐르는 시간

// 속보 영역 — 네이버 뉴스를 3줄 세로 티커로 표시.
// 3줄 보이며 한 줄씩 위로 자연스럽게 흐르고, 끝에서 처음으로 순환. items는 store.breakingNews.
export default function NewsSection({ items = [], onPressItem }) {
  const t = useTheme();
  const y = useRef(new Animated.Value(0)).current;
  const idx = useRef(0);
  const animate = items.length > VISIBLE;

  useEffect(() => {
    idx.current = 0;
    y.setValue(0);
    if (!animate) return;
    const timer = setInterval(() => {
      const next = idx.current + 1;
      Animated.timing(y, {
        toValue: -next * ROW_H,
        duration: SLIDE_MS,
        useNativeDriver: true,
      }).start(() => {
        if (next >= items.length) {
          idx.current = 0;
          y.setValue(0); // 끝(복제된 앞 3줄) → 실제 앞으로 순간 리셋
        } else {
          idx.current = next;
        }
      });
    }, DWELL_MS);
    return () => clearInterval(timer);
  }, [items, animate, y]);

  if (!items || items.length === 0) return null;

  // 끝에서 처음으로 매끄럽게 순환하도록 앞 VISIBLE줄을 뒤에 복제
  const rows = animate ? [...items, ...items.slice(0, VISIBLE)] : items;

  return (
    <View style={[styles.sec, { backgroundColor: t.card, borderColor: t.border }]}>
      <View style={styles.head}>
        <View style={[styles.live, { backgroundColor: t.danger }]} />
        <Text style={[styles.headTitle, { color: t.danger }]}>속보</Text>
      </View>
      <View style={[styles.window, { height: VISIBLE * ROW_H }]}>
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
  sec: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, paddingTop: 10, paddingBottom: 8 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  live: { width: 7, height: 7, borderRadius: 4 },
  headTitle: { fontSize: 12, fontWeight: '700' },
  window: { overflow: 'hidden' },
  row: { height: ROW_H, flexDirection: 'row', alignItems: 'center', gap: 9 },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 9.5, fontWeight: '700', color: '#fff' },
  title: { flex: 1, fontSize: 12.5, fontWeight: '600', lineHeight: 16 },
});
