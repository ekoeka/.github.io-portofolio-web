const byId = id => document.getElementById(id);
function renderGallery(images, title) {
  const main = byId('gallery-image'), placeholder = byId('gallery-placeholder');
  const strip = byId('gallery-thumbnails');
  const buttons = [];
  let current = 0, timer;
  strip.replaceChildren();
  strip.hidden = images.length <= 1;
  main.hidden = true;
  placeholder.hidden = false;

  function select(index) {
    current = index;
    const url = images[index];
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    main.hidden = true;
    placeholder.hidden = false;
    placeholder.textContent = 'Memuat gambar...';
    main.alt = `${title} — gambar ${index + 1} dari ${images.length}`;
    main.onload = () => { main.hidden = false; placeholder.hidden = true; };
    main.onerror = () => { main.hidden = true; placeholder.hidden = false; placeholder.textContent = 'Gambar proyek tidak tersedia.'; };
    main.src = url;
  }

  images.forEach((url, index) => {
    if (images.length <= 1) return;
    const button = element('button', 'gallery-thumbnail');
    const img = element('img');
    const fallback = element('span', 'thumbnail-placeholder', 'Gambar tidak tersedia');
    button.type = 'button';
    button.setAttribute('aria-label', `Tampilkan gambar ${index + 1} dari ${images.length}`);
    button.setAttribute('aria-pressed', 'false');
    fallback.hidden = true;
    img.alt = '';
    img.loading = 'lazy';
    img.onerror = () => { img.hidden = true; fallback.hidden = false; };
    img.src = url;
    button.append(img, fallback);
    button.onclick = () => { clearInterval(timer); select(index); };
    buttons.push(button);
    strip.append(button);
  });
  if (images.length) select(0);
  else placeholder.textContent = 'Gambar proyek tidak tersedia.';
  if (images.length > 1) {
    timer = setInterval(() => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) select((current + 1) % images.length);
    }, 3000);
  }
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
