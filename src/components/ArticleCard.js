import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, shadow } from '../theme';
import { formatDate } from '../data/mock';

export default function ArticleCard({ item, onPress, bookmarked, onToggleBookmark, matchLabel }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadow,
        { backgroundColor: t.card, borderColor: t.border, transform: [{ scale: pressed ? 0.99 : 1 }] },
      ]}
    >
      <View style={styles.top}>
        <View style={[styles.tag, { backgroundColor: t.accentSoft }]}>
          <Text style={{ color: t.accent, fontSize: 11, fontWeight: '700' }}>{item.category}</Text>
        </View>
        {matchLabel ? (
          <View style={[styles.match, { backgroundColor: t.okSoft }]}>
            <Text style={{ color: t.ok, fontSize: 11, fontWeight: '700' }}>✓ {matchLabel}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.title, { color: t.ink }]} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={[styles.summary, { color: t.muted }]} numberOfLines={2}>
        {item.summary}
      </Text>
      <View style={styles.footer}>
        <Text style={[styles.date, { color: t.faint }]}>{formatDate(item.date)}</Text>
        <Pressable
          hitSlop={10}
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleBookmark(item.id);
          }}
        >
          <Text style={{ fontSize: 18, color: bookmarked ? t.amber : t.faint }}>
            {bookmarked ? '★' : '☆'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 15, gap: 8 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tag: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  match: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  title: { fontSize: 15.5, fontWeight: '700', lineHeight: 21 },
  summary: { fontSize: 13, lineHeight: 18 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  date: { fontSize: 12 },
});
