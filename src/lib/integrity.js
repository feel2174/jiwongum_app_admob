// Play Integrity 소프트 게이트 (릴리스 계획 §2)
//
// 원칙:
//  - 어떤 판정에서도 "콘텐츠"는 절대 막지 않는다. 판정은 오직 "광고"만 좌우한다.
//  - 무결성 관련 화면을 사용자에게 노출하지 않는다.
//  - 검증은 콜드 스타트 1회, 결과는 24시간 캐시. 화면/탭 이동마다 재검증 금지.
//  - 개발/프리뷰 빌드(skipIntegrity)에서는 검증을 건너뛴다(디버그 서명은 항상 UNRECOGNIZED).
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@jiwongum/integrity-verdict';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

// app.config.js가 EAS 프로파일별로 주입. production에서만 false.
export const SKIP_INTEGRITY = __DEV__ || !!Constants.expoConfig?.extra?.skipIntegrity;

// 판정: 'ok' | 'skipped' | 'unavailable' | 'failed'
//  - ok:          PLAY_RECOGNIZED + MEETS_DEVICE_INTEGRITY → 광고 허용
//  - skipped:     개발/프리뷰 → 광고 허용(테스트 광고)
//  - unavailable: 네이티브 Integrity 모듈 미탑재 → 현행 유지(광고 허용). 모듈 연결 전 라이브 수익 보호.
//  - failed:      모듈이 존재하고 검증이 실패/미평가 → 광고만 끔(콘텐츠는 유지)
let memo = null;

async function readCache() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { verdict, at } = JSON.parse(raw);
    if (!at || Date.now() - at > CACHE_TTL_MS) return null;
    return verdict || null;
  } catch {
    return null;
  }
}

async function writeCache(verdict) {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ verdict, at: Date.now() }));
  } catch {}
}

// 실제 Play Integrity 네이티브 호출 지점.
// 현재 저장소에는 네이티브 무결성 모듈이 없다. 모듈을 붙이기 전까지는
// 라이브 사용자의 광고를 끄지 않도록 'unavailable'(허용측)을 반환한다.
// 모듈 연결 시: appRecognitionVerdict/deviceIntegrity를 읽어
//   PLAY_RECOGNIZED+MEETS_DEVICE_INTEGRITY → 'ok', 그 외/오류 → 'failed' 로 매핑.
async function runNativeIntegrity() {
  return 'unavailable';
}

// 콜드 스타트 1회 호출. 결과는 메모 + 24h 캐시.
export async function checkIntegrity() {
  if (memo) return memo;
  if (SKIP_INTEGRITY) {
    memo = 'skipped';
    return memo;
  }
  const cached = await readCache();
  if (cached) {
    memo = cached;
    return cached;
  }
  let verdict = 'unavailable';
  try {
    verdict = await runNativeIntegrity();
  } catch {
    verdict = 'failed'; // 모듈은 있으나 호출 오류 → 보수적으로 광고만 끔
  }
  memo = verdict;
  await writeCache(verdict);
  return verdict;
}

// 광고 표시 가능 여부. 'failed' 일 때만 광고를 끈다(그 외에는 허용).
export function adsAllowedByIntegrity(verdict) {
  return verdict !== 'failed';
}
