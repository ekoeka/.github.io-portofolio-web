const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
function tags(value) { const box = el('div', 'tag-container'); (value || '').split('|').filter(Boolean).forEach(t => box.append(el('span', 'tag', t.trim()))); return box; }
function logo(value) {
  const url = safeURL(value && (/^[a-z][a-z0-9+.-]*:/i.test(value) ? value : 'https://' + value));
  if (!url) return el('span');
  const img = el('img', 'logo-instansi'); img.alt = ''; img.loading = 'lazy'; img.addEventListener('error', () => img.remove()); img.src = /\.(png|jpe?g|svg|webp)(\?|$)/i.test(url) ? url : 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(new URL(url).hostname) + '&sz=128'; return img;
}
function external(value, label) { const url = safeURL(value); if (!url) return el('span'); const a = el('a', '', label); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; }
function render(type, c, index, uniqueTitle = true) {
  let n;
  if (type === 'projects') { n = el('div', 'kartu-proyek'); n.append(el('h3','',c[0]), el('span','',c[5] ? '📅 ' + c[5] : ''), el('p','',c[1]), tags(c[6])); const a = el('a','tombol-buka','Lihat Detail'); a.href = uniqueTitle ? 'detail.html?project=' + encodeURIComponent(c[0]) : 'detail.html?id=' + index + '&title=' + encodeURIComponent(c[0]); n.append(a); }
  if (type === 'skills') { n = el('div','skill-card'); const level = Math.min(100, Math.max(0, Number(c[2]) || 0)); const top = el('div','skill-top-row'); const icon = el('div','skill-icon'); const i = el('i'); i.className = /^(?:[a-zA-Z0-9-]+\s*)+$/.test(c[3] || '') ? c[3] : 'fa-solid fa-code'; icon.append(i); const bar = el('div','skill-bar-container'), fill = el('div','skill-bar-fill'); fill.style.height = level + '%'; fill.style.background = `hsl(${level * 1.2}, 80%, 45%)`; bar.append(fill); top.append(icon,bar); n.append(top,el('span','skill-name',c[1]),el('span','skill-percent',level+'%')); }
  if (type === 'education' || type === 'courses' || type === 'experience') { n = el('div', type === 'courses' ? 'item-course' : 'timeline-item'); const content = el('div'); if (type === 'education') { content.append(el('small','',c[0]),el('br'),el('b','',c[1]),el('br'),el('span','',c[2])); n.append(logo(c[3]),content); } else if (type === 'courses') { content.append(el('b','',c[0]),el('br'),el('span','',c[1])); n.append(logo(c[2]),content); } else { content.append(el('b','',c[0]),el('br'),el('small','',c[1]),el('p','',c[2]),el('p','',c[3])); n.append(logo(c[4]),content); } }
  if (type === 'achievements') { n = el('div','timeline-item'); n.append(el('b','',c[0]),el('br'),el('small','',`${c[1] || ''} (${c[2] || ''})`),el('br'),external(c[3],'Lihat Bukti ↗')); }
  return n;
}
async function load(type, id) {
 const node = document.getElementById(id); node.textContent = 'Memuat...';
 try { const rows = await fetchCSV(sheetURL(type)); const valid = rows.map((row,index) => ({row,index})).filter(({row}) => validRow(type, row)); node.replaceChildren(); if (!valid.length) { node.textContent = 'Belum ada data.'; return; } for (const {row,index} of valid) node.append(render(type,row,index, type !== 'projects' || projectByTitle(row[0], rows) === index)); if (type === 'skills') for (const {row,index} of valid) { const copy = render(type,row,index); copy.setAttribute('aria-hidden','true'); node.append(copy); } }
 catch (_) { node.replaceChildren(document.createTextNode('Data gagal dimuat. ')); const b = el('button','','Coba lagi'); b.type = 'button'; b.onclick = () => load(type,id); node.append(b); }
}
[['projects','wadah-proyek'],['skills','wadah-skill'],['education','wadah-pendidikan'],['courses','wadah-course'],['experience','wadah-experience'],['achievements','wadah-achievement']].forEach(([type,id]) => load(type,id));
