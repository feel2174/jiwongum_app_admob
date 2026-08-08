import FontControls from './FontControls';
import ArticleExplorer from './ArticleExplorer';
import { seniorArticles } from './seniorArticles';
import { pickTodaysBenefit } from './todaysBenefit';

// 한국(KST) 기준 오늘 날짜로 '오늘의 혜택' 선택 (서버 타임존이 UTC여도 하루가 밀리지 않게).
function kstToday() {
  const now = new Date();
  return new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60 * 1000);
}

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
  const todays = pickTodaysBenefit(seniorArticles, kstToday());

  return (
    <main>
      <header className="hero">
        <div className="heroGrid">
          <div>
            <p className="eyebrow">시니어 서포트 · Senior Support</p>
            <h1>시니어 서포트</h1>
            <p className="heroCopy">
              받을 수 있는 지원금을 낱말 하나로 찾아보세요.
            </p>
            <div className="heroActions">
              <a className="primaryCta" href="/search">🔎 지원금 검색하기</a>
            </div>
          </div>
        </div>
      </header>

      {todays ? (
        <section className="section todaysBenefit" aria-label="오늘의 혜택">
          <p className="eyebrow">오늘의 혜택</p>
          <h2>{todays.title}</h2>
          <p className="todaysSummary">{todays.summary}</p>
          {todays.url && !todays.comingSoon ? (
            <a className="readButton" href={todays.url}>{todays.buttonText || '자세히 보기'}</a>
          ) : (
            <a className="readButton" href="/search">지원금 검색하기</a>
          )}
        </section>
      ) : null}

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

      <section className="section askSection" aria-label="궁금한 점 물어보기">
        <div className="sectionHeading">
          <p className="eyebrow">도움이 필요하면</p>
          <h2>궁금한 점 물어보기</h2>
        </div>
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
        <strong>시니어 서포트</strong>
        <span>이 사이트는 공식 기관이 아닌 참고용 안내 서비스입니다. 각 항목은 공식 서비스 페이지로 연결됩니다.</span>
        <nav className="footerSources" aria-label="공식 정부 출처">
          <span className="footerSourcesLabel">공식 출처</span>
          <a href="https://www.gov.kr">정부24 (www.gov.kr)</a>
          <a href="https://www.bokjiro.go.kr">복지로 (bokjiro.go.kr)</a>
          <a href="https://basicpension.mohw.go.kr">기초연금 (mohw.go.kr)</a>
          <a href="https://www.nps.or.kr">국민연금공단 (nps.or.kr)</a>
          <a href="https://www.nhis.or.kr">국민건강보험공단 (nhis.or.kr)</a>
        </nav>
      </footer>
      <FontControls />
    </main>
  );
}
