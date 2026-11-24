const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const {safeURL} = require('../data.js');
const links = ['cv', 'github', 'linkedin', 'contact'].map(name => ({dataset: {contact: name}, hidden: true}));
const code = fs.readFileSync(require.resolve('../contacts.js'), 'utf8');
function run(source) {
  vm.runInNewContext(source, {document: {querySelectorAll: () => links}, safeURL});
}
run(code);
assert.ok(links.every(link => link.hidden));
run(code.replace("github: ''", "github: 'https://example.com/user'").replace("cv: ''", "cv: 'javascript:alert(1)'"));
assert.equal(links[1].href, 'https://example.com/user');
assert.equal(links[1].hidden, false);
assert.equal(links[0].hidden, true);
console.log('Contact URL validation and visibility tests passed');
