import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../theme';
import { SITUATIONS, REGIONS } from '../data/mock';
import { useStore } from '../lib/store';
import { requestPushPermission, sendBreakingDemo } from '../lib/push';
import Header, { HeaderButton } from '../components/Header';

const PRIVACY_URL = 'https://workable-crowberry-292.notion.site/3993761bd6b28049b341ffc4e1002044';

function Toggle({ on, onPress }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.tg, { backgroundColor: on ? t.ok : t.surface2 }]}>
      <View style={[styles.knob, { left: on ? 21 : 3 }]} />
    </Pressable>
  );
}

export default function SettingsScreen({ navigation }) {
  const t = useTheme();
  const { profile, updateProfile, settings, toggleSetting, articles } = useStore();

  const toggleSit = (k) => {
    const next = profile.situations.includes(k)
      ? profile.situations.filter((x) => x !== k)
      : [...profile.situations, k];
    updateProfile({ situations: next });
  };

  const onTestPush = async () => {
    if (articles.length === 0) return;
    const ok = await requestPushPermission();
    if (!ok) return Alert.alert('알림 권한 필요', '설정에서 알림을 허용해 주세요.');
    await sendBreakingDemo(articles[Math.floor(Math.random() * articles.length)]);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="설정" left={<HeaderButton label="←" onPress={() => navigation.goBack()} />} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.h, { color: t.ink }]}>내 상황</Text>
        <Text style={[styles.sub, { color: t.muted }]}>선택한 상황에 맞춰 홈에서 맞춤 추천해드려요.</Text>
        <View style={styles.chips}>
          {SITUATIONS.map((s) => {
            const on = profile.situations.includes(s.key);
            return (
              <Pressable key={s.key} onPress={() => toggleSit(s.key)} style={[styles.chip, { backgroundColor: on ? t.accent : t.surface2, borderColor: on ? t.accent : t.border }]}>
                <Text style={{ color: on ? t.onAccent : t.muted, fontSize: 13.5, fontWeight: '600' }}>{s.emoji} {s.key}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.h, { color: t.ink, marginTop: 12 }]}>내 지역</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionRow}>
          {REGIONS.map((r) => {
            const on = profile.region === r;
            return (
              <Pressable key={r} onPress={() => updateProfile({ region: r })} style={[styles.chip, { backgroundColor: on ? t.accent : t.surface2, borderColor: on ? t.accent : t.border }]}>
                <Text style={{ color: on ? t.onAccent : t.muted, fontSize: 13.5, fontWeight: '600' }}>{r}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={[styles.h, { color: t.ink, marginTop: 22 }]}>알림</Text>
        {Object.keys(settings).map((key) => (
          <View key={key} style={[styles.row, { borderBottomColor: t.line }]}>
            <Text style={[styles.rowLabel, { color: t.ink }]}>{key}</Text>
            <Toggle on={settings[key]} onPress={() => toggleSetting(key)} />
          </View>
        ))}
        <Pressable onPress={onTestPush} style={[styles.testBtn, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
          <Text style={{ color: t.danger, fontWeight: '700', fontSize: 14 }}>🔔 [새 글] 테스트 푸시 보내기</Text>
        </Pressable>

        <Text style={[styles.h, { color: t.ink, marginTop: 22 }]}>정보</Text>
        <Pressable onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)} style={[styles.row, { borderBottomColor: t.line }]}>
          <Text style={[styles.rowLabel, { color: t.ink }]}>개인정보처리방침</Text>
          <Text style={{ color: t.faint, fontSize: 18 }}>›</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  h: { fontSize: 17, fontWeight: '750', marginBottom: 4 },
  sub: { fontSize: 13, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  regionRow: { gap: 8, paddingVertical: 2, paddingRight: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1 },
  rowLabel: { fontSize: 14.5, fontWeight: '600' },
  tg: { width: 44, height: 26, borderRadius: 14, justifyContent: 'center' },
  knob: { position: 'absolute', top: 3, width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  testBtn: { marginTop: 14, borderWidth: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
});
