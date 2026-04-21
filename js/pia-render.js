/**
 * pia-render.js v2 — allPIAData 기반 영향평가 가이드 렌더러
 *
 * 사용하는 데이터 변수: allPIAData (js/allPIAData.js에서 정의)
 * 항목 스키마:
 *   { code, subField, question, checkPoints[], guideExplanation[], terms, legalBasis[], advisory }
 */

/* ══════════════════════════════════════════════════════
   섹션 레이블 (code 첫 자리 기준)
══════════════════════════════════════════════════════ */
const PIA_SECTION_LABELS = {
  '1': '1. 대상기관 개인정보 보호 관리체계',
  '2': '2. 대상시스템의 개인정보 보호 관리체계',
  '3': '3. 개인정보 처리단계별 보호조치',
  '4': '4. 대상시스템의 기술적 보호조치',
  '5': '5. 특정 IT 기술 활용 시 개인정보 보호'
};

/* ══════════════════════════════════════════════════════
   [1순위] 질의문 기반 수동 축약명 맵
   subField가 중복되는 항목에 대해 question 핵심 키워드 추출.
   데이터(subField) 자체는 변경하지 않음 — 렌더 시점에만 사용.
══════════════════════════════════════════════════════ */
const PIA_DISPLAY_NAME_MAP = {
  /* 1.2 내부 관리계획 수립 (2개) */
  '1.2.1': '내부 관리계획 (수립·시행)',
  '1.2.2': '내부 관리계획 (이행 점검)',

  /* 1.4 정보주체 권리보장 방법 안내 (2개) */
  '1.4.2': '권리보장 안내 (이의 절차)',
  '1.4.3': '권리보장 안내 (이용·제공 통지)',

  /* 3.1 개인정보 수집의 적합성 (5개) */
  '3.1.1': '수집 적합성 (법적 근거·동의)',
  '3.1.2': '수집 적합성 (최소 수집)',
  '3.1.3': '수집 적합성 (민감정보)',
  '3.1.4': '수집 적합성 (고유식별정보)',
  '3.1.5': '수집 적합성 (주민등록번호)',
  /* 3.1 동의받는 방법의 적절성 (5개) */
  '3.1.6':  '동의 방법 (자유로운 의사)',
  '3.1.7':  '동의 방법 (아동·법정대리인)',
  '3.1.8':  '동의 방법 (서면 동의)',
  '3.1.9':  '동의 방법 (처리 근거 공개)',
  '3.1.10': '동의 방법 (민감정보 공개)',
  /* 3.3 개인정보 제공의 적합성 (2개) */
  '3.3.1': '제공 적합성 (법적 근거)',
  '3.3.2': '제공 적합성 (최소 제공)',
  /* 3.3 목적 외 이용·제공 제한 (4개) */
  '3.3.3': '목적 외 제한 (별도 동의)',
  '3.3.4': '목적 외 제한 (최소 항목)',
  '3.3.5': '목적 외 제한 (관리대장)',
  '3.3.6': '목적 외 제한 (공개 의무)',
  /* 3.4 수탁사 관리 감독 (2개) */
  '3.4.3': '수탁사 관리 (재위탁 동의)',
  '3.4.4': '수탁사 관리 (교육·점검)',
  /* 4.1 계정 관리 (2개) */
  '4.1.1': '계정 관리 (개별 계정)',
  '4.1.2': '계정 관리 (보안 서약)',
  /* 4.1 인증 관리 (6개) */
  '4.1.3': '인증 관리 (인증수단 적용)',
  '4.1.4': '인증 관리 (추가 인증)',
  '4.1.5': '인증 관리 (강화 인증)',
  '4.1.6': '인증 관리 (실패 횟수 제한)',
  '4.1.7': '인증 관리 (자동 접속 차단)',
  '4.1.8': '인증 관리 (비정상 접근 방지)',
  /* 4.1 권한 관리 (5개) */
  '4.1.9':  '권한 관리 (변경·말소)',
  '4.1.10': '권한 관리 (변경 기록)',
  '4.1.11': '권한 관리 (최소 권한)',
  '4.1.12': '권한 관리 (인사 연계)',
  '4.1.13': '권한 관리 (접근 현황 점검)',
  /* 4.2 접근통제 조치 (5개) */
  '4.2.1': '접근통제 (침입 탐지)',
  '4.2.2': '접근통제 (원격 접속)',
  '4.2.3': '접근통제 (노출 방지)',
  '4.2.4': '접근통제 (관리 단말기)',
  '4.2.5': '접근통제 (다운로드 기록)',
  /* 4.3 저장 시 암호화 (3개) */
  '4.3.1': '저장 암호화 (중요 개인정보)',
  '4.3.2': '저장 암호화 (단말기·보조저장)',
  '4.3.3': '저장 암호화 (암호키 관리)',
  /* 4.3 전송 시 암호화 (2개) */
  '4.3.4': '전송 암호화 (인증정보)',
  '4.3.5': '전송 암호화 (인터넷 구간)',
  /* 4.4 접속기록 점검 (3개) */
  '4.4.2': '접속기록 (점검·보관)',
  '4.4.3': '접속기록 (자동화 분석)',
  '4.4.4': '접속기록 (이용기관 직접 점검)',
  /* 4.8 출력 시 보호조치 (2개) */
  '4.8.3': '출력 보호 (종이 출력)',
  '4.8.4': '출력 보호 (용도 지정)',
  /* 4.9 보호구역 지정 (3개) */
  '4.9.1': '보호구역 (구역 지정)',
  '4.9.2': '보호구역 (재해 대응)',
  '4.9.3': '보호구역 (백업·복구)',
  /* 5.1 고정형 영상정보처리기기 사용 제한 (2개) */
  '5.1.4': '고정형 기기 제한 (임의조작 금지)',
  '5.1.5': '고정형 기기 제한 (운영방침)',
  /* 5.2 영상정보 촬영 및 안내 (2개) */
  '5.2.1': '영상 촬영·안내 (적법 촬영)',
  '5.2.2': '영상 촬영·안내 (촬영 안내)',
  /* 5.3 원본정보 보관 시 보호조치 (2개) */
  '5.3.1': '원본 보호 (분리 보관)',
  '5.3.2': '원본 보호 (파기)',
  /* 5.5 가명정보의 처리 (4개) */
  '5.5.1': '가명처리 (처리 목적)',
  '5.5.2': '가명처리 (처리방침 공개)',
  '5.5.3': '가명처리 (적정성 검토)',
  '5.5.4': '가명처리 (결합전문기관)',
  /* 5.5 가명정보의 안전조치의무 등 (5개) */
  '5.5.5': '가명 안전조치 (내부 관리계획)',
  '5.5.6': '가명 안전조치 (추가정보 분리)',
  '5.5.7': '가명 안전조치 (접근권한 분리)',
  '5.5.8': '가명 안전조치 (처리기간)',
  '5.5.9': '가명 안전조치 (처리 기록)',
  /* 5.6 자동화된 결정 (4개) */
  '5.6.1': '자동화 결정 (통지·거부권)',
  '5.6.2': '자동화 결정 (설명 요구)',
  '5.6.3': '자동화 결정 (의견 반영)',
  '5.6.4': '자동화 결정 (중대 결정 거부)',
  /* 5.7 AI 시스템 학습 및 개발 (6개) */
  '5.7.1': 'AI 학습·개발 (수집 적법성)',
  '5.7.2': 'AI 학습·개발 (공개정보 수집)',
  '5.7.3': 'AI 학습·개발 (제3자 이전)',
  '5.7.4': 'AI 학습·개발 (국외 이전)',
  '5.7.5': 'AI 학습·개발 (보유기간·파기)',
  '5.7.6': 'AI 학습·개발 (취약점 대책)',
  /* 5.7 AI 시스템 운영 및 관리 (4개) */
  '5.7.7':  'AI 운영·관리 (가치망 역할)',
  '5.7.8':  'AI 운영·관리 (처리방침 공개)',
  '5.7.9':  'AI 운영·관리 (이용방침 AUP)',
  '5.7.10': 'AI 운영·관리 (신고·권리보장)',
};

