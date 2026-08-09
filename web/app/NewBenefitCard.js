'use client';

import { useEffect, useState } from 'react';

// 관리자(어드민)가 새 글을 발행하면(= 푸시 알림 발송) 그 글을 '오늘의 혜택'으로 검색창 아래 노출.
// - 표시 여부·설명 문구는 어드민이 app_settings(todays_benefit)로 제어한다.
// - anon 키는 공개용(RLS로 접근 제어). 발행글(published=true)만 읽힌다.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oxunynxspkxfkokerftl.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_T_IYdewX-mBILr-5hSIUxw_0KC4f3Nh';
const DAY_MS = 24 * 60 * 60 * 1000;

export default function NewBenefitCard() {
  const [data, setData] = useState(null); // { title, url, note }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
        const [aRes, cRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/articles`
            + '?select=title,url,created_at&published=eq.true&order=created_at.desc&limit=1', { headers }),
          fetch(`${SUPABASE_URL}/rest/v1/app_settings?key=eq.todays_benefit&select=value`, { headers }),
        ]);

        // 어드민 설정: 표시 on/off + 설명 문구 (설정 없으면 기본 표시)
        let enabled = true;
        let note = '';
        if (cRes.ok) {
          const cfg = (await cRes.json())?.[0]?.value;
          if (cfg) {
            enabled = cfg.enabled !== false;
            note = typeof cfg.note === 'string' ? cfg.note : '';
          }
        }
        if (!enabled) return; // 어드민이 꺼둠 → 숨김

        if (!aRes.ok) return;
        const latest = (await aRes.json())?.[0];
        if (!latest?.url || !latest?.created_at) return;
        // 24시간 안에 올라온 새 내용만 노출 — 그 외에는 숨김.
        if (Date.now() - new Date(latest.created_at).getTime() > DAY_MS) return;

        if (alive) setData({ title: latest.title, url: latest.url, note });
      } catch {
        /* 실패 시 조용히 숨김 */
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!data) return null;

  return (
    <section className="landingCard todayCard" aria-label="오늘의 혜택">
      <p className="eyebrow">오늘의 혜택</p>
      <h2>{data.title}</h2>
      {data.note ? <p className="todaysSummary">{data.note}</p> : null}
      {/* 앱 내 웹뷰(현재 탭)에서 열리도록 target="_blank" 제외 */}
      <a className="readButton" href={data.url}>자세히 보기</a>
    </section>
  );
}
