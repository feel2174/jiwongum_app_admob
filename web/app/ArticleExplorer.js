'use client';

import { useMemo, useState } from 'react';

const filters = ['전체', '연금·노후소득', '일자리·활동', '건강·돌봄', '가족 대신 확인', '생활비·공공요금'];

const formatDate = (date) => date.replaceAll('-', '.');

function ArticleLink({ article, className, onComingSoon }) {
  if (!article.url || article.comingSoon) {
    return (
      <button type="button" className={className} onClick={() => onComingSoon(article)}>
        {article.buttonText}
      </button>
    );
  }

  return (
    <a className={className} href={article.url}>
      {article.buttonText}
    </a>
  );
}

function ArticleCard({ article, index, onComingSoon }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={`articlePanel ${expanded ? 'isExpanded' : ''}`} id={article.id}>
      <div className="articleNumber">{String(index + 1).padStart(2, '0')}</div>
      <div className="articleBody">
        <div className="metaRow">
          <span>{article.group}</span>
          <span>{formatDate(article.date)}</span>
        </div>
        <h3>{article.title}</h3>
        <p className="lead">{article.summary}</p>
        <p className="hookText">{article.hook}</p>

        <div className="collapsedPreview" aria-hidden={expanded}>
          <p>{article.description}</p>
          {!expanded ? (
            <button type="button" className="expandButton" onClick={() => setExpanded(true)}>
              더 읽기 ↓
            </button>
          ) : null}
        </div>

        {expanded ? (
          <div className="expandedContent">
            <section className="detailSection descriptionSection">
              <h4>무엇을 알 수 있나요</h4>
              <p>{article.description}</p>
            </section>

            <section className="detailSection">
              <h4>이런 분이 확인하세요</h4>
              <p>{article.audience}</p>
            </section>

            <section className="detailSection">
              <h4>핵심 정리</h4>
              <ul>
                {article.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="detailSection">
              <h4>먼저 준비할 것</h4>
              <div className="checkGrid">
                {article.checklist.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>

            <p className="beforeButton">{article.beforeButton}</p>
            <div className="cardActions">
              <ArticleLink article={article} className="readButton" onComingSoon={onComingSoon} />
              <button type="button" className="collapseButton" onClick={() => setExpanded(false)}>
                접기
              </button>
            </div>
          </div>
        ) : (
          <ArticleLink article={article} className="readButton compactButton" onComingSoon={onComingSoon} />
        )}
      </div>
    </article>
  );
}

export default function ArticleExplorer({ articles }) {
  const [activeFilter, setActiveFilter] = useState('전체');
  const [modalArticle, setModalArticle] = useState(null);

  const filteredArticles = useMemo(() => {
    if (activeFilter === '전체') return articles;
    return articles.filter((article) => article.group === activeFilter);
  }, [activeFilter, articles]);

  return (
    <div className="articleExplorer">
      <div className="filterBar" aria-label="분류별 보기">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="resultCount">
        <strong>{filteredArticles.length}개</strong>
        <span>항목을 보여드리고 있습니다.</span>
      </div>

      <div className="articleList">
        {filteredArticles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            index={index}
            onComingSoon={setModalArticle}
          />
        ))}
      </div>

      {modalArticle ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="comingSoonTitle">
          <div className="comingSoonModal">
            <h3 id="comingSoonTitle">준비중입니다</h3>
            <p>
              <strong>{modalArticle.title}</strong> 항목은 공식 링크와 상세 내용을 정리하고 있습니다.
            </p>
            <p>곧 공식 안내 기준으로 추가하겠습니다.</p>
            <button type="button" onClick={() => setModalArticle(null)}>
              확인
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