/* ══════════════════════════════════════════════════════
   [2순위] 자동 번호 부여 — 맵에 없는 중복 subField 처리
   allPIAData 전체를 한 번 순회해서 캐시를 만든다.
══════════════════════════════════════════════════════ */
let _piaDisplayCache = null;   // { code → displayName }

function _buildDisplayCache() {
  if (typeof allPIAData === 'undefined') return {};
  const subCount = {};
  const subIdx   = {};
  const cache    = {};

  /* 1단계: 각 subField가 몇 번 등장하는지 카운트 */
  allPIAData.forEach(item => {
    subCount[item.subField] = (subCount[item.subField] || 0) + 1;
  });

  /* 2단계: 항목별 표시명 결정 */
  allPIAData.forEach(item => {
    if (PIA_DISPLAY_NAME_MAP[item.code]) {
      /* [1순위] 수동 맵 */
      cache[item.code] = PIA_DISPLAY_NAME_MAP[item.code];
    } else if (subCount[item.subField] > 1) {
      /* [2순위] 자동 번호 부여 */
      subIdx[item.subField] = (subIdx[item.subField] || 0) + 1;
      cache[item.code] = `${item.subField} (${subIdx[item.subField]})`;
    } else {
      /* 중복 없음 → 원본 subField 그대로 */
      cache[item.code] = item.subField;
    }
  });

  return cache;
}

