import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// 코드로 그린 스플래시 — 신규 브랜드 후보(지원금 살펴줌) 전용.
// (네이티브 스플래시 이미지는 안드로이드 12+에서 아이콘 영역으로 잘려 텍스트가 깨지므로 코드로 렌더한다.)
// rebrand 플래그가 꺼진 프로덕션(§Phase3 미승인)에서는 아무것도 그리지 않고
// app.config.js가 이미 올려둔 구브랜드 네이티브 스플래시에 맡긴다.
const REBRAND = !!Constants.expoConfig?.extra?.rebrand;

export default function AppSplash() {
  if (!REBRAND) return null;

  return (
    <View style={styles.root}>
      <View style={styles.coin}>
        <Text style={styles.won} allowFontScaling={false}>₩</Text>
      </View>
      <Text style={styles.wordmark} allowFontScaling={false}>지원금 살펴줌</Text>
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
    backgroundColor: '#295f48',
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
    color: '#173c2d',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
