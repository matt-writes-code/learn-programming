// ── Theme ──────────────────────────────────────────────────────
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

const saved = localStorage.getItem('lp-theme') || 'dark';
html.dataset.theme = saved;
if (themeToggle) themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('lp-theme', next);
  });
}

// ── Mobile sidebar ─────────────────────────────────────────────
const sidebar    = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const overlay    = document.getElementById('overlay');

function openSidebar()  { sidebar?.classList.add('open');    overlay?.classList.add('visible'); }
function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('visible'); }

menuToggle?.addEventListener('click', () =>
  sidebar?.classList.contains('open') ? closeSidebar() : openSidebar()
);

overlay?.addEventListener('click', closeSidebar);

sidebar?.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', () => { if (window.innerWidth <= 800) closeSidebar(); })
);

// ── Copy buttons ───────────────────────────────────────────────
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.closest('.code-block').querySelector('pre').innerText;
    navigator.clipboard?.writeText(text).catch(() => {}).finally(() => flash(btn));
    if (!navigator.clipboard) {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      Object.assign(ta.style, { position: 'fixed', opacity: '0' });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      flash(btn);
    }
  });
});

function flash(btn) {
  btn.textContent = 'Copied!';
  btn.classList.add('copied');
  setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
}

// ── Tabs ───────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabGroup = btn.dataset.group || 'default';
    const target   = btn.dataset.tab;

    document.querySelectorAll(`.tab-btn[data-group="${tabGroup}"]`)
      .forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.tab-content[data-group="${tabGroup}"]`)
      .forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-${target}`)?.classList.add('active');
  });
});

// ── Reading progress ───────────────────────────────────────────
const bar = document.getElementById('progress-bar');
if (bar) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = `${(window.scrollY / (h.scrollHeight - h.clientHeight)) * 100}%`;
  });
}

// ── Active nav link on scroll ──────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if (sections.length && navLinks.length) {
  const topH = document.getElementById('topbar')?.offsetHeight ?? 56;
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: `-${topH + 8}px 0px -65% 0px`, threshold: 0 })
  .observe ? sections.forEach(s =>
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
      }
    }, { rootMargin: `-${topH + 8}px 0px -65% 0px`, threshold: 0 }).observe(s)
  ) : null;
}
