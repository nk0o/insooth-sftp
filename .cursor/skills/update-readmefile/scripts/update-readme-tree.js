/**
 * README.md에 사이트 관리용 폴더 구조만 다시 쓴다.
 * Cafe24 module CSS/JS, SVG, 스킨 이미지, copy 사본은 넣지 않는다.
 *
 * node .cursor/skills/update-readmefile/scripts/update-readme-tree.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const README = path.join(ROOT, 'README.md');
const SKIP_NAMES = new Set(['.git', 'node_modules', '.cursor', '.vscode', 'README.md.tmp']);

const OVERVIEW_START = '<!-- folder-overview:start -->';
const OVERVIEW_END = '<!-- folder-overview:end -->';
const MAINT_START = '<!-- maint-tree:start -->';
const MAINT_END = '<!-- maint-tree:end -->';

const PAGE_DIRS = new Set([
  'about',
  'support',
  'shopinfo',
  'intro',
  'styleguide',
  'supply',
  'attend',
  'estimate',
  'coupon',
]);
const ENTRY_DIRS = new Set(['product', 'order', 'member', 'myshop']);
const QUIET_DIRS = new Set(['css', 'js', 'svg', 'SkinImg', 'smart-banner', 'ez', 'preference']);

const ENTRIES = {
  product: [
    'detail.html',
    'list.html',
    'list_product.html',
    'search.html',
    'sizeguide.html',
    'project.html',
  ],
  order: ['basket.html', 'orderform.html', 'order_result.html'],
  member: ['login.html', 'join.html', 'modify.html'],
  myshop: ['index.html', 'myshop_main.html', 'wish_list.html', 'order/list.html', 'order/detail.html'],
};

const TREE_ORDER = [
  'index.html',
  'robots.txt',
  'README.md',
  'layout',
  'about',
  'support',
  'shopinfo',
  'styleguide',
  'product',
  'order',
  'member',
  'myshop',
  'board',
  'intro',
  'coupon',
  'attend',
  'estimate',
  'supply',
  'config',
];

const DESCRIPTIONS = {
  'README.md': '이 문서',
  'index.html': '메인 페이지',
  'robots.txt': '검색 로봇 정책',
  about: '브랜드 소개',
  attend: '출석체크',
  board: '게시판',
  config: '스킨 설정',
  coupon: '쿠폰',
  css: 'Cafe24 module CSS',
  estimate: '견적',
  ez: '이지디자인 설정',
  intro: '인트로·성인인증',
  js: 'Cafe24 module JavaScript',
  layout: '공통 레이아웃',
  member: '회원',
  myshop: '마이쇼핑',
  order: '장바구니·주문서',
  preference: '환경설정',
  product: '상품',
  shopinfo: '쇼핑몰 안내',
  SkinImg: '스킨 이미지',
  'smart-banner': '스마트배너',
  styleguide: '스타일가이드',
  supply: '공급사',
  support: '고객지원',
  svg: 'SVG 아이콘',
};

const NOTES = {
  'index.html': '메인',
  'robots.txt': '검색 로봇 정책',
  'README.md': '폴더 구조',
  'layout/basic/header.html': '헤더',
  'layout/basic/footer.html': '푸터',
  'layout/basic/sidebar.html': '사이드바',
  'layout/basic/main.html': '메인 본문',
  'layout/basic/main_supply.html': '공급사 메인',
  'layout/basic/navigation.html': '내비게이션',
  'layout/basic/layout.html': '공통 레이아웃',
  'layout/basic/topbanner.html': '상단 배너',
  'layout/basic/quick.html': '퀵메뉴',
  'layout/basic/popup.html': '팝업',
  'layout/basic/intro.html': '인트로 레이아웃',
  'layout/basic/detail_layout.html': '상세 레이아웃',
  'layout/basic/state_login.html': '로그인 상태',
  'layout/basic/css/ap-layout.css': '공통 레이아웃',
  'layout/basic/css/ap-header.css': '헤더',
  'layout/basic/css/ap-footer.css': '푸터',
  'layout/basic/css/ap-sidebar.css': '사이드바',
  'layout/basic/css/ap-main.css': '메인',
  'layout/basic/css/ap-story.css': '브랜드 스토리',
  'layout/basic/css/ap-support.css': '고객지원',
  'layout/basic/css/ap-support-shell.css': '고객지원 셸',
  'layout/basic/css/ap-product.css': '상품 목록',
  'layout/basic/css/ap-product-detail.css': '상품 상세',
  'layout/basic/css/ap-order-basket.css': '장바구니',
  'layout/basic/js/layout.js': '레이아웃 동작',
  'layout/basic/js/main.js': '메인 동작',
  'layout/basic/js/common.js': '공통 스크립트',
  'layout/basic/js/basic.js': '기본 스크립트',
  'layout/basic/js/slide_menu.js': '슬라이드 메뉴',
  'layout/basic/js/popup.js': '팝업',
  'product/detail.html': '상품 상세',
  'product/list.html': '상품 목록',
  'product/list_product.html': '목록 상품 항목',
  'product/search.html': '검색',
  'product/sizeguide.html': '사이즈 가이드',
  'product/project.html': '프로젝트',
  'order/basket.html': '장바구니',
  'order/orderform.html': '주문서',
  'order/order_result.html': '주문 완료',
  'member/login.html': '로그인',
  'member/join.html': '회원가입',
  'member/modify.html': '회원정보 수정',
  'myshop/index.html': '마이쇼핑',
  'myshop/myshop_main.html': '마이쇼핑 메인',
  'myshop/wish_list.html': '관심상품',
  'myshop/order/list.html': '주문 내역',
  'myshop/order/detail.html': '주문 상세',
  'about/heritage.html': '헤리티지',
  'about/history.html': '히스토리',
  'about/insooth_story.html': '브랜드 스토리',
  'about/share_value.html': '공유가치',
  'about/technology.html': '기술',
  'support/faq.html': 'FAQ',
  'support/warranty.html': '보증',
  'support/where-to-buy.html': '구매처',
  'support/authentication.html': '정품인증',
  'support/authentication/index.html': '정품인증',
  'support/nav.html': '고객지원 메뉴',
  'shopinfo/company.html': '회사 소개',
  'shopinfo/guide.html': '이용안내',
  'board/index.html': '게시판 홈',
  'board/consult': '상담',
  'board/free': '자유게시판',
  'board/gallery': '갤러리',
  'board/inquiry': '문의',
  'board/memo': '메모',
  'board/opdiary': '운영일기',
  'board/product': '상품 게시판',
  'board/urgency': '긴급',
  'config/settings_data.json': '스킨 설정',
  'styleguide/index.html': '스타일가이드',
  'styleguide/styleguide.css': '스타일가이드 스타일',
  'intro/adult_certification.html': '성인인증',
  'intro/adult_i.html': '성인인증',
  'intro/adult_im.html': '성인인증',
  'intro/adult_i_recommend.html': '성인인증 추천',
  'intro/member.html': '회원 인트로',
  'coupon/coupon_zone.html': '쿠폰존',
  'coupon/coupon_list.html': '쿠폰 목록',
  'coupon/coupon_select.html': '쿠폰 선택',
  'coupon/coupon_productdetail.html': '상품 상세 쿠폰',
  'coupon/coupon_down_result.html': '쿠폰 다운로드 결과',
  'attend/stamp.html': '출석 스탬프',
  'attend/comment.html': '출석 댓글',
  'estimate/userform.html': '견적 작성',
  'estimate/print.html': '견적 출력',
  'supply/index.html': '공급사',
  'supply/main.html': '공급사 메인',
};

const TEMPLATE = `# Insooth Cafe24 스킨

사이트 관리자가 페이지와 레이아웃을 수정할 때 여는 폴더·파일 목록입니다.

브랜드·고객지원·안내 페이지, 공통 레이아웃, 커스텀 스타일(\`ap-\`), 상품·주문·회원·마이쇼핑의 대표 화면, 게시판 종류를 수록합니다. Cafe24 module CSS/JS, SVG, 스킨 이미지, 주문서 내부 조각, 파일명에 \`copy\`가 있는 사본은 목록에서 뺍니다.

목록을 다시 맞출 때는 스킬 \`update readmefile\`을 실행합니다. 프로젝트 루트에서 다음 명령과 같습니다.

\`\`\`bash
node .cursor/skills/update-readmefile/scripts/update-readme-tree.js
\`\`\`

최상위 표와 유지보수 파일 트리는 그 실행 결과로만 바뀝니다. 설명 문구는 \`.cursor/skills/update-readmefile/scripts/update-readme-tree.js\`의 \`DESCRIPTIONS\`, \`NOTES\`에서 고칩니다.

## 최상위

${OVERVIEW_START}
${OVERVIEW_END}

## 유지보수 파일

${MAINT_START}
${MAINT_END}
`;

function skip(name) {
  return SKIP_NAMES.has(name) || /copy/i.test(name);
}

function toRel(abs) {
  return path.relative(ROOT, abs).split(path.sep).join('/');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function readEntries(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).filter((entry) => !skip(entry.name));
}

function compareName(a, b) {
  return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
}

function noteFor(rel) {
  return NOTES[rel] || '';
}

function descriptionFor(name) {
  return DESCRIPTIONS[name] || '추가된 항목';
}

function isVendorJs(name) {
  return name.includes('swiper') || name.endsWith('.min.js');
}

function makeNode(name, note) {
  return { name, note: note || '', children: [] };
}

function addPath(nodes, rel) {
  const abs = path.join(ROOT, rel);
  const onDisk = rel === 'README.md' || fs.existsSync(abs);
  if (!onDisk) return;
  const isDir = rel !== 'README.md' && fs.statSync(abs).isDirectory();
  const parts = rel.split('/');
  let level = nodes;
  let acc = '';
  parts.forEach((part, index) => {
    acc = acc ? `${acc}/${part}` : part;
    const last = index === parts.length - 1;
    const label = !last || isDir ? `${part}/` : part;
    let node = level.find((item) => item.name === label);
    if (!node) {
      node = makeNode(label, last ? noteFor(rel) : '');
      level.push(node);
    } else if (last && !node.note) {
      node.note = noteFor(rel);
    }
    level = node.children;
  });
}

function addHtmlTree(nodes, rel) {
  readEntries(rel).forEach((entry) => {
    const child = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      addHtmlTree(nodes, child);
      return;
    }
    if (/\.(html|css|json)$/i.test(entry.name)) addPath(nodes, child);
  });
}

function addLayout(nodes) {
  readEntries('layout/basic')
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .sort((a, b) => compareName(a.name, b.name))
    .forEach((entry) => addPath(nodes, `layout/basic/${entry.name}`));

  readEntries('layout/basic/css')
    .filter((entry) => entry.isFile() && entry.name.startsWith('ap-') && entry.name.endsWith('.css'))
    .sort((a, b) => compareName(a.name, b.name))
    .forEach((entry) => addPath(nodes, `layout/basic/css/${entry.name}`));

  readEntries('layout/basic/js')
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js') && !isVendorJs(entry.name))
    .sort((a, b) => compareName(a.name, b.name))
    .forEach((entry) => addPath(nodes, `layout/basic/js/${entry.name}`));
}

function addEntries(nodes, dir) {
  (ENTRIES[dir] || []).forEach((file) => addPath(nodes, `${dir}/${file}`));
}

function addBoard(nodes) {
  if (exists('board/index.html')) addPath(nodes, 'board/index.html');
  readEntries('board')
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => compareName(a.name, b.name))
    .forEach((entry) => addPath(nodes, `board/${entry.name}`));
}

function addConfig(nodes) {
  if (exists('config/settings_data.json')) addPath(nodes, 'config/settings_data.json');
}

function hasPageFile(rel) {
  if (!fs.existsSync(path.join(ROOT, rel))) return false;
  const stack = [rel];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of readEntries(current)) {
      const child = current ? `${current}/${entry.name}` : entry.name;
      if (entry.isDirectory()) stack.push(child);
      else if (/\.(html|css|json)$/i.test(entry.name)) return true;
    }
  }
  return false;
}

function policyFor(name, isDir) {
  if (!isDir) {
    if (name === 'index.html') return '메인';
    if (name === 'robots.txt') return '검색 로봇';
    if (name === 'README.md') return '이 문서';
    return '파일';
  }
  if (name === 'layout') return '레이아웃·ap 스타일';
  if (PAGE_DIRS.has(name)) return '페이지';
  if (ENTRY_DIRS.has(name)) return '대표 화면';
  if (name === 'board') return '게시판 폴더';
  if (name === 'config') return '설정 파일';
  if (QUIET_DIRS.has(name)) return '폴더만';
  return hasPageFile(name) ? '페이지' : '폴더만';
}

function topLevelEntries() {
  const entries = fs.readdirSync(ROOT, { withFileTypes: true }).filter((entry) => {
    if (SKIP_NAMES.has(entry.name)) return false;
    if (entry.isDirectory()) return true;
    return entry.name === 'index.html' || entry.name === 'robots.txt' || entry.name === 'README.md';
  });
  if (!entries.some((entry) => entry.name === 'README.md')) {
    entries.push({ name: 'README.md', isDirectory: () => false });
  }
  entries.sort((a, b) => {
    const ai = TREE_ORDER.indexOf(a.name);
    const bi = TREE_ORDER.indexOf(b.name);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    return compareName(a.name, b.name);
  });
  return entries;
}

function renderOverview() {
  const rows = topLevelEntries().map((entry) => {
    const isDir = entry.isDirectory();
    const label = isDir ? `${entry.name}/` : entry.name;
    return `| \`${label.replace(/\|/g, '\\|')}\` | ${descriptionFor(entry.name)} | ${policyFor(entry.name, isDir)} |`;
  });
  return ['| 경로 | 설명 | 수록 |', '| --- | --- | --- |', ...rows].join('\n');
}

function collectNodes() {
  const nodes = [];
  addPath(nodes, 'index.html');
  addPath(nodes, 'robots.txt');
  addPath(nodes, 'README.md');
  addLayout(nodes);
  PAGE_DIRS.forEach((dir) => {
    if (exists(dir)) addHtmlTree(nodes, dir);
  });
  ENTRY_DIRS.forEach((dir) => addEntries(nodes, dir));
  if (exists('board')) addBoard(nodes);
  if (exists('config')) addConfig(nodes);

  topLevelEntries()
    .filter((entry) => entry.isDirectory())
    .forEach((entry) => {
      const name = entry.name;
      if (
        PAGE_DIRS.has(name) ||
        ENTRY_DIRS.has(name) ||
        QUIET_DIRS.has(name) ||
        name === 'layout' ||
        name === 'board' ||
        name === 'config'
      ) {
        return;
      }
      if (hasPageFile(name)) addHtmlTree(nodes, name);
    });

  sortNodes(nodes, true);
  return nodes;
}

function sortNodes(nodes, atRoot) {
  nodes.sort((a, b) => {
    const aKey = a.name.replace(/\/$/, '');
    const bKey = b.name.replace(/\/$/, '');
    if (atRoot) {
      const ai = TREE_ORDER.indexOf(aKey);
      const bi = TREE_ORDER.indexOf(bKey);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return compareName(a.name, b.name);
    }
    const rank = (name) => (name.endsWith('/') ? 1 : 0);
    const byRank = rank(a.name) - rank(b.name);
    if (byRank !== 0) return byRank;
    return compareName(a.name, b.name);
  });
  nodes.forEach((node) => sortNodes(node.children, false));
}

function renderTree(nodes) {
  const lines = ['.'];
  function walk(level, prefix) {
    level.forEach((node, index) => {
      const last = index === level.length - 1;
      const branch = last ? '└── ' : '├── ';
      const note = node.note ? ` — ${node.note}` : '';
      lines.push(`${prefix}${branch}${node.name}${note}`);
      walk(node.children, prefix + (last ? '    ' : '│   '));
    });
  }
  walk(nodes, '');
  return ['```text', ...lines, '```'].join('\n');
}

function replaceSection(source, start, end, body) {
  const startIdx = source.indexOf(start);
  const endIdx = source.indexOf(end);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`README marker missing: ${start}`);
  }
  return `${source.slice(0, startIdx + start.length)}\n${body}\n${source.slice(endIdx)}`;
}

function updateReadme() {
  const existsFile = fs.existsSync(README);
  let source = existsFile ? fs.readFileSync(README, 'utf8') : TEMPLATE;
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  source = source.replace(/\r\n/g, '\n');

  if (!source.includes(OVERVIEW_START) || !source.includes(MAINT_START)) {
    console.error('README.md 구조 마커가 없어 갱신을 건너뜁니다.');
    return false;
  }

  let next = replaceSection(source, OVERVIEW_START, OVERVIEW_END, renderOverview());
  next = replaceSection(next, MAINT_START, MAINT_END, renderTree(collectNodes()));
  if (newline === '\r\n') next = next.replace(/\n/g, '\r\n');

  if (existsFile && fs.readFileSync(README, 'utf8') === next) return false;

  const tmp = `${README}.tmp`;
  fs.writeFileSync(tmp, next);
  fs.copyFileSync(tmp, README);
  fs.rmSync(tmp, { force: true });
  return true;
}

function main() {
  try {
    const changed = updateReadme();
    console.log(changed ? 'README.md를 갱신했습니다.' : 'README.md는 이미 최신입니다.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}
