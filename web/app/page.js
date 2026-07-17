import FontControls from './FontControls';
import ArticleExplorer from './ArticleExplorer';
import { seniorArticles } from './seniorArticles';

export default function Home() {
  const featuredArticles = seniorArticles.filter((article) => article.featured);

  return (
    <main>
      <header className="hero">
        <nav className="topBar" aria-label="페이지 이동">
          <a href="#articles">글 목록</a>
          <a href="#checklist">확인 순서</a>
          <a href="#originals">바로가기</a>
        </nav>

        <div className="heroGrid">
          <div>
            <p className="eyebrow">시니어 생활 지원 안내</p>
            <h1>연금, 일자리, 건강보험을 한 번에 확인하세요</h1>
            <p className="heroCopy">
              필요한 항목을 고르면 설명을 먼저 보고, 공식 신청·조회 화면으로 바로 이동할 수 있습니다.
            </p>
            <div className="heroActions">
              <a href="#articles">항목별로 확인하기</a>
              <a href="#originals">바로가기 모음</a>
            </div>
          </div>

          <section className="summaryBox" aria-label="요약">
            <div>
              <strong>{seniorArticles.length}개</strong>
              <span>확인 항목</span>
            </div>
            <div>
              <strong>공식</strong>
              <span>서비스 연결</span>
            </div>
            <FontControls />
          </section>
        </div>
      </header>

      <section className="section intro" id="checklist">
        <div>
          <p className="eyebrow">먼저 보면 좋은 순서</p>
          <h2>부모님이나 본인 상황에 맞춰 이렇게 확인해보세요</h2>
        </div>
        <ol className="steps">
          <li>
            <strong>연금부터 확인</strong>
            기초연금, 노령연금, 국민연금 예상수령액을 먼저 확인하면 매달 들어오는
            기본 금액을 가늠하기 좋습니다.
          </li>
          <li>
            <strong>건강보험 조건 점검</strong>
            부모님을 피부양자로 등록할 수 있는지 확인하면 가구 지출 계획을 세우는 데
            도움이 됩니다.
          </li>
          <li>
            <strong>일자리 공고 확인</strong>
            노인일자리는 지역별 모집 시기가 중요하므로 원문에서 접수처와 필요 서류를
            함께 확인하세요.
          </li>
        </ol>
      </section>

      <section className="section featuredSection" aria-label="자주 찾는 항목">
        <div className="sectionHeading">
          <p className="eyebrow">자주 찾는 항목</p>
          <h2>먼저 확인하면 좋은 3가지</h2>
        </div>
        <div className="featuredGrid">
          {featuredArticles.map((article) => (
            <a key={article.id} className="featuredCard" href={`#${article.id}`}>
              <span>{article.group}</span>
              <strong>{article.title}</strong>
              <small>{article.summary}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="section articleList" id="articles">
        <div className="sectionHeading">
          <p className="eyebrow">항목별 안내</p>
          <h2>무엇을 확인하시나요?</h2>
        </div>
        <ArticleExplorer articles={seniorArticles} />
      </section>

      <section className="section originals" id="originals">
        <div className="sectionHeading">
          <p className="eyebrow">빠른 이동</p>
          <h2>공식 서비스 바로가기</h2>
        </div>
        <div className="linkList">
          {seniorArticles.map((article) => (
            <a key={article.id} href={article.url}>
              <span>{article.title}</span>
              <small>{article.buttonText}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="section subsidyBox" aria-label="보조금24 바로가기">
        <p className="eyebrow">추가 확인</p>
        <h2>보조금24에서 받을 수 있는 혜택을 더 찾아보세요</h2>
        <p>
          나이, 가족, 소득, 생활 상황에 따라 받을 수 있는 정부 혜택이 더 있을 수 있습니다.
          보조금24에서 본인에게 맞는 혜택을 한 번 더 확인해보세요.
        </p>
        <a className="readButton" href="https://plus.gov.kr/">
          보조금24 바로가기
        </a>
      </section>

      <footer className="footer">
        <strong>시니어 지원금 모아보기</strong>
        <span>각 항목은 공식 서비스 페이지로 연결됩니다.</span>
      </footer>
    </main>
  );
}
