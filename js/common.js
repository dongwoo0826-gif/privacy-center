// ══ ROUTING ══
function go(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.toggle('active', n.dataset.pg === page));
  const el = document.getElementById('pg-' + page);
  if (el) el.classList.add('active');
  window.scrollTo(0, 0);
  history.replaceState(null, '', '#' + page);
}

window.addEventListener('load', () => {
  const h = (location.hash || '#home').replace('#', '');
  go(h);
});
