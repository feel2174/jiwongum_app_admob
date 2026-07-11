// 1회성 마이그레이션: src/data/mock.js의 SEED_ARTICLES(기존 mock 41개 글)를
// Supabase articles 테이블에 published:true로 밀어넣는다.
// 완료 후에는 이 스크립트를 지워도 된다.
//
// 사용법:
//   SUPABASE_URL=https://xxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=xxxxx \
//   node scripts/migrate-articles.js
//
// service role key를 쓰는 이유: RLS상 anon/authenticated가 아닌 서버 컨텍스트에서
// 대량 insert를 한 번에 처리하기 위함. 이 키는 앱/어드민 어디에도 커밋하지 말 것.

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.');
  process.exit(1);
}

function loadSeedArticles() {
  const mockPath = path.join(__dirname, '..', 'src', 'data', 'mock.js');
  const text = fs.readFileSync(mockPath, 'utf8');
  const match = text.match(/export const SEED_ARTICLES = (\[[\s\S]*?\n\]);/);
  if (!match) throw new Error('mock.js에서 SEED_ARTICLES 배열을 찾지 못했습니다.');
  return JSON.parse(match[1]);
}

async function main() {
  const seed = loadSeedArticles();
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const rows = seed.map((a) => ({
    title: a.title,
    summary: a.summary,
    url: a.url,
    category: a.category,
    situations: a.situations,
    regions: a.regions,
    date: a.date,
    published: true,
  }));

  console.log(`${rows.length}개 글을 마이그레이션합니다...`);
  const { data, error } = await supabase.from('articles').insert(rows).select('id, title');
  if (error) {
    console.error('마이그레이션 실패:', error.message);
    process.exit(1);
  }
  console.log(`완료: ${data.length}개 삽입됨.`);
}

main();
