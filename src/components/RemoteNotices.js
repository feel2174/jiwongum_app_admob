import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme';

const TRANSITION_SHOWN_KEY = '@jiwongum/transition-notice-shown';

// 원격설정(app_config)으로 제어되는 안내들 (릴리스 계획 §4.2 / §7)
//  - maintenance: 점검 공지 배너(비차단). { title, message }
//  - transitionNotice: 브랜드 전환 1회성 안내 모달. Phase 2 빌드에 심어두고 Phase 3에 원격으로 켠다.
export default function RemoteNotices({ cfg }) {
  const t = useTheme();
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!cfg?.transitionNotice) return;
      try {
        const shown = await AsyncStorage.getItem(TRANSITION_SHOWN_KEY);
        if (mounted && !shown) setShowTransition(true);
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [cfg?.transitionNotice]);

  const dismissTransition = async () => {
    setShowTransition(false);
    try {
      await AsyncStorage.setItem(TRANSITION_SHOWN_KEY, '1');
    } catch {}
  };

  const maintenance = cfg?.maintenance;

  return (
    <>
      {maintenance ? (
        <SafeAreaView edges={['top']} pointerEvents="box-none" style={styles.bannerWrap}>
          <View style={[styles.banner, { backgroundColor: t.amberSoft, borderColor: t.amber }]}>
            <Text style={[styles.bannerTitle, { color: t.amber }]}>
              {maintenance.title || '점검 안내'}
            </Text>
            {maintenance.message ? (
              <Text style={[styles.bannerText, { color: t.ink }]}>{maintenance.message}</Text>
            ) : null}
          </View>
        </SafeAreaView>
      ) : null}

      <Modal visible={showTransition} transparent animationType="fade" onRequestClose={dismissTransition}>
        <View style={styles.backdrop}>
          <View style={[styles.card, { backgroundColor: t.surface }]}>
            <Text style={[styles.title, { color: t.ink }]}>곧 앱 이름이 바뀝니다</Text>
            <Text style={[styles.body, { color: t.muted }]}>
              <Text style={{ fontWeight: '800', color: t.ink }}>‘지원금 모아보기’</Text>가{'\n'}
              <Text style={{ fontWeight: '800', color: t.accent }}>‘지원금 살펴줌’</Text>이 됩니다.
            </Text>
            <Text style={[styles.body, { color: t.muted }]}>
              앱을 지우지 않으셔도 됩니다.{'\n'}저장하신 지원금도 그대로 있습니다.
            </Text>
            <Pressable
              onPress={dismissTransition}
              style={({ pressed }) => [styles.okBtn, { backgroundColor: t.accent, opacity: pressed ? 0.9 : 1 }]}
            >
              <Text style={[styles.okLabel, { color: t.onAccent }]}>알겠어요</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bannerWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30 },
  banner: { margin: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
  bannerTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  bannerText: { fontSize: 14, lineHeight: 20 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { width: '100%', maxWidth: 360, borderRadius: 16, padding: 24 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  body: { fontSize: 17, lineHeight: 26, textAlign: 'center', marginBottom: 14 },
  okBtn: { marginTop: 8, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  okLabel: { fontSize: 18, fontWeight: '800' },
});
