import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function Chips({ items, value, onChange }) {
  const t = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((c) => {
        const on = value === c;
        return (
          <Pressable
            key={c}
            onPress={() => onChange(c)}
            style={[
              styles.chip,
              { backgroundColor: on ? t.accent : t.surface2 },
            ]}
          >
            <Text style={{ color: on ? t.onAccent : t.muted, fontSize: 13, fontWeight: '600' }}>
              {c}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 7, paddingHorizontal: 14, paddingVertical: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
});
