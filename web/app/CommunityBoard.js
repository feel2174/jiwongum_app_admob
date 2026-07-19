'use client';

import { useEffect, useMemo, useState } from 'react';
import { communitySupabase } from './communitySupabase';

const CLIENT_ID_KEY = 'senior-community-client-id';

const samplePost = {
  id: 'sample-basic-pension',
  policy: '기초연금 모의계산·신청 방법',
  title: '모의계산할 때 재산 입력을 어디까지 해야 하나요?',
  body: '부모님 집이 공동명의라서 재산을 어떻게 넣어야 할지 헷갈렸습니다. 먼저 대략 입력해보고, 주민센터 상담으로 한 번 더 확인하는 방식이 좋았습니다.',
  author: '선발대 1번',
  likes: 8,
  replies: [
    {
      id: 'reply-basic-1',
      author: '연금 확인 선배',
      body: '모의계산은 대략적인 방향을 보는 용도라서 먼저 아는 범위 안에서 입력해도 괜찮았습니다. 최종 판단은 신청 후 심사에서 정해집니다.',
      replies: [
        {
          id: 'nested-basic-1',
          author: '작성자',
          body: '그럼 먼저 대략 입력해보고 상담을 받아보겠습니다.',
        },
      ],
    },
  ],
  createdAt: '오늘',
  isSample: true,
};

const nicknameWords = [
  '감귤',
  '포도',
  '자두',
  '복숭아',
  '살구',
  '참외',
  '수박',
  '딸기',
  '사과',
  '바나나',
  '달고나',
  '팽이',
  '딱지',
  '구슬',
  '윷놀이',
  '숨바꼭질',
  '제기',
  '공기',
  '연날리기',
  '소풍',
  '햇살',
  '마실',
  '동네',
  '다정',
  '느티나무',
];

function makeNickname() {
  const word = nicknameWords[Math.floor(Math.random() * nicknameWords.length)];
  const shortWord = word.replace(/\s/g, '').slice(0, 5);
  const number = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  return `${shortWord}${number}`;
}

function getClientId() {
  if (typeof window === 'undefined') return '';

  const existing = window.localStorage.getItem(CLIENT_ID_KEY);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  window.localStorage.setItem(CLIENT_ID_KEY, generated);
  return generated;
}

function countComments(post) {
  return post.replies.reduce((total, reply) => total + 1 + reply.replies.length, 0);
}

function getSearchText(post) {
  const replyText = post.replies
    .map((reply) => `${reply.author} ${reply.body} ${reply.replies.map((nested) => `${nested.author} ${nested.body}`).join(' ')}`)
    .join(' ');
  return `${post.policy} ${post.title} ${post.body} ${post.author} ${replyText}`;
}

