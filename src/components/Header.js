import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function Header({ title, left, right }) {
  const t = useTheme();
  return (
    <View style={[styles.bar, { borderBottomColor: t.line }]}>
      <View style={styles.side}>{left}</View>
      <Text style={[styles.title, { color: t.ink }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

export function HeaderButton({ label, onPress, color }) {
  const t = useTheme();
  return (
    <Pressable hitSlop={8} onPress={onPress}>
      <Text style={{ fontSize: 18, color: color || t.faint }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  side: { minWidth: 40, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  title: { fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'left' },
});
