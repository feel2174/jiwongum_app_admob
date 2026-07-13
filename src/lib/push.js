import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from './supabase';

// 알림 표시 방식 (앱 포그라운드 상태에서도 배너 표시)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 푸시 권한 요청 (soft-ask 이후 호출)
export async function requestPushPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === 'granted';
}

const PROJECT_ID = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

async function getPushToken() {
  if (Platform.OS === 'android') {
    // importance HIGH → 화면 상단 헤드업(플로팅) 배너 + 진동으로 표시
    await Notifications.setNotificationChannelAsync('default', {
      name: '지원금·정책 알림',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID });
  return token;
}

// 알림 권한을 허용한 기기의 Expo push token을 Supabase push_tokens에 등록.
// 어드민이 글을 발행하면 이 테이블 전체에 브로드캐스트로 알림이 감(상황별 타겟팅 없음).
export async function registerPushToken() {
  const granted = await requestPushPermission();
  if (!granted || !supabase) return null;
  try {
    const token = await getPushToken();
    // ignoreDuplicates: 이미 있으면 INSERT DO NOTHING (RLS에 UPDATE 정책이 없어 upsert-update가 막히는 문제 회피)
    await supabase.from('push_tokens').upsert({ token }, { onConflict: 'token', ignoreDuplicates: true });
    return token;
  } catch (e) {
    console.warn('registerPushToken failed:', e.message);
    return null;
  }
}

// 알림을 끌 때 호출 — 이 기기로는 더 이상 브로드캐스트가 가지 않도록 토큰 삭제.
export async function unregisterPushToken() {
  if (!supabase) return;
  try {
    const token = await getPushToken();
    await supabase.from('push_tokens').delete().eq('token', token);
  } catch (e) {
    console.warn('unregisterPushToken failed:', e.message);
  }
}
