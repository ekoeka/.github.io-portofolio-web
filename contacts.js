// Add verified public HTTPS links here. Unset sidebar destinations stay inactive.
const CONTACT_LINKS = Object.freeze({
  cv: '',
  github: 'https://github.com/ekoeka',
  linkedin: '',
  contact: ''
});

document.querySelectorAll('[data-contact]').forEach(link => {
  const url = safeURL(CONTACT_LINKS[link.dataset.contact]);
  if (!url) return;
  link.href = url;
  link.hidden = false;
  if (link.hasAttribute('aria-disabled')) {
    link.removeAttribute('aria-disabled');
    link.setAttribute('aria-label', link.dataset.contact === 'contact' ? 'Email' : 'LinkedIn');
  }
});
