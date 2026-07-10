import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function SectionHeader({ title, count, accent, actionLabel, onAction }) {
  const t = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={[styles.title, { color: accent ? t.accent : t.ink }]}>{title}</Text>
        {count != null ? (
          <Text style={[styles.count, { color: t.faint }]}>{count}</Text>
        ) : null}
      </View>
      {actionLabel ? (
        <Pressable hitSlop={8} onPress={onAction}>
          <Text style={{ color: t.accent, fontSize: 13, fontWeight: '600' }}>{actionLabel} ›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 2 },
  left: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  title: { fontSize: 17, fontWeight: '750', letterSpacing: -0.2 },
  count: { fontSize: 14, fontWeight: '600' },
});
