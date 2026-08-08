import FontControls from '../FontControls';
import SearchClient from './SearchClient';

export const metadata = {
  title: '지원금 검색',
  description: '키워드 하나만 입력하면 관련 지원금을 바로 찾아드립니다. 기초연금, 의료비, 주거, 일자리, 난방비 등.',
};

export default function SearchPage() {
  return (
    <main className="searchMain">
      <header className="searchHeader">
        <h1>지원금 검색</h1>
        <a className="searchHomeLink" href="/">홈으로</a>
      </header>
      <SearchClient />
      <section className="section disclaimer" aria-label="참고자료 안내">
        <strong>참고자료 안내</strong>
        <p>
          검색 결과는 행정안전부 보조금24(공공데이터) 정보를 바탕으로 한 참고용입니다.
          실제 지원 대상, 신청 가능 여부, 지급 금액은 각 기관의 최신 공지와 심사 결과에 따라 달라질 수 있습니다.
        </p>
      </section>
      <FontControls />
    </main>
  );
}
