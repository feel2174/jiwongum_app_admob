import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { formatDate } from '../data/mock';

// 글(article) 카드
export default function SubsidyCard({ item, onPress, bookmarked, onToggleBookmark }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: t.card, borderColor: t.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={[styles.tag, { backgroundColor: t.accentSoft }]}>
        <Text style={{ color: t.accent, fontSize: 10.5, fontWeight: '700' }}>{item.category}</Text>
      </View>
      <Text style={[styles.title, { color: t.ink }]}>{item.title}</Text>
      <Text style={[styles.summary, { color: t.muted }]} numberOfLines={2}>
        {item.summary}
      </Text>
      <View style={styles.row}>
        <Text style={[styles.meta, { color: t.faint }]}>{formatDate(item.date)}</Text>
        <Pressable
          hitSlop={8}
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleBookmark(item.id);
          }}
        >
          <Text style={{ fontSize: 16, color: bookmarked ? t.amber : t.faint }}>
            {bookmarked ? '★' : '☆'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, padding: 13, gap: 7 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  title: { fontSize: 14.5, fontWeight: '650', lineHeight: 20 },
  summary: { fontSize: 12.5, lineHeight: 18 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  meta: { fontSize: 11, fontFamily: undefined },
});
