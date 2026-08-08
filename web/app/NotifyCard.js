'use client';

import { useEffect, useState } from 'react';

// 새 지원금 알림 유도. 앱(웹뷰) 안에서는 네이티브 설정으로 연결,
// 일반 웹 방문자는 카카오 채널로 폴백.
export default function NotifyCard() {
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    setInApp(typeof window !== 'undefined' && !!window.ReactNativeWebView);
  }, []);

  function enableInApp() {
    // 네이티브 WebScreen이 onMessage로 받아 설정 화면으로 이동/알림 권한 요청.
    try {
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'enable-notifications' }));
    } catch {
      /* 무시 */
    }
  }

  return (
    <section className="landingCard notifyCard" aria-label="새 지원금 알림">
      <p className="eyebrow">놓치지 않기</p>
      <h2>🔔 새 지원금 알림 받기</h2>
      <p className="notifyText">새로운 혜택이 올라오면 가장 먼저 알려드려요.</p>
      {inApp ? (
        <>
          <button type="button" className="readButton notifyButton" onClick={enableInApp}>
            알림 켜기
          </button>
          <p className="notifyHint">
            또는 화면 아래 <strong>설정</strong>에서 알림을 켤 수 있어요.
          </p>
        </>
      ) : (
        <a className="readButton notifyButton" href="http://pf.kakao.com/_NJYBX">
          카카오톡 채널로 새 소식 받기
        </a>
      )}
    </section>
  );
}
