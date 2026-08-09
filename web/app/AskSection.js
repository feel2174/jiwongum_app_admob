'use client';

import { useEffect, useState } from 'react';

const KAKAO_CHANNEL = 'http://pf.kakao.com/_NJYBX';
const KAKAO_OPENCHAT = 'https://open.kakao.com/o/plqZYTHi';

// 문의 섹션.
// - 일반 웹 방문자: "궁금한 점 물어보기"(메인 랜딩 컨셉).
// - 앱(웹뷰) 사용자: 하단 '선발대' 섹션 — 먼저 써보는 사람들끼리 묻고 답하는 컨셉으로 재구성.
export default function AskSection() {
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    setInApp(typeof window !== 'undefined' && !!window.ReactNativeWebView);
  }, []);

  const buttons = (
    <div className="askButtons">
      <a className="askButton kakaoChannel" href={KAKAO_CHANNEL}>
        <span className="askIcon" aria-hidden="true">💬</span>
        카카오톡 채널로 물어보기
      </a>
      <a className="askButton kakaoOpen" href={KAKAO_OPENCHAT}>
        <span className="askIcon" aria-hidden="true">🗣️</span>
        오픈채팅으로 물어보기
      </a>
    </div>
  );

  if (inApp) {
    return (
      <section className="landingCard pioneerCard" aria-label="선발대에 물어보기">
        <p className="eyebrow">함께 찾는 선발대</p>
        <h2>🚩 궁금한 건 선발대에 물어보세요</h2>
        <p className="pioneerText">
          먼저 써 본 선발대에게 편하게 물어보세요. 채널로는 새 소식을,
          오픈채팅에서는 서로 궁금한 걸 나눠요.
        </p>
        {buttons}
      </section>
    );
  }

  return (
    <section className="landingCard askCard" aria-label="궁금한 점 물어보기">
      <p className="eyebrow">도움이 필요하면</p>
      <h2>궁금한 점 물어보기</h2>
      {buttons}
    </section>
  );
}
