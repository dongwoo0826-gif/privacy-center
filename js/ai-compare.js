// ══ AI 동의서·처리방침 정합성 비교 (TBD) ══
// 검증 기준은 AIC_RULES 데이터만 수정하면 화면에 반영된다.
// AI 분석 기능은 구현 예정이며, 현재는 입력 양식·검증 기준·결과 예시만 제공한다.

const AIC_RULES = [
  { item: '수집·이용 목적', consent: '동의서에 고지한 수집·이용 목적', policy: '개인정보의 처리 목적', law: '§15②1 · §30①1',
    check: '동의서의 목적이 처리방침에 모두 기재되어 있는지, 처리방침에 동의서보다 넓은 목적이 포괄적으로 기재되어 있지 않은지' },
  { item: '수집 항목', consent: '필수·선택 수집 항목', policy: '처리하는 개인정보의 항목', law: '§15②2 · §30①',
    check: '동의서의 필수·선택 항목이 처리방침 항목에 빠짐없이 포함되는지, 항목 명칭이 서로 일치하는지' },
  { item: '보유·이용 기간', consent: '보유 및 이용 기간', policy: '처리 및 보유 기간', law: '§15②3 · §30①2',
    check: '두 문서의 기간이 동일한지, 법령에 따른 별도 보존기간이 처리방침에 근거와 함께 기재되어 있는지' },
  { item: '동의 거부 권리', consent: '거부 권리 및 거부 시 불이익', policy: '정보주체의 권리·의무 및 행사방법', law: '§15②4 · §30①',
    check: '동의서에 거부 권리·불이익이 고지되어 있는지, 처리방침에 권리 행사방법이 안내되어 있는지' },
  { item: '제3자 제공', consent: '제공받는 자 · 목적 · 항목 · 보유기간', policy: '개인정보의 제3자 제공에 관한 사항', law: '§17② · §30①',
    check: '동의서의 제공받는 자·목적·항목·기간이 처리방침과 일치하는지, 처리방침에만 있는 제공처는 없는지' },
  { item: '처리위탁', consent: '(동의 대상 아님)', policy: '개인정보 처리업무의 위탁에 관한 사항', law: '§26② · §30①',
    check: '위탁을 제3자 제공 동의로 받고 있지 않은지, 수탁자·위탁업무가 처리방침에 공개되어 있는지' },
  { item: '국외 이전', consent: '이전받는 자 · 국가 · 일시·방법 · 항목 · 목적 · 기간', policy: '개인정보의 국외 이전에 관한 사항', law: '§28-8 · §30①',
    check: '동의서의 이전 국가·이전받는 자·이전 항목이 처리방침과 일치하는지' },
  { item: '민감정보 · 고유식별정보', consent: '별도 동의 여부', policy: '처리 항목 및 처리 근거', law: '§23 · §24',
    check: '일반 동의와 분리해 별도 동의를 받는지, 처리방침에 해당 항목과 처리 근거가 기재되어 있는지' }
];

// 결과 예시 (화면 미리보기용 가상 데이터)
const AIC_SAMPLE = [
  { status: 'miss', item: '수집 항목', desc: '동의서의 선택 항목 「생년월일」이 처리방침 처리 항목에 없음' },
  { status: 'diff', item: '보유·이용 기간', desc: '동의서 「회원 탈퇴 시까지」 ↔ 처리방침 「탈퇴 후 1년」 — 기간 불일치' },
  { status: 'check', item: '제3자 제공', desc: '처리방침에만 제공처 「○○배송사」가 있음 — 위탁인지 제공인지 확인 필요' },
  { status: 'ok', item: '수집·이용 목적', desc: '동의서 목적 3건이 처리방침에 모두 기재됨' }
];
const AIC_STATUS = {
  miss: ['누락', 'badge-red'],
  diff: ['불일치', 'badge-amber'],
  check: ['확인 필요', 'badge-purple'],
  ok: ['충족', 'badge-green']
};

function aicRender() {
  const tb = document.getElementById('aic-rules');
  if (tb) tb.innerHTML = AIC_RULES.map(r => `
    <tr>
      <td class="aic-item">${r.item}<div class="aic-law">${r.law}</div></td>
      <td>${r.consent}</td>
      <td>${r.policy}</td>
      <td class="aic-check">${r.check}</td>
    </tr>`).join('');
  const sp = document.getElementById('aic-sample');
  if (sp) sp.innerHTML = AIC_SAMPLE.map(s => `
    <div class="aic-res">
      <span class="badge ${AIC_STATUS[s.status][1]}">${AIC_STATUS[s.status][0]}</span>
      <span class="aic-res-item">${s.item}</span>
      <span class="aic-res-desc">${s.desc}</span>
    </div>`).join('');
}

// 파일 선택: 문서는 브라우저에서만 읽으며 외부로 전송하지 않는다 (.txt만 본문 표시)
function aicFile(kind, input) {
  const f = input.files && input.files[0];
  const name = document.getElementById('aic-' + kind + '-name');
  if (!f) return;
  name.textContent = f.name + ' (' + Math.ceil(f.size / 1024) + 'KB)';
  if (/\.txt$/i.test(f.name)) {
    const r = new FileReader();
    r.onload = () => { document.getElementById('aic-' + kind + '-text').value = r.result; };
    r.readAsText(f, 'utf-8');
  }
}

// 이 페이지의 Template 탭에서 작성한 미리보기 내용을 불러온다
function aicLoadTemplate(kind) {
  const src = document.getElementById(kind === 'consent' ? 'docPreview' : 'ppPreview');
  const txt = src ? src.innerText.trim() : '';
  if (!txt) { alert((kind === 'consent' ? '동의서' : '처리방침') + ' Template 탭에서 먼저 내용을 작성해 주세요.'); return; }
  document.getElementById('aic-' + kind + '-text').value = txt;
  document.getElementById('aic-' + kind + '-name').textContent = 'Template 탭에서 불러옴';
}

function aicRun() {
  const c = document.getElementById('aic-consent-text').value.trim();
  const p = document.getElementById('aic-policy-text').value.trim();
  const out = document.getElementById('aic-output');
  const note = (!c || !p) ? '<br><br><span style="color:#b45309">※ 동의서와 처리방침을 모두 입력해야 비교할 수 있습니다.</span>' : '';
  out.innerHTML = `<div class="aff-tbd-icon">🔧</div>
    <div class="aff-tbd-title">AI 정합성 비교 기능 구현 예정</div>
    <div class="aff-tbd-body">향후 AI API 연동을 통해 동의서와 처리방침을 항목별로 대조하고<br>누락·불일치·확인 필요 사항을 자동으로 표시할 예정입니다.<br><br>현재는 입력 양식과 검증 기준만 제공됩니다.${note}</div>`;
}

aicRender();
