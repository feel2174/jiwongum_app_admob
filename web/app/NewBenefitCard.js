'use client';

import { useEffect, useState } from 'react';

// 관리자(어드민)가 새 글을 발행하면(= 푸시 알림 발송) 그 글을 '오늘의 혜택'으로 검색창 아래 노출.
// anon 키는 공개용(RLS로 접근 제어) — 어드민/앱과 동일 키. 발행글(published=true)만 읽힌다.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oxunynxspkxfkokerftl.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_T_IYdewX-mBILr-5hSIUxw_0KC4f3Nh';
const DAY_MS = 24 * 60 * 60 * 1000;

export default function NewBenefitCard() {
  const [item, setItem] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const url = `${SUPABASE_URL}/rest/v1/articles`
          + '?select=title,url,created_at&published=eq.true&order=created_at.desc&limit=1';
        const res = await fetch(url, {
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        });
        if (!res.ok) return;
        const rows = await res.json();
        const latest = Array.isArray(rows) ? rows[0] : null;
        if (!latest?.url || !latest?.created_at) return;
        // 24시간 안에 올라온 새 내용만 노출 — 그 외에는 숨김.
        if (Date.now() - new Date(latest.created_at).getTime() > DAY_MS) return;
        if (alive) setItem(latest);
      } catch {
        /* 실패 시 조용히 숨김 */
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!item) return null;

  return (
    <section className="landingCard todayCard" aria-label="오늘의 혜택">
      <p className="eyebrow">오늘의 혜택</p>
      <h2>{item.title}</h2>
      {/* 앱 내 웹뷰(현재 탭)에서 열리도록 target="_blank" 제외 */}
      <a className="readButton" href={item.url}>자세히 보기</a>
    </section>
  );
}
