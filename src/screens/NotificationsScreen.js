import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useStore } from '../lib/store';
import { requestPushPermission, sendBreakingDemo } from '../lib/push';
import { NEWS } from '../data/mock';
import Header from '../components/Header';

function Toggle({ on, onPress }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tg, { backgroundColor: on ? t.ok : t.surface2 }]}
    >
      <View style={[styles.knob, { left: on ? 21 : 3 }]} />
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const t = useTheme();
  const { settings, toggleSetting } = useStore();

  const onSendDemo = async () => {
    const granted = await requestPushPermission();
    if (!granted) {
      Alert.alert('알림 권한 필요', '설정에서 알림을 허용하면 새 글 알림을 받아볼 수 있어요.');
      return;
    }
    await sendBreakingDemo(NEWS[Math.floor(Math.random() * NEWS.length)]);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="알림 설정" />
      <ScrollView contentContainerStyle={styles.content}>
        {Object.keys(settings).map((key) => (
          <View key={key} style={[styles.row, { borderBottomColor: t.line }]}>
            <Text style={[styles.label, { color: t.ink }]}>{key}</Text>
            <Toggle on={settings[key]} onPress={() => toggleSetting(key)} />
          </View>
        ))}

        <Text style={[styles.hint, { color: t.faint }]}>
          관심 카테고리에 새 글이 올라오면 푸시로 알려줘요.{'\n\n'}※ iOS는 최초 1회 알림
          권한 동의가 필요합니다.
        </Text>

        <Pressable
          onPress={onSendDemo}
          style={[styles.demoBtn, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}
        >
          <Text style={{ color: t.danger, fontWeight: '700', fontSize: 14 }}>
            🔔 [새 글] 테스트 푸시 보내기
          </Text>
        </Pressable>
        <Text style={[styles.hint, { color: t.faint }]}>
          잠시 후 도착하는 알림을 탭하면 → 앱으로 다시 들어와 해당 글로 연결됩니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  label: { fontSize: 14, fontWeight: '600' },
  tg: { width: 44, height: 26, borderRadius: 14, justifyContent: 'center' },
  knob: {
    position: 'absolute',
    top: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  hint: { fontSize: 12, lineHeight: 18, paddingVertical: 14 },
  demoBtn: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
});