/**
 * getPIADisplayName(code, subField)
 * 사이드바·본문 제목에 사용할 표시명 반환.
 * 원본 subField 값은 건드리지 않음.
 */
function getPIADisplayName(code, subField) {
  if (!_piaDisplayCache) _piaDisplayCache = _buildDisplayCache();
  return _piaDisplayCache[code] || subField;
}

/* ══════════════════════════════════════════════════════
   현재 선택된 항목 코드
══════════════════════════════════════════════════════ */
let activePIACode = null;

/* ── 열린 섹션 상태 (대분류 접기/펼치기) ─────────────── */
let PIAOpenSections = new Set();

/* ── 섹션 헤더 토글 ─────────────────────────────────── */
function togglePIASection(sec) {
  /* 사이드바 스크롤 위치 보존 */
  const sidebar = document.querySelector('#pg-guide .g-sidebar');
  const savedScroll = sidebar ? sidebar.scrollTop : 0;

  if (PIAOpenSections.has(sec)) PIAOpenSections.delete(sec);
  else PIAOpenSections.add(sec);

  renderPIAList();

  if (sidebar) requestAnimationFrame(() => { sidebar.scrollTop = savedScroll; });
}

/* ── 사이드바 렌더링 ─────────────────────────────────── */
function renderPIAList() {
  const q = (document.getElementById('piaSearch')?.value || '').toLowerCase();
  const el = document.getElementById('piaList');
  if (!el || typeof allPIAData === 'undefined') return;
  el.innerHTML = '';

  /* 활성 항목이 속한 섹션은 항상 자동으로 열기 */
  const activeSec = activePIACode ? activePIACode.split('.')[0] : null;
  if (activeSec) PIAOpenSections.add(activeSec);

  /* allPIAData를 섹션(코드 첫 자리)별로 그룹화 */
  const sections = {};
  allPIAData.forEach(item => {
    const sec = item.code.split('.')[0];
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(item);
  });

  Object.keys(sections).sort().forEach(sec => {
    const items = sections[sec].filter(item => {
      if (!q) return true;
      /* 검색: 코드·원본 subField·표시명·질의문 모두 대상 */
      const displayName = getPIADisplayName(item.code, item.subField);
      return (item.code + item.subField + displayName + item.question).toLowerCase().includes(q);
    });
    if (!items.length) return;

    /* 검색 중일 때는 모든 섹션 펼치기, 아니면 PIAOpenSections 상태 사용 */
    const isOpen = q ? true : PIAOpenSections.has(sec);

    /* 섹션 헤더 (클릭으로 접기/펼치기) */
    const ch = document.createElement('div');
    ch.className = 'g-cat-hdr' + (isOpen ? ' open' : '');
    ch.innerHTML =
      `<span class="g-cat-label">${PIA_SECTION_LABELS[sec] || ('섹션 ' + sec)}</span>` +
      `<span class="g-cat-arrow">${isOpen ? '▼' : '▶'}</span>`;
    ch.onclick = () => togglePIASection(sec);
    el.appendChild(ch);

    /* 하위 항목 래퍼 (접기/펼치기 대상) */
    const wrap = document.createElement('div');
    wrap.className = 'g-items-wrap' + (isOpen ? ' open' : '');

    /* 섹션 내 항목 목록 — 표시명 사용 */
    items.forEach(item => {
      const displayName = getPIADisplayName(item.code, item.subField);
      const d = document.createElement('div');
      d.className = 'g-item' + (activePIACode === item.code ? ' active' : '');
      d.innerHTML =
        `<span class="g-item-code">${item.code}</span>` +
        `<span class="g-item-name">${displayName}</span>`;
      d.onclick = () => selectPIAByCode(item.code);
      wrap.appendChild(d);
    });

    el.appendChild(wrap);
  });
}

