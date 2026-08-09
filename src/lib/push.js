import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PROJECT_ID = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
export const NEW_POST_NOTIFICATION_CHANNEL_ID = 'new-posts-v2';

export async function ensureNotificationChannel() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(NEW_POST_NOTIFICATION_CHANNEL_ID, {
    name: '새 소식 알림',
    importance: Notifications.AndroidImportance.MAX,
    enableVibrate: true,
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

export async function getPushPermissionStatus() {
  await ensureNotificationChannel();
  const permission = await Notifications.getPermissionsAsync();
  return permission.status;
}

export async function requestPushPermission() {
  await ensureNotificationChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

let tokenInflight = null;

async function getPushToken() {
  await ensureNotificationChannel();

  if (!PROJECT_ID) {
    throw new Error('EAS projectId is missing');
  }

  // 여러 곳(앱 시작·포커스·AppState 활성)에서 동시에 호출되면 in-flight 요청을 공유한다.
  // 중복 호출 시 이전 fetch가 취소되며 "Fetch request has been canceled" 로그가 뜨는 걸 막는다.
  if (!tokenInflight) {
    tokenInflight = Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })
      .then(({ data }) => data);
  }
  try {
    return await tokenInflight;
  } finally {
    tokenInflight = null;
  }
}

export async function registerPushToken({ requestPermission = true } = {}) {
  const granted = requestPermission
    ? await requestPushPermission()
    : (await getPushPermissionStatus()) === 'granted';

  if (!granted || !supabase) return null;

  try {
    const token = await getPushToken();
    await supabase.from('push_tokens').upsert({ token }, { onConflict: 'token', ignoreDuplicates: true });
    return token;
  } catch (e) {
    console.warn('registerPushToken failed:', e.message);
    return null;
  }
}

export async function syncPushPermission({ requestIfNeeded = false } = {}) {
  const status = await getPushPermissionStatus();

  if (status === 'granted') {
    await registerPushToken({ requestPermission: false });
    return true;
  }

  if (requestIfNeeded && status === 'undetermined') {
    const token = await registerPushToken();
    return !!token;
  }

  return false;
}

export async function unregisterPushToken() {
  if (!supabase) return;

  try {
    const token = await getPushToken();
    await supabase.from('push_tokens').delete().eq('token', token);
  } catch (e) {
    console.warn('unregisterPushToken failed:', e.message);
  }
}
