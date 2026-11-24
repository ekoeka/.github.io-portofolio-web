const projectURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSc3E3Xzu3FiwgF-f-HBLtafqvZr60_yGffzZFrs4wt_GQZaMym4xVYl9Sil2bA5giQvDaYcvOuimwq/pub?gid=0&single=true&output=csv';
const byId = id => document.getElementById(id);
async function loadDetail() {
  const title = byId('judul'), description = byId('deskripsi');
  title.textContent = 'Memuat...'; description.replaceChildren(); byId('tanggal').textContent = '';
  const params = new URLSearchParams(location.search), id = params.get('id');
  if (!params.has('project') && !/^(0|[1-9]\d*)$/.test(id || '')) { title.textContent = 'ID proyek tidak valid.'; return; }
  try {
    const rows = await fetchCSV(projectURL);
    if (!rows.some(row => validRow('projects', row))) { title.textContent = 'Belum ada proyek.'; return; }
    const index = params.has('project') ? projectByTitle(params.get('project'), rows) : projectIndex(id, rows.length);
    if (index < 0 || !validRow('projects', rows[index]) || (params.has('title') && params.get('title') !== rows[index][0])) { title.textContent = 'Proyek tidak ditemukan atau telah berubah.'; return; }
    const c = rows[index]; title.textContent = c[0] || ''; description.textContent = c[2] || ''; byId('tanggal').textContent = c[5] ? '📅 ' + c[5] : '';
    const tagBox = byId('tags'); tagBox.replaceChildren(); (c[6] || '').split('|').filter(Boolean).forEach(t => { const span = document.createElement('span'); span.className = 'tag'; span.textContent = t.trim(); tagBox.append(span); });
    const images = (c[3] || '').split('|').map(safeURL).filter(Boolean), slider = byId('slider-area'), single = byId('single-img');
    if (images.length === 1) { single.src = images[0]; single.alt = c[0] || ''; single.style.display = 'block'; }
    if (images.length > 1) { const slides = images.map((url,i) => { const img = document.createElement('img'); img.className = 'slide-img' + (i === 0 ? ' active' : ''); img.src = url; img.alt = c[0] || ''; slider.append(img); return img; }); slider.style.display = 'block'; let current = 0; setInterval(() => { slides[current].classList.remove('active'); current = (current + 1) % slides.length; slides[current].classList.add('active'); }, 3000); }
    [[4,'btn-github'],[7,'btn-youtube'],[8,'btn-jurnal']].forEach(([column,button]) => { const url = safeURL(c[column]); if (url) { byId(button).href = url; byId(button).style.display = 'block'; } });
  } catch (_) { title.textContent = 'Data gagal dimuat.'; const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Coba lagi'; button.onclick = loadDetail; description.replaceChildren(button); }
}
loadDetail();