/* ── 검색 핸들러 ─────────────────────────────────────── */
function filterPIA() { renderPIAList(); }

/* ── advisory 배지 스타일 결정 ───────────────────────── */
function _advisoryClass(text) {
  if (!text) return 'info';
  if (text.includes('의무') || text.includes('제재') || text.includes('위반') || text.includes('과태료') || text.includes('과징금') || text.includes('형사')) return 'danger';
  if (text.includes('권고') || text.includes('주의') || text.includes('검토')) return 'warn';
  return 'info';
}

/* ── 상세 패널 렌더링 ────────────────────────────────── */
function selectPIAByCode(code) {
  if (typeof allPIAData === 'undefined') return;
  activePIACode = code;
  renderPIAList();

  const all = allPIAData;
  const idx = all.findIndex(i => i.code === code);
  if (idx < 0) return;
  const it = all[idx];
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const el = document.getElementById('piaContent');
  if (!el) return;

  const sec = it.code.split('.')[0];
  const secLabel = PIA_SECTION_LABELS[sec] || ('섹션 ' + sec);

  /* 본문 제목도 표시명 사용 (원본 subField 대신) */
  const displayTitle = getPIADisplayName(it.code, it.subField);

  /* ── 1) 관련 법령 박스 ── */
  const lbHtml = (it.legalBasis && it.legalBasis.length)
    ? `<div class="gc-law-box">
         <div class="gc-law-label">관련 법령</div>
         <div class="gc-law-val">${it.legalBasis.join('<br>')}</div>
       </div>`
    : '';

  /* ── 2) 질의문 ── */
  const qHtml = `<div class="gc-section">
    <div class="gc-section-title">질의문</div>
    <div class="gc-desc"><strong>${it.question}</strong></div>
  </div>`;

  /* ── 원문자(①-⑳) 분리 공통 상수 ── */
  const CIRCLED_RE    = /[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]/;
  const CIRCLED_SPLIT = /(?=[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳])/;

  /* ── 특수기호 줄바꿈 전처리 헬퍼 ── */
  // * ※ [ 앞에 <br><br>를 삽입해 시각적으로 줄 분리.
  // 단, table 단락은 호출 전에 제외할 것.
  // 텍스트 맨 앞에 삽입된 불필요한 <br>은 마지막에 trim.
  function normalizeSpecialChars(text) {
    // 한 번의 pass로 처리 — 패턴 간 중복 적용 방지
    // ① \s\*\s : 공백*공백 (footnote * 제외)
    // ② ※       : 앞 공백 포함 (있으면 흡수)
    // ③ \s\[   : 공백[ (대괄호 보충 설명)
    const result = text.replace(/(\s\*\s|\s*※|\s\[)/g, m => {
      if (m.includes('*')) return '<br><br>* ';   // ① * 유지
      if (m.includes('※')) return '<br><br>※';   // ② ※ 유지
      return '<br><br>[';                          // ③ [ 유지
    });
    // 텍스트 앞머리에 생긴 <br> 제거 (※로 시작하는 단락 등)
    return result.replace(/^(<br>)+/i, '');
  }

  /* ── [1] 슬래시·대시 + 원문자 구분자 전처리 헬퍼 ── */
  // " / ①" 또는 " - ①" 형태를 감지하여 구분자를 제거하고 줄바꿈으로 교체.
  // 첫 번째 원문자 앞에는 줄바꿈 없이 처리.
  // 변환이 일어나면 수정된 텍스트를, 없으면 원본 그대로 반환.
  function normalizeSlashDash(text) {
    const SEP = /\s[\/\-]\s[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]/;
    if (!SEP.test(text)) return text;
    let isFirst = true;
    return text.replace(
      /\s[\/\-]\s([①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳])/g,
      (_, circ) => {
        if (isFirst) { isFirst = false; return ' ' + circ; }
        return '<br><br>' + circ;
      }
    );
  }

  /* ── 주요 점검사항 세부항목 줄 분리 헬퍼 ── */
  function formatCheckPoint(text) {
    // 0. * ※ [ 특수기호 줄바꿈 전처리 (이후 로직에 수정된 text 전달)
    text = normalizeSpecialChars(text);
    // 1. 슬래시/대시 구분자 전처리 (변환 발생 시 early return)
    const norm = normalizeSlashDash(text);
    if (norm !== text) return norm;
    // ①②③…⑳ 원문자 패턴 (⑩ 이상 포함): 각 앞에서 줄 분리
    if (CIRCLED_RE.test(text)) {
      const firstIdx = text.search(CIRCLED_RE);
      const lead = firstIdx > 0
        ? `<span class="gc-cp-lead">${text.slice(0, firstIdx).trim()}</span>`
        : '';
      const body = text.slice(firstIdx)
        .split(CIRCLED_SPLIT)
        .map(s => s.trim()).filter(Boolean)
        .map(s => `<span class="gc-cp-item">${s}</span>`)
        .join('');
      return lead + body;
    }
    // – (en-dash) 패턴: 공백–공백 앞에 줄바꿈 삽입
    if (/\s–\s/.test(text)) {
      return text.replace(/(\s)–(\s)/g, '<br>–$2');
    }
    return text;
  }

  /* ── 3) 주요 점검사항 (번호 목록) ── */
  const cpHtml = (it.checkPoints && it.checkPoints.length)
    ? `<div class="gc-section">
         <div class="gc-section-title">주요 점검사항</div>
         <div class="gc-checks">
           ${it.checkPoints.map((c, i) =>
             `<div class="gc-check">
                <span class="gc-check-num">${i + 1}</span>
                <span>${formatCheckPoint(c)}</span>
              </div>`
           ).join('')}
         </div>
       </div>`
    : '';

  /* ── 지표 해설 단락 포맷 헬퍼 ── */
  function formatGuidePara(text) {
    // 1. 표(table) 마크업 → gc-table-wrap 으로 감싸서 반환 (table 내부는 전처리 제외)
    if (/<table[\s>]/i.test(text)) {
      return text
        .replace(/<table/gi, '<div class="gc-table-wrap"><table')
        .replace(/<\/table>/gi, '</table></div>');
    }
    // 2. * ※ [ 특수기호 줄바꿈 전처리 (table 제외 후 적용)
    text = normalizeSpecialChars(text);
    // 3. 슬래시/대시 구분자 전처리 (변환 발생 시 early return)
    const norm = normalizeSlashDash(text);
    if (norm !== text) return norm;
    // 4. ● 패턴 → 불릿 리스트
    if (/●/.test(text)) {
      const startsWithBullet = text.trimStart().startsWith('●');
      const parts = text.split('●').map(s => s.trim()).filter(Boolean);
      const leadHtml = (!startsWithBullet && parts.length > 1)
        ? `<p class="gc-lead">${parts[0]}</p>`
        : '';
      const bullets = (startsWithBullet ? parts : parts.slice(1))
        .map(p => `<li class="gc-bullet">${p}</li>`)
        .join('');
      return `${leadHtml}<ul class="gc-bulletlist">${bullets}</ul>`;
    }
    // 5. 원문자 ①②③…⑳ 패턴 → 불릿 리스트 (guideExplanation용)
    if (CIRCLED_RE.test(text)) {
      const firstIdx = text.search(CIRCLED_RE);
      const leadHtml = firstIdx > 0
        ? `<p class="gc-lead">${text.slice(0, firstIdx).trim()}</p>`
        : '';
      const bullets = text.slice(firstIdx)
        .split(CIRCLED_SPLIT)
        .map(s => s.trim()).filter(Boolean)
        .map(s => `<li class="gc-bullet">${s}</li>`)
        .join('');
      return `${leadHtml}<ul class="gc-bulletlist">${bullets}</ul>`;
    }
    // 6. 숫자 목록 패턴 ("1. 항목A 2. 항목B …")
    if (!/\s\d+\.\s/.test(text)) return text;
    const leadMatch = text.match(/^([\s\S]*?)(?=\s*1\.\s)/);
    const lead = leadMatch ? leadMatch[1].trim() : '';
    const items = [];
    const re = /(\d+)\.\s([\s\S]*?)(?=\s+\d+\.\s|$)/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      items.push(`<li><span class="gc-num">${m[1]}.</span> ${m[2].trim()}</li>`);
    }
    if (!items.length) return text;
    const leadHtml = lead ? `<p class="gc-lead">${lead}</p>` : '';
    return `${leadHtml}<ol class="gc-numlist">${items.join('')}</ol>`;
  }

  /* ── 4) 지표 해설 (통합 박스형) ── */
  const geHtml = (it.guideExplanation && it.guideExplanation.length)
    ? `<div class="gc-section">
         <div class="gc-guide-hdr">
           <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
             <polyline points="14 2 14 8 20 8"/>
             <line x1="16" y1="13" x2="8" y2="13"/>
             <line x1="16" y1="17" x2="8" y2="17"/>
             <polyline points="10 9 9 9 8 9"/>
           </svg>
           지표 해설
         </div>
         <div class="gc-guide-body">
           <div class="gc-guide-unified">
             ${it.guideExplanation.map(p =>
               `<div class="gc-guide-item">
                  <span class="gc-item-dot" aria-hidden="true"></span>
                  <div class="gc-item-body">${formatGuidePara(p)}</div>
                </div>`
             ).join('')}
           </div>
         </div>
       </div>`
    : '';

  /* ── 5) 용어 설명 (없으면 숨김) ── */
  const termsHtml = it.terms
    ? `<div class="gc-section">
         <div class="gc-section-title">용어 설명</div>
         <div class="gc-terms">${it.terms}</div>
       </div>`
    : '';

  /* ── 6) 권고·제재 배지 (없으면 숨김) ── */
  const advHtml = it.advisory
    ? `<div class="gc-advisory-wrap">
         <div class="gc-alert ${_advisoryClass(it.advisory)}">${it.advisory}</div>
       </div>`
    : '';

  /* ── 7) AI 보완 내용 (없으면 숨김) ── */
  const aiHtml = (typeof allAiComments !== 'undefined' && allAiComments[it.code])
    ? (() => {
        const c = allAiComments[it.code];
        const fieldHtml = [
          c.general
            ? `<div class="gc-ai-general">${c.general}</div>`
            : '',
          c.aws
            ? `<div class="gc-ai-field"><span class="gc-ai-badge gc-ai-aws">AWS</span><span class="gc-ai-text">${c.aws}</span></div>`
            : '',
          c.gcp
            ? `<div class="gc-ai-field"><span class="gc-ai-badge gc-ai-gcp">GCP</span><span class="gc-ai-text">${c.gcp}</span></div>`
            : '',
          c.azure
            ? `<div class="gc-ai-field"><span class="gc-ai-badge gc-ai-azure">Azure</span><span class="gc-ai-text">${c.azure}</span></div>`
            : '',
          c.cloud_common
            ? `<div class="gc-ai-field"><span class="gc-ai-badge gc-ai-cloud">Cloud 공통</span><span class="gc-ai-text">${c.cloud_common}</span></div>`
            : '',
        ].join('');
        return `<div class="gc-ai-section">
          <div class="gc-ai-hdr">💡 AI 보완 내용 · 참고용</div>
          <div class="gc-ai-notice">본 내용은 AI 생성 참고 코멘트로, 실제 적용 시 환경별 검토가 필요합니다.</div>
          ${fieldHtml}
        </div>`;
      })()
    : '';

  /* ── 조합 출력 ── */
  el.innerHTML = `
    <div class="gc-cat">${secLabel} · ${it.code}</div>
    <div class="gc-title">${displayTitle}</div>
    ${lbHtml}
    ${qHtml}
    ${cpHtml}
    ${geHtml}
    ${termsHtml}
    ${advHtml}
    ${aiHtml}
    <div class="gc-nav">
      ${prev
        ? `<button class="gc-nav-btn" onclick="selectPIAByCode('${prev.code}')">← ${prev.code}</button>`
        : '<span></span>'}
      <span style="font-size:12px;color:var(--text3)">${idx + 1} / ${all.length}</span>
      ${next
        ? `<button class="gc-nav-btn" onclick="selectPIAByCode('${next.code}')">${next.code} →</button>`
        : '<span></span>'}
    </div>`;

  /* 본문 스크롤 최상단으로 */
  el.scrollTop = 0;
}

/* ── 초기화 ──────────────────────────────────────────── */
renderPIAList();
setTimeout(() => {
  /* 개요 항목이 활성화된 경우 자동 선택 생략 */
  if (typeof allPIAData !== 'undefined' && allPIAData.length && !window._piaOverviewActive) {
    selectPIAByCode(allPIAData[0].code);
  }
}, 80);
