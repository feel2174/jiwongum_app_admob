'use client';

import { useMemo, useState } from 'react';

const filters = ['전체', '연금', '일자리', '건강보험', '생활가이드'];

const formatDate = (date) => date.replaceAll('-', '.');

function ArticleCard({ article, index }) {
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
              <h4>무엇을 확인하는 항목인가요</h4>
              <p>{article.description}</p>
            </section>

            <section className="detailSection">
              <h4>누가 보면 좋을까요</h4>
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
              <h4>확인할 것</h4>
              <div className="checkGrid">
                {article.checklist.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>

            <p className="beforeButton">{article.beforeButton}</p>
            <div className="cardActions">
              <a className="readButton" href={article.url}>
                {article.buttonText}
              </a>
              <button type="button" className="collapseButton" onClick={() => setExpanded(false)}>
                접기
              </button>
            </div>
          </div>
        ) : (
          <a className="readButton compactButton" href={article.url}>
            {article.buttonText}
          </a>
        )}
      </div>
    </article>
  );
}

export default function ArticleExplorer({ articles }) {
  const [activeFilter, setActiveFilter] = useState('전체');

  const filteredArticles = useMemo(() => {
    if (activeFilter === '전체') return articles;
    return articles.filter((article) => article.group === activeFilter);
  }, [activeFilter, articles]);

  return (
    <div className="articleExplorer">
      <div className="filterBar" aria-label="상황별 보기">
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
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>
    </div>
  );
}
