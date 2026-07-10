import * as Notifications from 'expo-notifications';

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

// [새 글] 데모 알림. 실서비스에서는 서버(FCM/APNs)에서 세그먼트 발송으로 대체.
// data.url 로 해당 글 주소를 실어 보내 → 탭 시 그 글로 연결.
export async function sendBreakingDemo(article) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '[새 글] 생활 꿀팁',
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
