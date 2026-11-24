const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require.resolve('../theme.js'), 'utf8');
function start(saved, blocked = false) {
  let value = saved, click, active;
  const attrs = {};
  const button = {setAttribute: (k, v) => attrs[k] = v, addEventListener: (_, fn) => click = fn};
  const document = {getElementById: () => button, body: {classList: {toggle: (_, v) => active = v}}};
  const localStorage = {getItem: () => { if (blocked) throw Error(); return value; }, setItem: (_, v) => { if (blocked) throw Error(); value = v; }};
  vm.runInNewContext(source, {document, localStorage});
  return {click: () => click(), state: () => ({active, value, pressed: attrs['aria-pressed']})};
}
const theme = start('dark');
assert.deepEqual(theme.state(), {active: true, value: 'dark', pressed: 'true'});
theme.click();
assert.deepEqual(theme.state(), {active: false, value: 'light', pressed: 'false'});
assert.equal(start(null).state().active, true);
assert.equal(start('light').state().active, false);
const blocked = start(null, true); blocked.click();
assert.equal(blocked.state().active, false);
console.log('Theme persistence and storage fallback tests passed');
