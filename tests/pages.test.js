const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

class Node {
  constructor(tag = '') { this.tag = tag; this.children = []; this.style = {}; this.attributes = {}; this.classList = {add() {}, remove() {}}; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute(key, value) { this.attributes[key] = value; }
  addEventListener() {}
  remove() {}
}
function setup(page, response) {
  const nodes = {};
  const document = {getElementById: id => nodes[id] ||= new Node(), createElement: tag => new Node(tag), createTextNode: text => ({textContent: text})};
  const context = vm.createContext({document, URL, URLSearchParams, AbortController, setTimeout, clearTimeout, setInterval: () => 1, clearInterval() {}, location: {search: '?project=Alpha'}, window: {matchMedia: () => ({matches: false})}, fetch: response});
  for (const file of ['data.js', 'ui.js', page + '.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, {filename: file});
  return nodes;
}
const csv = 'title,summary,description,images,github,date,tags,youtube,journal\nAlpha,Summary,Description,,https://example.com,2025,"one|<b>two</b>",,\n';
const tick = () => new Promise(resolve => setImmediate(resolve));
(async () => {
  const ok = async () => ({ok: true, text: async () => csv});
  const home = setup('index', ok);
  await tick();
  const card = home['wadah-proyek'].children[0];
  assert.equal(card.children[0].textContent, 'Alpha');
  assert.equal(card.children[3].children[1].textContent, '<b>two</b>');
  assert.equal(card.children[4].href, 'detail.html?project=Alpha');
  const orderedCSV = 'title,summary,description,images,github,date,tags,youtube,journal\nOther,,,,,,,,\nCursed Signal,,,,,,,,\nSmart Plant IoT,,,,,,,,\nSolar Tracker 2-DOF,,,,,,,,\n';
  const ordered = setup('index', async () => ({ok: true, text: async () => orderedCSV}));
  await tick();
  assert.deepEqual(ordered['wadah-proyek'].children.map(card => card.children[0].textContent), ['Smart Plant IoT', 'Solar Tracker 2-DOF', 'Cursed Signal', 'Other']);
  assert.equal(ordered['wadah-proyek'].children[0].children[4].href, 'detail.html?project=Smart%20Plant%20IoT');
  const detail = setup('detail', ok);
  await tick();
  assert.equal(detail.judul.textContent, 'Alpha');
  assert.equal(detail.deskripsi.textContent, 'Description');
  assert.equal(detail.tags.children[1].textContent, '<b>two</b>');
  assert.equal(detail['btn-github'].href, 'https://example.com/');
  let attempts = 0;
  const failed = setup('detail', async () => { attempts++; return {ok: false, status: 500}; });
  await tick();
  assert.equal(failed.judul.textContent, 'Data gagal dimuat.');
  const retry = failed.deskripsi.children[1];
  assert.equal(retry.textContent, 'Coba lagi');
  retry.onclick(); await tick();
  assert.equal(attempts, 2);
  const empty = setup('index', async () => ({ok: true, text: async () => 'title\n'}));
  await tick();
  assert.equal(empty['wadah-proyek'].textContent, 'Belum ada data.');
  console.log('Page rendering, safe text, retry and empty state tests passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
