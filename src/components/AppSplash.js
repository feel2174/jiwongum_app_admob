import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 코드로 그린 스플래시 — 노란 배경(네이티브 스플래시와 동일) + 네이비 코인(₩) + '어르신 지원금'.
// (네이티브 스플래시 이미지는 안드로이드 12+에서 아이콘 영역으로 잘려 텍스트가 깨지므로 코드로 렌더한다.)
export default function AppSplash() {
  return (
    <View style={styles.root}>
      <View style={styles.coin}>
        <Text style={styles.won} allowFontScaling={false}>₩</Text>
      </View>
      <Text style={styles.wordmark} allowFontScaling={false}>어르신 지원금</Text>
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
  coin: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#154c76',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  won: {
    color: '#ffd200',
    fontSize: 74,
    fontWeight: '900',
    lineHeight: 84,
  },
  wordmark: {
    color: '#10334f',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
