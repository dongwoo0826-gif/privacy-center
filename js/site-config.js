// ══ SITE CONFIG ══
// 사이트 전역 설정. 법령 기준일과 미완성 기능 노출 여부는 이 파일에서만 관리한다.
const SITE_CONFIG = {
  // 각 가이드·체크리스트 상단 "법령 기준일" 배지에 표시되는 날짜
  lawBaseDate: '2026.11.03',
  // true 로 바꾸면 class="wip" 로 숨겨 둔 미완성 기능(AI 흐름도, AI 정합성 비교 등)이 다시 표시된다
  showWip: false
};

(function () {
  function apply() {
    document.querySelectorAll('[data-law-date]').forEach(el => {
      el.textContent = '법령 기준일: ' + SITE_CONFIG.lawBaseDate;
    });
    document.body.classList.toggle('show-wip', !!SITE_CONFIG.showWip);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
