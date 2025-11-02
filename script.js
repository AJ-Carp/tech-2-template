// Helpers
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const header   = $('#site-header');
const tabs     = $$('#tabs .nav__link');
const nav      = $('#site-nav');
const navTgl   = $('#nav-toggle');

// Mobile nav toggle
navTgl?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navTgl.setAttribute('aria-expanded', String(open));
});

// Close mobile nav after selecting a link
// Enhance your existing tabs handler:
tabs.forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault(); // stop "#about" going into the URL
    const id = a.dataset.target || a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Keep the URL clean (no fragment)
    history.replaceState(null, '', location.pathname + location.search);

    // Close mobile nav if open (you already have this logic, keep it)
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      navTgl.setAttribute('aria-expanded', 'false');
    }
  });
});


// Stable section spy (sticky header aware)
(function sectionSpy(){
  const ids = ['home','about','experience','projects','contact'];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const headerPx = header?.getBoundingClientRect().height || 64;
  const topMargin = -(headerPx + 8);
  const bottomMargin = '-40%';

  let activeId = '#home';

  const io = new IntersectionObserver((entries) => {
    // Choose the most visible section intersecting
    const vis = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!vis) return;

    const id = `#${vis.target.id}`;
    if (id === activeId) return;
    activeId = id;

    tabs.forEach(t => t.classList.toggle('active', (t.dataset.target === id) || (t.getAttribute('href') === id)));
    // Update URL hash without jump
  }, {
    root: null,
    rootMargin: `${topMargin}px 0px ${bottomMargin} 0px`,
    threshold: [0.15, 0.35, 0.6, 0.85]
  });

  sections.forEach(s => io.observe(s));


})();

// Reveal-on-scroll once
(function reveal(){
  const els = $$('[data-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el => io.observe(el));
})();

// Footer year
$('#year').textContent = new Date().getFullYear();

// Fake contact submit
$('#send-btn')?.addEventListener('click', () => {
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const msg = $('#message').value.trim();
  const status = $('#form-status');

  if (!name || !email || !msg) {
    status.textContent = 'Please fill in all fields.';
    status.style.color = '#ffd166';
    return;
  }
  status.textContent = 'Thanks! Your message has been queued (demo).';
  status.style.color = '#a0f0c5';
});
