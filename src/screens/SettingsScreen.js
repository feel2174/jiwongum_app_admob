import React, { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { SITUATIONS, REGIONS } from '../data/mock';
import { useStore } from '../lib/store';
import { NOTIFICATION_SETTING_KEY } from '../lib/storage';
import { registerPushToken, requestPushPermission, syncPushPermission, unregisterPushToken } from '../lib/push';
import Header, { HeaderButton } from '../components/Header';

const PRIVACY_URL = 'https://workable-crowberry-292.notion.site/3993761bd6b28049b341ffc4e1002044';

// 공식 정부 출처 — 앱 정보의 원본 기관 페이지(.go.kr / .or.kr). Play 정책상 명확히 노출 필요.
const OFFICIAL_SOURCES = [
  { name: '정부24', host: 'www.gov.kr', url: 'https://www.gov.kr' },
  { name: '복지로 (복지서비스 통합)', host: 'www.bokjiro.go.kr', url: 'https://www.bokjiro.go.kr' },
  { name: '기초연금 (보건복지부)', host: 'basicpension.mohw.go.kr', url: 'https://basicpension.mohw.go.kr' },
  { name: '국민연금공단', host: 'www.nps.or.kr', url: 'https://www.nps.or.kr' },
  { name: '국민건강보험공단', host: 'www.nhis.or.kr', url: 'https://www.nhis.or.kr' },
  { name: '대한민국 정책브리핑', host: 'www.korea.kr', url: 'https://www.korea.kr' },
];

function Toggle({ on, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tg, { backgroundColor: on ? '#295f48' : '#ded8cc' }]}>
      <View style={[styles.knob, { left: on ? 24 : 4 }]} />
    </Pressable>
  );
}

