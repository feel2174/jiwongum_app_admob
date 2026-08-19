import SearchClient from './search/SearchClient';
import NotifyCard from './NotifyCard';
import NewBenefitCard from './NewBenefitCard';

// 랜딩 = 검색 화면. 들어오자마자 검색이 보이고, 그 아래 오늘의 혜택·문의만 둔다.
export default function Home() {
  return (
    <main className="landingMain">
      <header className="landingBrand">
        <p className="brandKicker">어르신 지원금</p>
      </header>

      <SearchClient />

      {/* 검색창 바로 아래 — 관리자가 올린 새 글(24시간 이내)만 노출, 없으면 자동 숨김 */}
      <NewBenefitCard />

      <NotifyCard />

      <section className="landingCard disclaimerCard" aria-label="면책 조항">
        <strong>면책 조항</strong>
        <p>
          이 서비스는 정부·공공기관이 아닌 민간이 운영하는 참고용 안내 서비스입니다.
          검색 결과는 행정안전부 보조금24 등 공공데이터를 바탕으로 하며, 실제 지원 대상·금액·
          신청 방법·기한은 각 기관의 최신 공지와 심사 결과에 따라 달라질 수 있습니다.
        </p>
        <p>
          정확한 내용은 반드시 각 기관의 공식 안내로 확인하시기 바라며, 본 서비스의 정보를 이용해
          발생한 결정이나 결과에 대해 운영자는 법적 책임을 지지 않습니다.
        </p>
      </section>

      <footer className="footer landingFooter">
        <strong>어르신 지원금</strong>
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
    </main>
  );
}
