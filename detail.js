const byId = id => document.getElementById(id);
let disposeGallery = () => {};
function renderGallery(images, title) {
  disposeGallery();
  const root = byId('project-gallery'), viewport = byId('gallery-viewport');
  const track = byId('gallery-track'), placeholder = byId('gallery-placeholder');
  const up = byId('gallery-up'), down = byId('gallery-down'), toggle = byId('gallery-toggle');
  const position = byId('gallery-position'), top = byId('gallery-controls-top'), bottom = byId('gallery-controls-bottom');
  const lightbox = byId('image-lightbox'), lightboxImg = byId('lightbox-image'), lightboxStage = byId('lightbox-stage');
  const lightboxError = byId('lightbox-error'), lightboxPosition = byId('lightbox-position');
  const closeButton = byId('lightbox-close'), previous = byId('lightbox-prev'), next = byId('lightbox-next');
  const zoomIn = byId('lightbox-zoom-in'), zoomOut = byId('lightbox-zoom-out'), zoomReset = byId('lightbox-zoom-reset');
  const mobile = window.matchMedia('(max-width: 800px)'), reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer, animationTimer, interactionTimer, animating = false;
  let paused = false, interacting = false, hovering = false, focusInside = false, destroyed = false;
  let lightboxIndex = 0, zoom = 1, previousOverflow = '', pinchDistance = 0, pinchZoom = 1;
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
    if (count > 1 && !paused && !reduced.matches && !hovering && !focusInside && !interacting && !document.hidden && !animating && !lightbox.open && !destroyed) {
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
    button.setAttribute('aria-label', `Gambar ${index + 1} dari ${count}${order === 0 ? ', buka gambar utama' : ', tampilkan sebagai gambar utama'}`);
    button.setAttribute('aria-pressed', String(order === 0));
    img.alt = `${title} — gambar ${index + 1}`;
    img.loading = order < visibleCount() ? 'eager' : 'lazy';
    img.onerror = () => { img.hidden = true; fallback.hidden = false; };
    fallback.hidden = true;
    img.src = images[index];
    button.append(img, fallback);
    button.onclick = () => { if (animating) return; if (order > 0) { interact(); advance(order); } else openLightbox(index); };
    return button;
  }
  function fitLightboxImage() {
    if (!lightboxImg.naturalWidth || !lightboxImg.naturalHeight) return;
    const fit = Math.min(window.innerWidth * .95 / lightboxImg.naturalWidth, window.innerHeight * (mobile.matches ? .82 : .9) / lightboxImg.naturalHeight);
    lightboxImg.style.width = `${lightboxImg.naturalWidth * fit * zoom}px`;
    lightboxImg.style.height = `${lightboxImg.naturalHeight * fit * zoom}px`;
    zoomReset.textContent = `${Math.round(zoom * 100)}%`;
  }
  function setZoom(value) { zoom = Math.min(4, Math.max(1, value)); fitLightboxImage(); }
  function showLightboxImage(index) {
    lightboxIndex = (index + count) % count;
    zoom = 1; zoomReset.textContent = '100%';
    lightboxPosition.textContent = `${lightboxIndex + 1} / ${count}`;
    previous.hidden = next.hidden = count < 2;
    lightboxImg.hidden = true; lightboxError.hidden = true;
    lightboxImg.alt = `${title} — gambar ${lightboxIndex + 1} dari ${count}`;
    lightboxImg.onload = () => { fitLightboxImage(); lightboxImg.hidden = false; };
    lightboxImg.onerror = () => { lightboxImg.hidden = true; lightboxError.hidden = false; };
    lightboxImg.src = images[lightboxIndex];
    lightboxStage.scrollTop = lightboxStage.scrollLeft = 0;
  }
  function openLightbox(index) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    showLightboxImage(index);
    lightbox.showModal();
    closeButton.focus();
    schedule();
  }
  const closeLightbox = () => lightbox.close();
  const onClose = () => { document.body.style.overflow = previousOverflow; schedule(); };
  const onBackdrop = event => { if (event.target === lightbox) lightbox.close(); };
  const onLightboxKey = event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showLightboxImage(lightboxIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showLightboxImage(lightboxIndex + 1); }
  };
  const onPrevious = () => showLightboxImage(lightboxIndex - 1);
  const onNext = () => showLightboxImage(lightboxIndex + 1);
  const onZoomIn = () => setZoom(zoom + .25);
  const onZoomOut = () => setZoom(zoom - .25);
  const onZoomReset = () => setZoom(1);
  const onLightboxResize = () => { if (lightbox.open) fitLightboxImage(); };
  const touchDistance = touches => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  const onTouchStart = event => { if (event.touches.length === 2) { pinchDistance = touchDistance(event.touches); pinchZoom = zoom; } };
  const onTouchMove = event => { if (event.touches.length === 2 && pinchDistance) { event.preventDefault(); setZoom(pinchZoom * touchDistance(event.touches) / pinchDistance); } };
  const onTouchEnd = event => { if (event.touches.length < 2) pinchDistance = 0; };
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
    // The outgoing main image shrinks to the smaller row size while the next expands.
    const distance = direction > 0 ? track.children[1].offsetHeight + 14 : step();
    // Force layout before starting a real vertical translation.
    void track.offsetHeight;
    [...track.children].forEach(slide => { slide.dataset.order = String(Number(slide.dataset.order) - direction); });
    track.style.transition = reduced.matches ? 'none' : 'transform 500ms ease';
    track.style.transform = direction > 0 ? `translateY(-${distance}px)` : 'translateY(0)';
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
  lightbox.addEventListener('close', onClose); lightbox.addEventListener('click', onBackdrop); lightbox.addEventListener('keydown', onLightboxKey);
  closeButton.addEventListener('click', closeLightbox);
  previous.addEventListener('click', onPrevious); next.addEventListener('click', onNext);
  zoomIn.addEventListener('click', onZoomIn); zoomOut.addEventListener('click', onZoomOut); zoomReset.addEventListener('click', onZoomReset);
  lightboxStage.addEventListener('touchstart', onTouchStart, {passive:true}); lightboxStage.addEventListener('touchmove', onTouchMove, {passive:false});
  lightboxStage.addEventListener('touchend', onTouchEnd); lightboxStage.addEventListener('touchcancel', onTouchEnd);
  window.addEventListener('resize', onLightboxResize);
  up.addEventListener('click', onUp); down.addEventListener('click', onDown); toggle.addEventListener('click', onToggle);
  root.addEventListener('mouseenter', onEnter); root.addEventListener('mouseleave', onLeave);
  root.addEventListener('focusin', onFocus); root.addEventListener('focusout', onBlur);
  document.addEventListener('visibilitychange', onVisibility);
  mobile.addEventListener('change', onSettings); reduced.addEventListener('change', onSettings);
  disposeGallery = () => {
    destroyed = true; clearTimeout(timer); clearTimeout(animationTimer); clearTimeout(interactionTimer);
    if (lightbox.open) { document.body.style.overflow = previousOverflow; lightbox.close(); }
    lightbox.removeEventListener('close', onClose); lightbox.removeEventListener('click', onBackdrop); lightbox.removeEventListener('keydown', onLightboxKey);
    closeButton.removeEventListener('click', closeLightbox); previous.removeEventListener('click', onPrevious); next.removeEventListener('click', onNext);
    zoomIn.removeEventListener('click', onZoomIn); zoomOut.removeEventListener('click', onZoomOut); zoomReset.removeEventListener('click', onZoomReset);
    lightboxStage.removeEventListener('touchstart', onTouchStart); lightboxStage.removeEventListener('touchmove', onTouchMove);
    lightboxStage.removeEventListener('touchend', onTouchEnd); lightboxStage.removeEventListener('touchcancel', onTouchEnd);
    window.removeEventListener('resize', onLightboxResize);
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
