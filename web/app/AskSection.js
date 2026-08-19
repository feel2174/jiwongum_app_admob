'use client';

import { useEffect, useState } from 'react';

// 채널 홈(/_NJYBX)은 로그인 없이도 프로필이 그대로 보여 "이미 문의 가능한 상태"처럼 보인다.
// /chat 으로 바로 들어가면 1:1 채팅 화면이라 카카오 로그인이 안 돼 있으면 즉시 로그인부터 요구한다.
const KAKAO_CHANNEL = 'http://pf.kakao.com/_NJYBX/chat';
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
        <span className="askLabel">카카오 채널 문의</span>
      </a>
      <div className="askItem">
        <a className="askButton kakaoOpen" href={KAKAO_OPENCHAT}>
          <span className="askIcon" aria-hidden="true">🗣️</span>
          <span className="askLabel">오픈채팅 참여</span>
        </a>
        <p className="askDesc">먼저 혜택을 받은 분들과 함께 확인해보세요.</p>
      </div>
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
