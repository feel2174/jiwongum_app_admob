import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { NEWS } from '../data/mock';

export default function NewsSection({ onPressItem }) {
  const t = useTheme();
  return (
    <View style={[styles.sec, { backgroundColor: t.card, borderColor: t.border }]}>
      <View style={styles.head}>
        <View style={styles.headLeft}>
          <View style={[styles.live, { backgroundColor: t.danger }]} />
          <Text style={[styles.headTitle, { color: t.danger }]}>속보 · 정책 뉴스</Text>
        </View>
      </View>
      {NEWS.map((n, i) => (
        <Pressable
          key={n.id}
          onPress={() => onPressItem(n)}
          style={[styles.item, i > 0 && { borderTopWidth: 1, borderTopColor: t.line }]}
        >
          <View style={styles.itemTop}>
            <View
              style={[
                styles.tag,
                { backgroundColor: n.tag === '속보' ? t.danger : t.surface2 },
              ]}
            >
              <Text
                style={{
                  fontSize: 9.5,
                  fontWeight: '700',
                  color: n.tag === '속보' ? '#fff' : t.muted,
                }}
              >
                {n.tag}
              </Text>
            </View>
            <Text style={[styles.itemTitle, { color: t.ink }]}>{n.title}</Text>
          </View>
          <Text style={[styles.itemMeta, { color: t.faint }]}>
            {n.source} · {n.time}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sec: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, paddingBottom: 6 },
  head: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 4 },
  headLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  live: { width: 7, height: 7, borderRadius: 4 },
  headTitle: { fontSize: 12, fontWeight: '700' },
  item: { paddingVertical: 9, gap: 3 },
  itemTop: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 1 },
  itemTitle: { flex: 1, fontSize: 12.5, fontWeight: '600', lineHeight: 17 },
  itemMeta: { fontSize: 10, marginLeft: 42 },
});
