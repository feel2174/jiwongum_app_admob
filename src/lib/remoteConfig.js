// 원격 설정 / 킬 스위치 (릴리스 계획 §7)
//
// Supabase app_settings 테이블의 'app_config' 키를 부팅 시 1회 조회한다.
// 앱 배포(스토어 심사) 없이 광고 on/off·전환 안내·점검 공지를 제어하기 위함.
// 실패 시 항상 "안전한 기본값"으로 폴백한다(콘텐츠는 절대 막지 않는다).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const CACHE_KEY = '@jiwongum/remote-config';

export const DEFAULTS = {
  adsEnabled: true, // 광고 노출 여부
  maintenance: null, // { title, message } 또는 null
  transitionNotice: false, // 브랜드 전환 안내(§4.2) 노출 여부
};

let memo = null;

// 부팅 즉시 사용할 값: 캐시(오프라인 대비) → 없으면 기본값.
export async function loadRemoteConfig() {
  if (memo) return memo;
  let cfg = { ...DEFAULTS };
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) cfg = { ...cfg, ...JSON.parse(raw) };
  } catch {}
  memo = cfg;
  return cfg;
}

// 네트워크에서 최신값을 가져와 갱신. 실패해도 기존/기본값 유지.
export async function refreshRemoteConfig() {
  if (!supabase) return memo || { ...DEFAULTS };
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'app_config')
      .maybeSingle();
    if (error || !data) return memo || { ...DEFAULTS };
    const cfg = { ...DEFAULTS, ...(data.value || {}) };
    memo = cfg;
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cfg));
    } catch {}
    return cfg;
  } catch {
    return memo || { ...DEFAULTS };
  }
}
