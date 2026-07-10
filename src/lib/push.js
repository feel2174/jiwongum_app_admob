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

// [속보] 데모 알림. 실서비스에서는 서버(FCM/APNs)에서 세그먼트 발송으로 대체.
// data.id 로 어떤 뉴스인지 실어 보내 → 탭 시 원문으로 연결.
export async function sendBreakingDemo(news) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '[속보] 지원금 알림',
      body: news.title,
      data: { newsId: news.id, url: news.url },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
      repeats: false,
    },
  });
}
