// Shared CSV and fetch helpers for the static portfolio pages.
function parseCSV(input) {
  if (typeof input !== 'string') throw new Error('CSV input must be text');
  const source = input.replace(/^\uFEFF/, '');
  if (!source.trim()) return [];
  const rows = []; let row = [], field = '', quoted = false, closed = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"' && source[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { quoted = false; closed = true; }
      else field += ch;
    } else if (closed && ch !== ',' && ch !== '\n' && ch !== '\r') throw new Error('Malformed CSV: text after quote');
    else if (ch === '"' && field === '') quoted = true;
    else if (ch === '"') throw new Error('Malformed CSV: unexpected quote');
    else if (ch === ',') { row.push(field); field = ''; closed = false; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && source[i + 1] === '\n') i++;
      row.push(field); field = ''; closed = false;
      if (row.some(value => value !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (quoted) throw new Error('Malformed CSV: unclosed quoted field');
  row.push(field); if (row.some(value => value !== '')) rows.push(row);
  if (!rows.length) return [];
  const width = rows[0].length;
  if (rows.some(value => value.length !== width)) throw new Error('Malformed CSV: inconsistent column count');
  return rows.slice(1);
}


async function fetchCSV(url, timeout = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try { const response = await fetch(url, {signal: controller.signal}); if (!response.ok) throw new Error('HTTP ' + response.status); return parseCSV(await response.text()); }
  finally { clearTimeout(timer); }
}
function safeURL(value) {
  if (!value || !value.trim()) return '';
  try { const url = new URL(value.trim()); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : ''; } catch (_) { return ''; }
}
function projectIndex(id, length) {
  if (!/^(0|[1-9]\d*)$/.test(id || '')) return -1;
  const number = Number(id); return Number.isSafeInteger(number) && number < length ? number : -1;
}
// A title is the only existing project field usable as an identifier without
// changing the sheet schema. Ambiguous titles must never resolve silently.
function projectByTitle(title, rows) {
  if (!title || !title.trim()) return -1;
  const matches = rows.map((row, index) => row[0] === title ? index : -1).filter(index => index >= 0);
  return matches.length === 1 ? matches[0] : -1;
}
function validRow(type, row) {
  const required = type === 'skills' ? 1 : 0;
  return Array.isArray(row) && typeof row[required] === 'string' && !!row[required].trim();
}
if (typeof module !== 'undefined') module.exports = {parseCSV, fetchCSV, safeURL, projectIndex, projectByTitle, validRow};
