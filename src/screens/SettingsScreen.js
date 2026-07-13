import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../theme';
import { SITUATIONS, REGIONS } from '../data/mock';
import { useStore } from '../lib/store';
import { registerPushToken, unregisterPushToken, getPushDiagnostics } from '../lib/push';
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
  const { profile, updateProfile, settings, toggleSetting } = useStore();
  const notifOn = !!settings['새 글 알림'];
  const [diag, setDiag] = useState(null);
  const runDiag = async () => {
    setDiag('loading');
    setDiag(await getPushDiagnostics());
  };

  const toggleSit = (k) => {
    const next = profile.situations.includes(k)
      ? profile.situations.filter((x) => x !== k)
      : [...profile.situations, k];
    updateProfile({ situations: next });
  };

  // 새 글 알림 토글: 켤 때 권한요청+토큰등록(실패 시 켜지 않음), 끌 때 토큰해제.
  const onToggleNotif = async () => {
    if (!notifOn) {
      const token = await registerPushToken(); // 내부에서 권한요청
      if (token) {
        toggleSetting('새 글 알림');
      } else {
        Alert.alert('알림 권한이 필요해요', '기기 설정에서 이 앱의 알림을 허용하면 새 글 알림을 받을 수 있어요.');
      }
    } else {
      toggleSetting('새 글 알림');
      await unregisterPushToken();
    }
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
        <View style={[styles.notifRow, { borderColor: t.border, backgroundColor: t.card }]}>
          <View style={styles.notifText}>
            <Text style={[styles.notifTitle, { color: t.ink }]}>새 글 알림</Text>
            <Text style={[styles.notifSub, { color: t.muted }]}>
              관심 지원금·정책이 올라오면 푸시로 알려드려요. 언제든 여기서 끌 수 있어요.
            </Text>
          </View>
          <Toggle on={notifOn} onPress={onToggleNotif} />
        </View>

        <Text style={[styles.h, { color: t.ink, marginTop: 22 }]}>알림 진단</Text>
        <Pressable onPress={runDiag} style={[styles.diagBtn, { borderColor: t.border, backgroundColor: t.card }]}>
          <Text style={{ color: t.accent, fontWeight: '700', fontSize: 14 }}>푸시 토큰 확인</Text>
        </Pressable>
        {diag === 'loading' && <Text style={[styles.diagLine, { color: t.faint }]}>확인 중…</Text>}
        {diag && diag !== 'loading' && (
          <View style={[styles.diagBox, { backgroundColor: t.surface2 }]}>
            <Text style={[styles.diagLine, { color: t.muted }]}>
              권한: {diag.status}{diag.hasSupabase ? '' : ' · ⚠️ Supabase 미연결'}
            </Text>
            {diag.token ? (
              <>
                <Text style={[styles.diagLine, { color: t.ok }]}>토큰 생성됨 (길게 눌러 복사)</Text>
                <Text selectable style={[styles.diagToken, { color: t.ink }]}>{diag.token}</Text>
              </>
            ) : (
              <Text style={[styles.diagLine, { color: t.danger }]}>
                ❌ 토큰 없음{diag.error ? ` — ${diag.error}` : ''}
              </Text>
            )}
          </View>
        )}

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
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 14, padding: 16 },
  notifText: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: '700' },
  notifSub: { fontSize: 12.5, marginTop: 3, lineHeight: 17 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1 },
  rowLabel: { fontSize: 14.5, fontWeight: '600' },
  tg: { width: 44, height: 26, borderRadius: 14, justifyContent: 'center' },
  knob: { position: 'absolute', top: 3, width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  diagBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  diagBox: { marginTop: 10, borderRadius: 12, padding: 14, gap: 6 },
  diagLine: { fontSize: 12.5, fontWeight: '600' },
  diagToken: { fontSize: 12, fontFamily: 'monospace' },
});
