import FontControls from './FontControls';
import SearchClient from './search/SearchClient';
import NotifyCard from './NotifyCard';
import { seniorArticles } from './seniorArticles';
import { pickTodaysBenefit } from './todaysBenefit';

// 한국(KST) 기준 오늘 날짜로 '오늘의 혜택' 선택 (서버 타임존이 UTC여도 하루가 밀리지 않게).
function kstToday() {
  const now = new Date();
  return new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60 * 1000);
}

// 랜딩 = 검색 화면. 들어오자마자 검색이 보이고, 그 아래 오늘의 혜택·문의만 둔다.
export default function Home() {
  const todays = pickTodaysBenefit(seniorArticles, kstToday());

  return (
    <main className="landingMain">
      <header className="landingBrand">
        <p className="brandKicker">시니어 서포트 · Senior Support</p>
      </header>

      <SearchClient />

      {todays ? (
        <section className="landingCard todayCard" aria-label="오늘의 혜택">
          <p className="eyebrow">오늘의 혜택</p>
          <h2>{todays.title}</h2>
          <p className="todaysSummary">{todays.summary}</p>
          <a className="readButton" href={todays.url && !todays.comingSoon ? todays.url : '#benefitSearch'}>
            {todays.buttonText || '자세히 보기'}
          </a>
        </section>
      ) : null}

      <NotifyCard />

      <section className="landingCard askCard" aria-label="궁금한 점 물어보기">
        <p className="eyebrow">도움이 필요하면</p>
        <h2>궁금한 점 물어보기</h2>
        <div className="askButtons">
          <a className="askButton kakaoChannel" href="http://pf.kakao.com/_NJYBX">
            <span className="askIcon" aria-hidden="true">💬</span>
            카카오톡 채널로 물어보기
          </a>
          <a className="askButton kakaoOpen" href="https://open.kakao.com/o/plqZYTHi">
            <span className="askIcon" aria-hidden="true">🗣️</span>
            오픈채팅으로 물어보기
          </a>
        </div>
      </section>

      <section className="landingCard disclaimerCard" aria-label="참고자료 안내">
        <strong>참고자료 안내</strong>
        <p>
          검색 결과는 행정안전부 보조금24(공공데이터) 정보를 바탕으로 한 참고용입니다.
          실제 지원 대상·금액·신청 방법은 각 기관의 최신 공지와 심사 결과에 따라 달라질 수 있습니다.
        </p>
      </section>

      <footer className="footer landingFooter">
        <strong>시니어 서포트</strong>
        <span>공식 기관이 아닌 참고용 안내 서비스입니다.</span>
        <nav className="footerSources" aria-label="공식 정부 출처">
          <span className="footerSourcesLabel">공식 출처</span>
          <a href="https://www.gov.kr">정부24</a>
          <a href="https://www.bokjiro.go.kr">복지로</a>
          <a href="https://basicpension.mohw.go.kr">기초연금</a>
          <a href="https://www.nps.or.kr">국민연금공단</a>
          <a href="https://www.nhis.or.kr">건강보험공단</a>
        </nav>
      </footer>
      <FontControls />
    </main>
  );
}
