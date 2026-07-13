import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from './supabase';

// 알림 표시 방식 (앱 포그라운드 상태에서도 배너 표시)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
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
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
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
    console.log('[push] Expo push token:', token); // 테스트용 — expo.dev/notifications에 붙여넣어 발송
    // ignoreDuplicates: 이미 있으면 INSERT DO NOTHING (RLS에 UPDATE 정책이 없어 upsert-update가 막히는 문제 회피)
    await supabase.from('push_tokens').upsert({ token }, { onConflict: 'token', ignoreDuplicates: true });
    return token;
  } catch (e) {
    console.warn('registerPushToken failed:', e.message);
    return null;
  }
}

// 앱 시작 시 호출 — 이미 권한을 허용한 기기라면 조용히 토큰을 재등록(갱신)하고,
// 아직 허용 안 한 기기는 권한 팝업을 띄우지 않고 그냥 넘어감.
export async function syncPushTokenIfPermitted() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return null;
  return registerPushToken();
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

// 진단용 — 권한 상태 + Expo 토큰(또는 에러) + Supabase 연결 여부.
// 설정 화면 "알림 진단"에서 호출해 토큰이 실제로 나오는지 확인.
export async function getPushDiagnostics() {
  const perm = await Notifications.getPermissionsAsync();
  const out = { status: perm.status, hasSupabase: !!supabase, token: null, error: null };
  try {
    out.token = await getPushToken();
  } catch (e) {
    out.error = e?.message || String(e);
  }
  return out;
}

// [새 글] 데모 알림. 실서비스에서는 서버(FCM/APNs)에서 세그먼트 발송으로 대체.
// data.url 로 해당 글 주소를 실어 보내 → 탭 시 그 글로 연결.
export async function sendBreakingDemo(article) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '[새 글] 지원금·정책',
      body: article.title,
      data: { articleId: article.id, url: article.url },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
      repeats: false,
    },
  });
}
