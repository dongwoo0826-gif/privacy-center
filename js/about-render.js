// ══ ABOUT · 소개 페이지 렌더링 ══
// 콘텐츠는 js/aboutData.js(ABOUT_DATA)에서 가져온다.
(function () {
  const root = document.getElementById('about-root');
  if (!root || typeof ABOUT_DATA === 'undefined') return;
  const d = ABOUT_DATA;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const header = `
  <div class="about-head">
    <div class="about-eyebrow">${esc(d.label)}</div>
    <div class="about-title">${esc(d.title)}</div>
    <div class="about-tagline">${esc(d.tagline)}</div>
    <div class="about-summary">${esc(d.summary)}</div>
  </div>`;

  // label 은 <br> 줄바꿈을 허용하는 신뢰된 데이터
  const stats = `
  <div class="about-stats">${d.stats.map(s => s.unit
    ? `<div class="astat"><div class="astat-num">${esc(s.num)}<span style="font-size:1rem">${esc(s.unit)}</span></div><div class="astat-label">${s.label}</div></div>`
    : `<div class="astat"><div class="astat-num" style="font-size:1.1rem;line-height:1.3">${esc(s.num)}</div><div class="astat-label">${s.label}</div></div>`
  ).join('')}</div>`;

  const timeline = d.experience.map(e => `
        <div class="tl-item">
          <div class="tl-year">${esc(e.year)}</div>
          <div class="tl-role">${esc(e.role)}</div>
          <div class="tl-org">${esc(e.org)}</div>
          <div class="tl-detail">${e.detail.map(esc).join(' · ')}</div>
        </div>`).join('');

  const certs = d.certifications.map(c => `
        <div class="cert-card${c.highlight ? ' cert-new' : ''}"><div class="cert-name">${esc(c.name)}</div><div class="cert-meta">${[c.issuer, c.date].filter(Boolean).map(esc).join(' · ')}</div></div>`).join('');

  const contact = d.contact && d.contact.email ? `
      <div style="margin-top:1.25rem">
        <div class="sec-label">CONTACT</div>
        <a class="about-mail" href="mailto:${esc(d.contact.email)}">${esc(d.contact.email)}</a>
      </div>` : '';

  const grid = `
  <div class="about-grid">
    <div>
      <div class="sec-label">EXPERIENCE</div>
      <div class="tl-wrap">${timeline}
      </div>
    </div>
    <div>
      <div class="sec-label">CERTIFICATIONS</div>
      <div class="cert-grid">${certs}
      </div>${contact}
    </div>
  </div>`;

  const areas = `
  <div class="about-sec">
    <div class="sec-label">WORK AREAS · 업무 영역</div>
    <div class="area-grid">${d.areas.map(a => `
      <div class="area-card">
        <div class="area-head"><span class="area-no">${esc(a.no)}</span><span class="area-title">${esc(a.title)}</span></div>
        <ul class="area-list">${a.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`).join('')}
    </div>
  </div>`;

  const principles = `
  <div>
    <div class="sec-label">HOW I WORK · 일하는 방식</div>
    <div class="pr-list">${d.principles.map((p, i) => `
      <div class="pr-item">
        <div class="pr-no">${String(i + 1).padStart(2, '0')}</div>
        <div><div class="pr-title">${esc(p.title)}</div>${p.desc ? `<div class="pr-desc">${esc(p.desc)}</div>` : ''}</div>
      </div>`).join('')}
    </div>
  </div>`;

  const s = d.site;
  const site = `
  <div>
    <div class="sec-label">ABOUT THIS SITE · 이 사이트에 대하여</div>
    <div class="site-box">
      <div class="site-why">${esc(s.why)}</div>
      <div class="site-sub">설계 원칙</div>
      <ul class="area-list">${s.principles.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
      <div class="site-sub">구성 도구</div>
      <div class="site-tools">${s.tools.map(t => t.page
        ? `<a class="site-tool" href="#${esc(t.page)}" onclick="go('${esc(t.page)}');return false">${esc(t.name)}</a>`
        : `<a class="site-tool" href="${esc(t.href)}">${esc(t.name)}</a>`).join('')}
      </div>
    </div>
  </div>`;

  root.innerHTML = header + stats + grid + areas + `<div class="about-sec about-grid">${principles}${site}</div>`;
})();