function formatDate(dateValue) {
  if (!dateValue) return '방금 전';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '방금 전';

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function buildPosts(rows, likedPostIds) {
  return rows.map((row) => {
    const flatReplies = row.community_replies || [];
    const rootReplies = flatReplies
      .filter((reply) => !reply.parent_reply_id)
      .map((reply) => ({
        id: reply.id,
        author: reply.author_label,
        body: reply.body,
        replies: flatReplies
          .filter((nested) => nested.parent_reply_id === reply.id)
          .map((nested) => ({
            id: nested.id,
            author: nested.author_label,
            body: nested.body,
          })),
      }));

    return {
      id: row.id,
      policy: row.policy,
      title: row.title,
      body: row.body,
      author: row.author_label,
      likes: row.likes_count || 0,
      replies: rootReplies,
      createdAt: formatDate(row.created_at),
      isLiked: likedPostIds.includes(row.id),
      isSample: false,
    };
  });
}

export default function CommunityBoard({ policies, variant = 'full' }) {
  const policyOptions = useMemo(() => policies.map((policy) => policy.title), [policies]);
  const [posts, setPosts] = useState([]);
  const [clientId, setClientId] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(policyOptions[0] ?? '');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [notice, setNotice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('latest');
  const [openReplyForms, setOpenReplyForms] = useState({});
  const [replyDrafts, setReplyDrafts] = useState({});
  const [nestedDrafts, setNestedDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  async function loadCommunity(nextClientId = clientId) {
    if (!communitySupabase) {
      setLoadError('커뮤니티 연결 정보를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError('');

    const { data: likedRows, error: likedError } = await communitySupabase
      .from('community_likes')
      .select('post_id')
      .eq('client_id', nextClientId);

    const { data, error } = await communitySupabase
      .from('community_posts')
      .select('id, policy, title, body, author_label, likes_count, created_at, community_replies(id, post_id, parent_reply_id, body, author_label, created_at)')
      .order('created_at', { ascending: false })
      .order('created_at', { foreignTable: 'community_replies', ascending: true });

    if (error || likedError) {
      setLoadError('커뮤니티 글을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.');
      setPosts([]);
      setLoading(false);
      return;
    }

    const likedPostIds = (likedRows || []).map((row) => row.post_id);
    setPosts(buildPosts(data || [], likedPostIds));
    setLoading(false);
  }

  useEffect(() => {
    const nextClientId = getClientId();
    setClientId(nextClientId);
    loadCommunity(nextClientId);
  }, []);

  const filteredPosts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const source = keyword
      ? posts.filter((post) => getSearchText(post).toLowerCase().includes(keyword))
      : posts;

    if (sortMode === 'replies') {
      return [...source].sort((a, b) => countComments(b) - countComments(a));
    }

    return source;
  }, [posts, searchTerm, sortMode]);

  const visiblePosts = variant === 'preview' ? [samplePost] : filteredPosts;

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanBody = body.trim();

    if (!cleanTitle || !cleanBody) {
      setNotice('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    const { error } = await communitySupabase.from('community_posts').insert({
      policy: selectedPolicy,
      title: cleanTitle,
      body: cleanBody,
      author_label: makeNickname(),
    });

    if (error) {
      setNotice('글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    setTitle('');
    setBody('');
    setNotice('글이 등록되었습니다.');
    await loadCommunity();
  }

  async function handleLike(post) {
    if (post.isSample) return;

    if (post.isLiked) {
      await communitySupabase.from('community_likes').delete().eq('post_id', post.id).eq('client_id', clientId);
      await communitySupabase
        .from('community_posts')
        .update({ likes_count: Math.max(0, post.likes - 1) })
        .eq('id', post.id);
    } else {
      await communitySupabase.from('community_likes').insert({ post_id: post.id, client_id: clientId });
      await communitySupabase
        .from('community_posts')
        .update({ likes_count: post.likes + 1 })
        .eq('id', post.id);
    }

    await loadCommunity();
  }

  function toggleReplyForm(key) {
    setOpenReplyForms((current) => ({ ...current, [key]: !current[key] }));
  }

  async function handleReplySubmit(event, postId) {
    event.preventDefault();
    const cleanReply = (replyDrafts[postId] || '').trim();
    if (!cleanReply) return;

    const { error } = await communitySupabase.from('community_replies').insert({
      post_id: postId,
      body: cleanReply,
      author_label: makeNickname(),
    });

    if (!error) {
      setReplyDrafts((current) => ({ ...current, [postId]: '' }));
      setOpenReplyForms((current) => ({ ...current, [postId]: false }));
      await loadCommunity();
    }
  }

  async function handleNestedReplySubmit(event, postId, replyId) {
    event.preventDefault();
    const draftKey = `${postId}-${replyId}`;
    const cleanReply = (nestedDrafts[draftKey] || '').trim();
    if (!cleanReply) return;

    const { error } = await communitySupabase.from('community_replies').insert({
      post_id: postId,
      parent_reply_id: replyId,
      body: cleanReply,
      author_label: makeNickname(),
    });

    if (!error) {
      setNestedDrafts((current) => ({ ...current, [draftKey]: '' }));
      setOpenReplyForms((current) => ({ ...current, [draftKey]: false }));
      await loadCommunity();
    }
  }

  function renderPost(post) {
    const isLiked = post.isLiked;

    return (
      <article key={post.id} className={post.isSample ? 'communityPost samplePost' : 'communityPost'}>
        <div className="postTop">
          <div className="avatar" aria-hidden="true">{post.author.slice(0, 1)}</div>
          <div className="postTopText">
            <strong>{post.author}</strong>
            <span>{post.createdAt} · {post.policy}</span>
          </div>
        </div>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
        <div className="postFooter">
          <button
            type="button"
            className={isLiked ? 'likeButton isLiked' : 'likeButton'}
            aria-pressed={!!isLiked}
            disabled={post.isSample}
            onClick={() => handleLike(post)}
          >
            <span aria-hidden="true">♥</span>
            공감 {post.likes || 0}
          </button>
          {!post.isSample ? (
            <button type="button" onClick={() => toggleReplyForm(post.id)}>
              댓글 남기기
            </button>
          ) : null}
          <strong>댓글 {countComments(post)}개</strong>
        </div>
        <div className="replyList" aria-label={`${post.title} 댓글 목록`}>
          {post.replies.length > 0 ? (
            post.replies.map((reply, replyIndex) => {
              const draftKey = `${post.id}-${reply.id}`;

              return (
                <div key={reply.id} className={`replyItem ${replyIndex > 0 ? 'isNested' : ''}`}>
                  <span className="replyMarker">ㄴ</span>
                  <div>
                    <strong>{reply.author}</strong>
                    <p>{reply.body}</p>
                    {!post.isSample ? (
                      <button type="button" className="replyAction" onClick={() => toggleReplyForm(draftKey)}>
                        대댓글 남기기
                      </button>
                    ) : null}
                    {openReplyForms[draftKey] ? (
                      <form className="replyForm nestedReplyForm" onSubmit={(event) => handleNestedReplySubmit(event, post.id, reply.id)}>
                        <label htmlFor={`reply-${draftKey}`}>대댓글 입력</label>
                        <div className="replyInputRow">
                          <input
                            id={`reply-${draftKey}`}
                            value={nestedDrafts[draftKey] || ''}
                            onChange={(event) => setNestedDrafts((current) => ({ ...current, [draftKey]: event.target.value }))}
                            placeholder="대댓글을 입력해 주세요."
                            maxLength={160}
                          />
                          <button type="submit">등록</button>
                        </div>
                      </form>
                    ) : null}
                    {reply.replies.map((nested) => (
                      <div key={nested.id} className="nestedReplyItem">
                        <span className="replyMarker">ㄴ</span>
                        <div>
                          <strong>{nested.author}</strong>
                          <p>{nested.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="replyEmpty">아직 댓글이 없습니다. 첫 댓글을 기다리는 글입니다.</div>
          )}
        </div>
        {openReplyForms[post.id] ? (
          <form className="replyForm" onSubmit={(event) => handleReplySubmit(event, post.id)}>
            <label htmlFor={`reply-${post.id}`}>댓글 입력</label>
            <div className="replyInputRow">
              <input
                id={`reply-${post.id}`}
                value={replyDrafts[post.id] || ''}
                onChange={(event) => setReplyDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                placeholder="댓글을 입력해 주세요."
                maxLength={180}
              />
              <button type="submit">등록</button>
            </div>
          </form>
        ) : null}
      </article>
    );
  }

  return (
    <section className={`section communitySection ${variant === 'preview' ? 'communityPreview' : ''}`} id="community" aria-label="선발대">
      <div className="communityHeader">
        <div>
          <p className="eyebrow">선발대</p>
          <h2>먼저 확인한 사람들의 질문과 댓글</h2>
          <p>
            같은 혜택을 먼저 눌러본 사람들이 남긴 질문을 읽고, 내 상황도 가볍게 남겨보세요.
            다른 사람들의 질문과 댓글을 보며 내 상황도 편하게 남겨보세요.
          </p>
        </div>
        <div className="communityStats" aria-label="질문 요약">
          <strong>{posts.length}</strong>
          <span>실제 질문</span>
        </div>
      </div>

      {variant === 'preview' ? (
        <div className="communityPreviewActions">
          <a className="readButton" href="/community">
            선발대 보러가기
          </a>
        </div>
      ) : null}

      {variant === 'full' ? (
        <>
          <div className="communityFeed sampleFeed" aria-label="대표 질문">
            {renderPost(samplePost)}
          </div>

          <div className="communitySearch" role="search">
            <label htmlFor="communitySearchInput">실제 질문 검색</label>
            <div className="searchInputWrap">
              <input
                id="communitySearchInput"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="기초연금, 돌봄, 치매처럼 입력"
              />
              {searchTerm ? (
                <button type="button" onClick={() => setSearchTerm('')}>
                  지우기
                </button>
              ) : null}
            </div>
            <p>
              등록된 정책명, 질문, 댓글을 함께 찾습니다.
              {searchTerm ? ` 현재 ${filteredPosts.length}개 글이 보입니다.` : ''}
            </p>
          </div>

          <div className="communityTabs" aria-label="글 정렬">
            <button type="button" aria-pressed={sortMode === 'latest'} onClick={() => setSortMode('latest')}>
              최신순
            </button>
            <button type="button" aria-pressed={sortMode === 'replies'} onClick={() => setSortMode('replies')}>
              댓글 많은 글
            </button>
          </div>
        </>
      ) : null}

      <div className="communityShell">
        {variant === 'full' ? (
          <form className="communityForm" onSubmit={handleSubmit}>
            <label htmlFor="policySelect">궁금한 정책</label>
            <select id="policySelect" value={selectedPolicy} onChange={(event) => setSelectedPolicy(event.target.value)}>
              {policyOptions.map((policy) => (
                <option key={policy} value={policy}>{policy}</option>
              ))}
            </select>

            <label htmlFor="communityTitle">질문 제목</label>
            <input
              id="communityTitle"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="예: 기초연금 신청 전에 뭘 준비해야 하나요?"
              maxLength={70}
            />

            <label htmlFor="communityBody">내용</label>
            <textarea
              id="communityBody"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="상황을 짧게 적어보세요. 개인정보, 주민번호, 계좌번호는 입력하지 마세요."
              rows={5}
              maxLength={360}
            />

            <div className="communityRuleNotice formRuleNotice">
              상대를 비방하거나 욕설, 개인정보 노출, 광고성 내용이 포함된 댓글은 별도 경고 없이 삭제할 수 있습니다.
            </div>

            <button type="submit">질문 남기기</button>
            {notice ? <p className="formNotice">{notice}</p> : null}
          </form>
        ) : null}

        <div className="communityFeed" aria-label="실제 선발대 글 목록">
          {loading ? (
            <div className="communityEmpty">실제 커뮤니티 글을 불러오는 중입니다.</div>
          ) : loadError ? (
            <div className="communityEmpty">{loadError}</div>
          ) : visiblePosts.length > 0 ? (
            visiblePosts.map(renderPost)
          ) : (
            <div className="communityEmpty">
              아직 실제 등록된 질문이 없습니다. 첫 질문을 남겨보세요.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
