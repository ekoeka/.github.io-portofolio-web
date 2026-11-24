// Keep the selected theme across both static pages, even if storage is blocked.
(() => {
  const button = document.getElementById('theme-toggle');
  let dark = true;
  try { dark = localStorage.getItem('portfolio-theme') !== 'light'; } catch (_) { /* Storage is optional. */ }
  function apply() {
    document.body.classList.toggle('dark-mode', dark);
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Mode gelap aktif' : 'Mode gelap');
  }
  apply();
  button.addEventListener('click', () => {
    dark = !dark;
    apply();
    try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch (_) { /* Theme still works for this page. */ }
  });
})();
