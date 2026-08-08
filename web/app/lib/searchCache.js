'use client';

// 로컬 캐시 폴백 — API 실패 시 앱이 빈 화면이 되지 않도록.
// 최근 검색 결과와 인기 지원금을 localStorage에 보관한다.

const RESULTS_KEY = 'senior-search-cache';
const POPULAR_KEY = 'senior-popular-cache';
const MAX_QUERIES = 20;

function readJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 용량 초과 등은 조용히 무시 (캐시는 있으면 좋은 정도)
  }
}

export function cacheResults(query, results) {
  if (!query || !results || results.length === 0) return;
  const store = readJSON(RESULTS_KEY, {});
  store[query] = { at: Date.now(), results };
  // 오래된 것부터 정리
  const entries = Object.entries(store).sort((a, b) => b[1].at - a[1].at);
  const trimmed = Object.fromEntries(entries.slice(0, MAX_QUERIES));
  writeJSON(RESULTS_KEY, trimmed);
}

export function getCachedResults(query) {
  if (!query) return null;
  const store = readJSON(RESULTS_KEY, {});
  return store[query]?.results || null;
}

export function cachePopular(results) {
  if (!results || results.length === 0) return;
  writeJSON(POPULAR_KEY, { at: Date.now(), results });
}

export function getCachedPopular() {
  return readJSON(POPULAR_KEY, {}).results || null;
}
