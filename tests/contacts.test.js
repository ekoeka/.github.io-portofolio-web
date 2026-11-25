const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const {safeURL} = require('../data.js');
const links = ['cv', 'github', 'linkedin', 'contact'].map(name => ({dataset: {contact: name}, hidden: name === 'cv', attributes: name === 'linkedin' || name === 'contact' ? {'aria-disabled': 'true'} : {}, hasAttribute(key) { return key in this.attributes; }, removeAttribute(key) { delete this.attributes[key]; }, setAttribute(key, value) { this.attributes[key] = value; }}));
const code = fs.readFileSync(require.resolve('../contacts.js'), 'utf8');
function run(source) {
  vm.runInNewContext(source, {document: {querySelectorAll: () => links}, safeURL});
}
run(code);
assert.equal(links[1].href, 'https://github.com/ekoeka');
assert.equal(links[1].hidden, false);
assert.equal(links[2].attributes['aria-disabled'], 'true');
assert.equal(links[3].attributes['aria-disabled'], 'true');
assert.equal(links[0].hidden, true);
run(code.replace("github: 'https://github.com/ekoeka'", "github: 'https://example.com/user'").replace("linkedin: ''", "linkedin: 'https://example.com/profile'").replace("cv: ''", "cv: 'javascript:alert(1)'"));
assert.equal(links[1].href, 'https://example.com/user');
assert.equal(links[1].hidden, false);
assert.equal(links[0].hidden, true);
assert.equal(links[2].attributes['aria-disabled'], undefined);
assert.equal(links[2].attributes['aria-label'], 'LinkedIn');
console.log('Contact URL validation and visibility tests passed');
