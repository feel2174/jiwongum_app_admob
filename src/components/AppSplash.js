import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 코드로 그린 스플래시 — 노란 배경 + 검정 'Senior Support' 텍스트.
// (네이티브 스플래시 이미지는 안드로이드 12+에서 아이콘 영역으로 잘려 텍스트가 깨지므로 코드로 렌더한다.)
export default function AppSplash() {
  return (
    <View style={styles.root}>
      <Text style={styles.text} allowFontScaling={false}>Senior Support</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fee500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#111111',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
