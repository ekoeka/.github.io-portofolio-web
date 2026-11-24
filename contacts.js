// Add verified public HTTPS links here. Empty entries remain hidden.
const CONTACT_LINKS = Object.freeze({
  cv: '',
  github: '',
  linkedin: '',
  contact: ''
});

document.querySelectorAll('[data-contact]').forEach(link => {
  const url = safeURL(CONTACT_LINKS[link.dataset.contact]);
  if (!url) return;
  link.href = url;
  link.hidden = false;
});
