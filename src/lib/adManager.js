// AdManager — 모든 전면광고 노출의 단일 관문.
// 밴 방지 캡(빈도/세션/조회수)을 한 곳에서 강제한다.
// 실서비스 배포 시 __DEV__ 아래의 실제 광고 단위 ID로 교체.
import { Platform } from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// 개발(__DEV__)에서는 항상 테스트 광고 → 자기 실광고 클릭 밴 방지.
// 배포 빌드에서만 실제 광고 단위 ID 사용.
const INTERSTITIAL_UNIT = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      android: 'ca-app-pub-8785405056367250/3054590041',
      ios: 'ca-app-pub-8785405056367250/9854435134',
    });

export const BANNER_UNIT = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      android: 'ca-app-pub-8785405056367250/3437733426',
      ios: 'ca-app-pub-8785405056367250/1761955604',
    });

// 데모/권장 캡. 실제 값은 리텐션·수익 보며 이 안전선 안에서 조정.
export const CAPS = {
  VIEW_MIN: 3, // 상세 3회 이상 조회 후부터 노출
  INTERVAL_MS: 90 * 1000, // 광고 간 최소 90초
  SESSION_CAP: 4, // 세션당 최대 4회
};

const s = { views: 0, count: 0, lastTime: 0 };
let ad = null;
let loaded = false;

function build() {
  ad = InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT, {
    requestNonPersonalizedAdsOnly: true,
  });
  loaded = false;
  ad.addAdEventListener(AdEventType.LOADED, () => {
    loaded = true;
  });
  ad.addAdEventListener(AdEventType.CLOSED, () => {
    loaded = false;
    build(); // 다음 노출을 위해 미리 로드
  });
  ad.addAdEventListener(AdEventType.ERROR, () => {
    loaded = false;
  });
  ad.load();
}

export function init() {
  build();
}

// 상세 화면 진입 시 호출 — 조회수 누적
export function recordDetailView() {
  s.views += 1;
}

// 캡을 통과하고 광고가 준비돼 있으면 전면광고 노출 후 openFn 실행,
// 아니면 광고 없이 즉시 openFn 실행. (Option A: 나갈 때만, 복귀 시 억제)
export function gateThenOpen(openFn) {
  const now = Date.now();
  const capsOk =
    s.views >= CAPS.VIEW_MIN &&
    (!s.lastTime || now - s.lastTime >= CAPS.INTERVAL_MS) &&
    s.count < CAPS.SESSION_CAP;

  if (capsOk && loaded && ad) {
    s.count += 1;
    s.lastTime = now;
    const unsub = ad.addAdEventListener(AdEventType.CLOSED, () => {
      unsub();
      openFn();
    });
    try {
      ad.show();
    } catch (e) {
      unsub();
      openFn();
    }
  } else {
    openFn();
  }
}
