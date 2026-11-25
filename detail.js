const byId = id => document.getElementById(id);
let disposeGallery = () => {};
function renderGallery(images, title) {
  disposeGallery();
  const root = byId('project-gallery'), viewport = byId('gallery-viewport');
  const track = byId('gallery-track'), placeholder = byId('gallery-placeholder');
  const up = byId('gallery-up'), down = byId('gallery-down'), toggle = byId('gallery-toggle');
  const position = byId('gallery-position'), top = byId('gallery-controls-top'), bottom = byId('gallery-controls-bottom');
  const mobile = window.matchMedia('(max-width: 800px)'), reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer, animationTimer, interactionTimer, animating = false;
  let paused = false, interacting = false, hovering = false, focusInside = false, destroyed = false;
  const count = images.length;
  const visibleCount = () => Math.min(count, mobile.matches ? 3 : 4);
  const indexAt = offset => (current + offset + count) % count;
  const step = () => track.firstElementChild ? track.firstElementChild.offsetHeight + 14 : 0;

  function updateToggle() {
    toggle.setAttribute('aria-label', paused ? 'Lanjutkan putar otomatis' : 'Jeda putar otomatis');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.hidden = reduced.matches;
  }
  function schedule() {
    clearTimeout(timer);
    if (count > 1 && !paused && !reduced.matches && !hovering && !focusInside && !interacting && !document.hidden && !animating && !destroyed) {
      timer = setTimeout(() => move(1), 5000);
    }
  }
  function slot(index, order) {
    const button = element('button', 'gallery-slide');
    const img = element('img');
    const fallback = element('span', 'gallery-image-placeholder', 'Gambar tidak tersedia');
    button.type = 'button';
    button.dataset.index = String(index);
    button.dataset.order = String(order);
    button.setAttribute('aria-label', `Gambar ${index + 1} dari ${count}${order === 0 ? ', gambar utama' : ', tampilkan sebagai gambar utama'}`);
    button.setAttribute('aria-pressed', String(order === 0));
    img.alt = `${title} — gambar ${index + 1}`;
    img.loading = order < visibleCount() ? 'eager' : 'lazy';
    img.onerror = () => { img.hidden = true; fallback.hidden = false; };
    fallback.hidden = true;
    img.src = images[index];
    button.append(img, fallback);
    button.onclick = () => { if (order > 0 && !animating) { interact(); advance(order); } };
    return button;
  }
  function draw() {
    track.style.transition = 'none';
    track.style.transform = 'translateY(0)';
    track.replaceChildren();
    const visible = visibleCount();
    viewport.style.setProperty('--gallery-visible', String(visible));
    placeholder.hidden = count !== 0;
    viewport.classList.toggle('is-empty', count === 0);
    top.hidden = bottom.hidden = count < 2;
    position.textContent = count ? `${current + 1} / ${count}` : '';
    for (let i = 0; i < visible; i++) track.append(slot(indexAt(i), i));
    updateToggle();
  }
  function move(direction, remaining = 1, restoreFocus = false) {
    if (count < 2 || animating || destroyed) return;
    clearTimeout(timer);
    animating = true;
    const visible = visibleCount();
    if (direction > 0 && count > visible) track.append(slot(indexAt(visible), visible));
    if (direction < 0) {
      if (count <= visible) track.lastElementChild.remove();
      track.prepend(slot(indexAt(-1), -1));
      track.style.transition = 'none';
      track.style.transform = `translateY(-${step()}px)`;
    }
    // Force layout before starting a real vertical translation.
    void track.offsetHeight;
    [...track.children].forEach(slide => { slide.dataset.order = String(Number(slide.dataset.order) - direction); });
    track.style.transition = reduced.matches ? 'none' : 'transform 500ms ease';
    track.style.transform = direction > 0 ? `translateY(-${step()}px)` : 'translateY(0)';
    const finish = () => {
      if (destroyed) return;
      current = indexAt(direction);
      animating = false;
      draw();
      if (remaining > 1) move(direction, remaining - 1, restoreFocus);
      else { if (restoreFocus) track.firstElementChild?.focus({preventScroll:true}); schedule(); }
    };
    animationTimer = setTimeout(finish, reduced.matches ? 0 : 500);
  }
  function advance(steps) { move(1, steps, document.activeElement?.classList.contains('gallery-slide')); }
  function interact() { interacting = true; clearTimeout(interactionTimer); clearTimeout(timer); interactionTimer = setTimeout(() => { interacting = false; schedule(); }, 1200); }
  const onUp = () => { interact(); move(1); };
  const onDown = () => { interact(); move(-1); };
  const onToggle = () => { paused = !paused; updateToggle(); schedule(); };
  const onEnter = () => { hovering = true; schedule(); };
  const onLeave = () => { hovering = false; schedule(); };
  const onFocus = () => { focusInside = true; schedule(); };
  const onBlur = event => { if (!root.contains(event.relatedTarget)) { focusInside = false; schedule(); } };
  const onVisibility = () => schedule();
  const onSettings = () => { if (!animating) draw(); schedule(); };
  up.addEventListener('click', onUp); down.addEventListener('click', onDown); toggle.addEventListener('click', onToggle);
  root.addEventListener('mouseenter', onEnter); root.addEventListener('mouseleave', onLeave);
  root.addEventListener('focusin', onFocus); root.addEventListener('focusout', onBlur);
  document.addEventListener('visibilitychange', onVisibility);
  mobile.addEventListener('change', onSettings); reduced.addEventListener('change', onSettings);
  disposeGallery = () => {
    destroyed = true; clearTimeout(timer); clearTimeout(animationTimer); clearTimeout(interactionTimer);
    up.removeEventListener('click', onUp); down.removeEventListener('click', onDown); toggle.removeEventListener('click', onToggle);
    root.removeEventListener('mouseenter', onEnter); root.removeEventListener('mouseleave', onLeave);
    root.removeEventListener('focusin', onFocus); root.removeEventListener('focusout', onBlur);
    document.removeEventListener('visibilitychange', onVisibility);
    mobile.removeEventListener('change', onSettings); reduced.removeEventListener('change', onSettings);
  };
  draw(); schedule();
}
async function loadDetail() {
  const title = byId('judul'), description = byId('deskripsi');
  title.textContent = 'Memuat...'; description.replaceChildren(); byId('tanggal').textContent = '';
  const params = new URLSearchParams(location.search), id = params.get('id');
  if (!params.has('project') && !/^(0|[1-9]\d*)$/.test(id || '')) { title.textContent = 'ID proyek tidak valid.'; return; }
  try {
    const rows = await fetchCSV(sheetURL('projects'));
    if (!rows.some(row => validRow('projects', row))) { title.textContent = 'Belum ada proyek.'; return; }
    const index = params.has('project') ? projectByTitle(params.get('project'), rows) : projectIndex(id, rows.length);
    if (index < 0 || !validRow('projects', rows[index]) || (params.has('title') && params.get('title') !== rows[index][0])) { title.textContent = 'Proyek tidak ditemukan atau telah berubah.'; return; }
    const c = rows[index]; title.textContent = c[0] || ''; description.textContent = c[2] || ''; byId('tanggal').textContent = c[5] ? '📅 ' + c[5] : '';
    renderTags(byId('tags'), c[6]);
    renderGallery((c[3] || '').split('|').map(safeURL).filter(Boolean), c[0] || 'Proyek');
    [[4,'btn-github'],[7,'btn-youtube'],[8,'btn-jurnal']].forEach(([column,button]) => { const url = safeURL(c[column]); if (url) { byId(button).href = url; byId(button).style.display = 'block'; } });
  } catch (_) { title.textContent = 'Data gagal dimuat.'; showRetry(description, loadDetail, ''); }
}
loadDetail();