export default function SettingsScreen({ route, navigation }) {
  const { profile, updateProfile, settings, setSetting } = useStore();
  const notifOn = !!settings[NOTIFICATION_SETTING_KEY];
  const showBack = route?.params?.showBack ?? true;

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      if (notifOn) {
        (async () => {
          const enabled = await syncPushPermission({ requestIfNeeded: false });
          if (mounted && !enabled) setSetting(NOTIFICATION_SETTING_KEY, false);
        })();
      }

      return () => {
        mounted = false;
      };
    }, [notifOn, setSetting]),
  );

  const toggleSit = (k) => {
    const next = profile.situations.includes(k)
      ? profile.situations.filter((x) => x !== k)
      : [...profile.situations, k];
    updateProfile({ situations: next });
  };

  const showPermissionHelp = () => {
    Alert.alert(
      '알림 권한이 필요해요',
      '기기 설정에서 이 앱의 알림을 허용하면 새 글 알림을 받을 수 있어요.',
      [
        { text: '나중에', style: 'cancel' },
        { text: '설정 열기', onPress: () => Linking.openSettings() },
      ],
    );
  };

  const onToggleNotif = async () => {
    if (!notifOn) {
      const granted = await requestPushPermission();
      if (!granted) {
        setSetting(NOTIFICATION_SETTING_KEY, false);
        showPermissionHelp();
        return;
      }

      setSetting(NOTIFICATION_SETTING_KEY, true);
      await registerPushToken({ requestPermission: false });
      return;
    }

    setSetting(NOTIFICATION_SETTING_KEY, false);
    await unregisterPushToken();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <Header
        title="설정"
        left={showBack ? <HeaderButton label="←" onPress={() => navigation.goBack()} /> : null}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>시니어 혜택 알림 설정</Text>
          <Text style={styles.heroTitle}>필요한 소식만 편하게 받아보세요</Text>
          <Text style={styles.heroText}>
            홈 화면은 시니어 혜택 페이지로 바로 연결되고, 알림은 새 지원금과 생활 안내 소식을 받을 때만 사용됩니다.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>공식 정부 사이트 바로가기</Text>
          <Text style={styles.cardSub}>
            이 앱은 공식 앱이 아닌 안내 서비스이며, 제공 정보는 참고용입니다. 정확한 내용과 신청은 아래 공식 기관에서 확인하세요.
          </Text>
          {OFFICIAL_SOURCES.map((s, i) => (
            <Pressable
              key={s.url}
              onPress={() => WebBrowser.openBrowserAsync(s.url)}
              style={[styles.linkRow, i === 0 && styles.linkRowFirst]}
            >
              <View style={styles.linkTextWrap}>
                <Text style={styles.rowLabel}>{s.name}</Text>
                <Text style={styles.rowUrl}>{s.host}</Text>
              </View>
              <Text style={styles.rowArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconText}>🔔</Text>
            </View>
            <View style={styles.notifText}>
              <Text style={styles.cardTitle}>새 소식 알림</Text>
              <Text style={styles.cardSub}>
                새 글이나 중요한 혜택 안내가 있을 때 알려드려요. 원하지 않으면 언제든 끌 수 있습니다.
              </Text>
            </View>
            <Toggle on={notifOn} onPress={onToggleNotif} />
          </View>
          <Text style={[styles.statusText, notifOn ? styles.statusOn : styles.statusOff]}>
            {notifOn ? '알림이 켜져 있습니다.' : '알림이 꺼져 있습니다.'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>관심 상황</Text>
          <Text style={styles.cardSub}>기타 화면에서 지원금 목록을 볼 때 참고되는 선택입니다.</Text>
          <View style={styles.chips}>
            {SITUATIONS.map((s) => {
              const on = profile.situations.includes(s.key);
              return (
                <Pressable
                  key={s.key}
                  onPress={() => toggleSit(s.key)}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{s.emoji} {s.key}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>지역</Text>
          <Text style={styles.cardSub}>사는 지역을 고르면 관련 지원금 확인에 도움이 됩니다.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionRow}>
            {REGIONS.map((r) => {
              const on = profile.region === r;
              return (
                <Pressable
                  key={r}
                  onPress={() => updateProfile({ region: r })}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{r}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>정보</Text>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)} style={styles.row}>
            <Text style={styles.rowLabel}>개인정보처리방침</Text>
            <Text style={styles.rowArrow}>›</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f2ea' },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  heroCard: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#173c2d',
  },
  kicker: { color: '#ffd99a', fontSize: 13, fontWeight: '800', marginBottom: 8 },
  heroTitle: { color: '#fffdf8', fontSize: 23, lineHeight: 30, fontWeight: '800' },
  heroText: { color: 'rgba(255,253,248,0.82)', fontSize: 15, lineHeight: 22, marginTop: 10 },
  card: {
    borderWidth: 1,
    borderColor: '#ded8cc',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#fffdf8',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f0e0',
  },
  iconText: { fontSize: 20 },
  cardTitle: { color: '#1f2a24', fontSize: 18, fontWeight: '800' },
  cardSub: { color: '#66736a', fontSize: 14, lineHeight: 20, marginTop: 5, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ded8cc',
    backgroundColor: '#f6f2ea',
  },
  chipOn: { backgroundColor: '#295f48', borderColor: '#295f48' },
  chipText: { color: '#66736a', fontSize: 14, fontWeight: '700' },
  chipTextOn: { color: '#fffdf8' },
  regionRow: { gap: 8, paddingVertical: 2, paddingRight: 16 },
  notifText: { flex: 1 },
  statusText: {
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '800',
  },
  statusOn: { color: '#295f48', backgroundColor: '#e9f3eb' },
  statusOff: { color: '#8d3f4f', backgroundColor: '#f7e9ed' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 },
  rowLabel: { color: '#1f2a24', fontSize: 15, fontWeight: '700' },
  rowArrow: { color: '#66736a', fontSize: 22 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: '#efe9dd',
  },
  linkRowFirst: { borderTopWidth: 0 },
  linkTextWrap: { flex: 1 },
  rowUrl: { color: '#3a7a5c', fontSize: 13, fontWeight: '600', marginTop: 3 },
  tg: { width: 50, height: 30, borderRadius: 16, justifyContent: 'center' },
  knob: { position: 'absolute', top: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
});
