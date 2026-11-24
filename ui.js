// Shared DOM helpers: spreadsheet values are always inserted as text.
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function renderTags(container, value) {
  container.replaceChildren();
  (value || '').split('|').filter(Boolean).forEach(tag => {
    container.append(element('span', 'tag', tag.trim()));
  });
}

function showRetry(container, retry, prefix = 'Data gagal dimuat. ') {
  const button = element('button', '', 'Coba lagi');
  button.type = 'button';
  button.onclick = retry;
  container.replaceChildren(document.createTextNode(prefix), button);
}
