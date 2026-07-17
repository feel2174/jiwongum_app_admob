import FontControls from './FontControls';
import ArticleExplorer from './ArticleExplorer';
import { seniorArticles } from './seniorArticles';

const situationCards = [
  { label: '내 연금이 궁금해요', target: 'a2', text: '기초연금, 노령연금, 국민연금 예상액을 먼저 확인해보세요.' },
  { label: '일자리를 찾고 있어요', target: 'a14', text: '지역별 노인일자리와 참여 조건을 확인할 수 있습니다.' },
  { label: '부모님 돌봄이 필요해요', target: 'guide-care', text: '장기요양과 돌봄 절차를 어디서 시작할지 잡아보세요.' },
  { label: '치매나 건강이 걱정돼요', target: 'guide-dementia', text: '검진과 상담이 필요한 상황인지 차분히 살펴보세요.' },
  { label: '상속·사망 후 절차를 알아봐요', target: 'guide-inheritance', text: '가족 사망 후 재산과 채무 확인 순서를 정리합니다.' },
  { label: '내가 받을 혜택을 찾고 싶어요', target: 'originals', text: '보조금24와 공식 서비스에서 받을 수 있는 혜택을 더 찾아보세요.' },
];

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
            <h1>시니어 혜택 길잡이</h1>
            <p className="heroCopy">
              연금, 일자리, 돌봄, 가족 절차까지 내 상황에 맞는 공식 확인 경로를 쉽게 찾아보세요.
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
          </section>
        </div>
      </header>

      <section className="section situationSection" aria-label="상황별 선택">
        <div className="sectionHeading">
          <p className="eyebrow">내 상황부터 선택</p>
          <h2>지금 무엇이 필요하신가요?</h2>
        </div>
        <div className="situationGrid">
          {situationCards.map((card) => (
            <a key={card.label} className="situationCard" href={`#${card.target}`}>
              <strong>{card.label}</strong>
              <span>{card.text}</span>
            </a>
          ))}
        </div>
      </section>

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
            <strong>돌봄과 건강 상태 점검</strong>
            부모님 혼자 생활이 어려운지, 치매 검진이나 장기요양 상담이 필요한지 먼저
            살펴보면 좋습니다.
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
          <h2>많이 찾는 확인 항목</h2>
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
            article.url && !article.comingSoon ? (
              <a key={article.id} href={article.url}>
                <span>{article.title}</span>
                <small>{article.buttonText}</small>
              </a>
            ) : (
              <div key={article.id} className="pendingLink">
                <span>{article.title}</span>
                <small>준비중입니다</small>
              </div>
            )
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

      <section className="section disclaimer" aria-label="참고자료 안내">
        <strong>참고자료 안내</strong>
        <p>
          이 페이지는 정부24, 보조금24 및 각 공식 기관의 공개 안내를 쉽게 확인할 수 있도록 정리한 참고용 자료입니다.
          실제 지원 대상, 신청 가능 여부, 지급 금액, 제출 서류는 각 기관의 최신 공지와 심사 결과에 따라 달라질 수 있습니다.
        </p>
      </section>

      <footer className="footer">
        <strong>시니어 지원금 모아보기</strong>
        <span>각 항목은 공식 서비스 페이지로 연결됩니다.</span>
      </footer>
      <FontControls />
    </main>
  );
}
