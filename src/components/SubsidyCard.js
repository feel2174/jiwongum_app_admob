import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { ddayOf } from '../data/mock';

export default function SubsidyCard({ item, onPress, bookmarked, onToggleBookmark }) {
  const t = useTheme();
  const dd = ddayOf(item.applyEnd);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: t.card, borderColor: t.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <Text style={[styles.title, { color: t.ink }]}>{item.title}</Text>
      <View style={styles.row}>
        <Text style={[styles.meta, { color: t.faint }]}>
          {item.categories[0]} · {item.region}
        </Text>
        <View style={styles.right}>
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
          <View
            style={[
              styles.dday,
              { backgroundColor: dd.soft ? t.surface2 : t.danger },
            ]}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: dd.soft ? t.muted : '#fff',
              }}
            >
              {dd.label}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, padding: 13, gap: 8 },
  title: { fontSize: 14.5, fontWeight: '600', lineHeight: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { fontSize: 12 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dday: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
});
