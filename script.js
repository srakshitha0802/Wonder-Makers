const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const modeButtons = document.querySelectorAll('.theme-button');
const nav = document.querySelector('.site-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const contactOverlay = document.querySelector('.contact-overlay');
const contactOpeners = document.querySelectorAll('[data-contact-open]');
const contactClose = document.querySelector('.overlay-close');
const revealTargets = document.querySelectorAll('.reveal-section, .reveal-item');
const accordionItems = document.querySelectorAll('.accordion');

function setMode(mode) {
  body.classList.toggle('dark', mode === 'dark');
  themeToggle.setAttribute('data-mode', mode);
  localStorage.setItem('site-theme', mode);
}

function getStoredMode() {
  const stored = localStorage.getItem('site-theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initTheme() {
  setMode(getStoredMode());
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
});

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('opened');
  navLinks.classList.toggle('open', isOpen);
  body.classList.toggle('locked', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (!navLinks.classList.contains('open')) return;
    navLinks.classList.remove('open');
    nav.classList.remove('opened');
    body.classList.remove('locked');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

function openContact() {
  contactOverlay.classList.add('opened');
  contactOverlay.setAttribute('aria-hidden', 'false');
  body.classList.add('locked');
}

function closeContact() {
  contactOverlay.classList.remove('opened');
  contactOverlay.setAttribute('aria-hidden', 'true');
  body.classList.remove('locked');
}

contactOpeners.forEach((button) => {
  button.addEventListener('click', openContact);
});

contactClose?.addEventListener('click', closeContact);
contactOverlay?.addEventListener('click', (event) => {
  if (event.target === contactOverlay) closeContact();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeContact();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
);

revealTargets.forEach((target) => {
  if (target.dataset.index) {
    target.style.transitionDelay = `${Number(target.dataset.index) * 80}ms`;
  }
  revealObserver.observe(target);
});

accordionItems.forEach((item) => {
  const button = item.querySelector('.accordion-toggle');
  const panel = item.querySelector('.accordion-panel');
  button?.addEventListener('click', () => {
    const opened = item.classList.toggle('opened');
    if (opened) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    } else {
      panel.style.maxHeight = '';
    }
  });
});

initTheme();
