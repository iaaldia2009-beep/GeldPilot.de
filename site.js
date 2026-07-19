// GeldPilot.de — site.js
// Cookie-Consent, Dark Mode, Back-to-Top, Lesefortschritt.
// Läuft auf jeder Seite; Funktionen prüfen selbst, ob ihr Zielelement existiert.

/* ---------- 1. Cookie-Consent-Banner ---------- */
(function cookieConsent() {
  const KEY = 'gp_cookie_consent';
  if (localStorage.getItem(KEY)) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>Diese Website verwendet Cookies, u. a. für Werbeanzeigen über Google AdSense.
    Mehr dazu in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
    <div class="cookie-actions">
      <button class="cookie-btn cookie-btn-accept" id="cookieAccept">Akzeptieren</button>
      <button class="cookie-btn cookie-btn-reject" id="cookieReject">Ablehnen</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem(KEY, 'accepted');
    banner.remove();
  });
  document.getElementById('cookieReject').addEventListener('click', () => {
    localStorage.setItem(KEY, 'rejected');
    banner.remove();
  });
})();

/* ---------- 2. Dark Mode ---------- */
(function darkMode() {
  const KEY = 'gp_theme';
  const saved = localStorage.getItem(KEY);
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(KEY, 'light');
        btn.textContent = '🌙';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(KEY, 'dark');
        btn.textContent = '☀️';
      }
    });
  });
})();

/* ---------- 3. Back-to-Top-Button ---------- */
(function backToTop() {
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Nach oben scrollen');
    btn.textContent = '↑';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  });
})();

/* ---------- 4. Lesefortschritt (nur auf Artikelseiten) ---------- */
(function readingProgress() {
  document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (!main || !document.querySelector('.article-nav')) return; // nur Artikelseiten

    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    const inner = document.createElement('div');
    inner.className = 'reading-progress-bar';
    bar.appendChild(inner);
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      inner.style.width = pct + '%';
    });
  });
})();

/* ---------- 5. Kategorie-Filter (nur auf der Startseite) ---------- */
(function categoryFilter() {
  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.card-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.card'));
    const cats = ['Alle', ...new Set(cards.map(c => c.querySelector('.label').textContent.trim()))];

    const filterBar = document.createElement('div');
    filterBar.className = 'category-filter';
    filterBar.innerHTML = cats.map((cat, i) =>
      `<button class="filter-btn${i === 0 ? ' active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');
    grid.parentElement.insertBefore(filterBar, grid);

    filterBar.addEventListener('click', (e) => {
      if (!e.target.classList.contains('filter-btn')) return;
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.dataset.cat;
      cards.forEach(card => {
        const cardCat = card.querySelector('.label').textContent.trim();
        card.style.display = (cat === 'Alle' || cardCat === cat) ? '' : 'none';
      });
    });
  });
})();
