'use strict';

// ── Config: ranks ──────────────────────────────────────────────────────────
const RANKS = [
  { min: 26, label: 'Infernal Max Cape' },
  { min: 21, label: 'Trimmed Completionist' },
  { min: 17, label: 'Sausage Slayer Master' },
  { min: 13, label: 'Fire Cape Enjoyer' },
  { min: 10, label: 'Barrows Banger' },
  { min: 7,  label: 'Rune Sausager' },
  { min: 5,  label: 'Mithril Muncher' },
  { min: 3,  label: 'Iron Eater' },
  { min: 1,  label: 'Bronze Nibbler' },
  { min: 0,  label: 'Tutorial Island' },
];

// ── Config: eat animation messages ────────────────────────────────────────
const FELLED_MESSAGES = [
  'Sausage has been slain',
  'You have defeated the banger',
  'Gg ez sausage',
  'New sausage drop: 1 eaten',
  'Sausage Champion defeated',
  'Your sausage has been added to your bank',
  'You feel the power of the sausage flow through you',
];

// ── SVG builder ───────────────────────────────────────────────────────────
function buildSausageSVG(width, height) {
  // Curved sausage with char marks, scaled to any size
  const w = width, h = height;
  const r = h / 2;
  // Main body path: rounded pill
  const bodyColor = '#A8431F';
  const charColor = '#3A2414';
  const shineColor = 'rgba(255,200,120,0.18)';
  const shadowColor = 'rgba(0,0,0,0.38)';

  // We use a slight arc to make it look curved (not perfectly straight)
  const cx = w / 2, cy = h / 2;

  // Char mark positions (diagonal, across the body, avoiding end caps)
  const marks = [];
  const markCount = 4;
  const markStart = r + 4;
  const markEnd = w - r - 4;
  const span = markEnd - markStart;
  for (let i = 0; i < markCount; i++) {
    const x = markStart + (span * (i + 0.5) / markCount);
    marks.push(x);
  }

  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="sausage-clip-${w}">
      <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}"/>
    </clipPath>
    <radialGradient id="sausage-grad-${w}" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#C95A2A"/>
      <stop offset="100%" stop-color="#7a2e10"/>
    </radialGradient>
  </defs>

  <!-- Body -->
  <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}"
        fill="url(#sausage-grad-${w})"/>

  <!-- Char marks (diagonal lines) -->
  ${marks.map(x => `
  <line x1="${x - 6}" y1="${cy - r * 0.7}" x2="${x + 4}" y2="${cy + r * 0.7}"
        stroke="${charColor}" stroke-width="${Math.max(1.5, w * 0.018)}" stroke-linecap="round"
        clip-path="url(#sausage-clip-${w})"/>
  `).join('')}

  <!-- End cap shading -->
  <ellipse cx="${r}" cy="${cy}" rx="${r * 0.42}" ry="${r * 0.7}"
           fill="${shadowColor}" clip-path="url(#sausage-clip-${w})"/>
  <ellipse cx="${w - r}" cy="${cy}" rx="${r * 0.42}" ry="${r * 0.7}"
           fill="${shadowColor}" clip-path="url(#sausage-clip-${w})"/>

  <!-- Shine -->
  <ellipse cx="${cx}" cy="${cy * 0.45}" rx="${w * 0.3}" ry="${h * 0.13}"
           fill="${shineColor}" clip-path="url(#sausage-clip-${w})"/>

  <!-- Outline -->
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${r}" ry="${r}"
        fill="none" stroke="${charColor}" stroke-width="1.5"/>
</svg>`.trim();
}

function buildSmallSausageSVG() {
  const id = Math.random().toString(36).slice(2, 7);
  return `<svg width="28" height="14" viewBox="0 0 28 14" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0">
  <defs>
    <linearGradient id="sg-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#d4602a"/>
      <stop offset="45%"  stop-color="#a8421e"/>
      <stop offset="100%" stop-color="#6b2810"/>
    </linearGradient>
    <clipPath id="sc-${id}"><rect x="0" y="0" width="28" height="14" rx="7" ry="7"/></clipPath>
  </defs>
  <rect x="0" y="0" width="28" height="14" rx="7" ry="7" fill="url(#sg-${id})"/>
  <ellipse cx="6"  cy="9" rx="3.5" ry="4.5" fill="rgba(0,0,0,0.22)" clip-path="url(#sc-${id})"/>
  <ellipse cx="22" cy="9" rx="3.5" ry="4.5" fill="rgba(0,0,0,0.22)" clip-path="url(#sc-${id})"/>
  <line x1="10" y1="2" x2="13" y2="12" stroke="#3a2010" stroke-width="1.6" stroke-linecap="round" clip-path="url(#sc-${id})"/>
  <line x1="16" y1="2" x2="19" y2="12" stroke="#3a2010" stroke-width="1.6" stroke-linecap="round" clip-path="url(#sc-${id})"/>
  <ellipse cx="14" cy="3.5" rx="7" ry="2" fill="rgba(255,200,140,0.22)" clip-path="url(#sc-${id})"/>
  <rect x="0.5" y="0.5" width="27" height="13" rx="6.5" ry="6.5" fill="none" stroke="#2a1508" stroke-width="1"/>
</svg>`;
}

function buildSausageProgressBar(pct, totalWidth, barHeight) {
  const w = totalWidth, h = barHeight;
  const r = h / 2;
  const bodyColor = '#A8431F';
  const charColor = '#3A2414';
  const fillW = Math.max(0, Math.min(1, pct)) * w;

  // Char marks on the filled portion
  const marks = [];
  const markCount = 6;
  const markStart = r + 6;
  const markEnd = w - r - 6;
  const span = markEnd - markStart;
  for (let i = 0; i < markCount; i++) {
    const x = markStart + (span * (i + 0.5) / markCount);
    marks.push(x);
  }

  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="bar-fill-clip">
      <rect x="0" y="0" width="${fillW}" height="${h}" rx="${r}" ry="${r}"/>
    </clipPath>
    <clipPath id="bar-outline-clip">
      <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}"/>
    </clipPath>
    <radialGradient id="bar-grad" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#C95A2A"/>
      <stop offset="100%" stop-color="#7a2e10"/>
    </radialGradient>
  </defs>

  <!-- Track -->
  <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}"
        fill="#2a1a0a"/>

  <!-- Fill -->
  ${fillW > 0 ? `
  <rect x="0" y="0" width="${fillW}" height="${h}" rx="${r}" ry="${r}"
        fill="url(#bar-grad)"/>

  <!-- Char marks on fill -->
  ${marks.filter(x => x < fillW - 4).map(x => `
  <line x1="${x - 7}" y1="${h * 0.15}" x2="${x + 5}" y2="${h * 0.85}"
        stroke="${charColor}" stroke-width="2.5" stroke-linecap="round"
        clip-path="url(#bar-fill-clip)"/>
  `).join('')}

  <!-- Shine on fill -->
  <ellipse cx="${fillW / 2}" cy="${h * 0.3}" rx="${fillW * 0.35}" ry="${h * 0.12}"
           fill="rgba(255,200,120,0.15)" clip-path="url(#bar-fill-clip)"/>
  ` : ''}

  <!-- Outline -->
  <rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="${r}" ry="${r}"
        fill="none" stroke="${charColor}" stroke-width="1.5"/>
</svg>`.trim();
}

// ── Auth state ─────────────────────────────────────────────────────────────
let authToken = localStorage.getItem('sausage_token');
let authUser   = localStorage.getItem('sausage_user');
let authUserId = Number(localStorage.getItem('sausage_userid') || 0);

// ── Socket ─────────────────────────────────────────────────────────────────
const socket = io();

// ── DOM refs ───────────────────────────────────────────────────────────────
const loginScreen     = document.getElementById('login-screen');
const appEl           = document.getElementById('app');
const usernameSelect  = document.getElementById('username-select');
const passwordInput   = document.getElementById('password-input');
const loginBtn        = document.getElementById('login-btn');
const loginError      = document.getElementById('login-error');
const headerUser      = document.getElementById('header-user');
const logoutBtn       = document.getElementById('logout-btn');
const progressCount   = document.getElementById('progress-count');
const sausageBarWrap  = document.querySelector('.sausage-bar-wrap');
const leaderboardEl   = document.getElementById('leaderboard');
const logSelfBtn      = document.getElementById('log-self-btn');
const logMateBtn      = document.getElementById('log-mate-btn');
const mateModal       = document.getElementById('mate-modal');
const mateList        = document.getElementById('mate-list');
const modalCloseBtn   = document.getElementById('modal-close-btn');
const eatOverlay      = document.getElementById('eat-overlay');
const eatSausageWrap  = document.getElementById('eat-sausage-wrap');
const eatMsg          = document.getElementById('eat-msg');
const celebrateOverlay = document.getElementById('celebrate-overlay');
const confettiCanvas  = document.getElementById('confetti-canvas');
const celebrateDismiss = document.getElementById('celebrate-dismiss');

// ── Inject login icon ──────────────────────────────────────────────────────
document.querySelector('.login-icon').innerHTML = buildSausageSVG(90, 42);

// ── Helpers ────────────────────────────────────────────────────────────────
function getRankLabel(total) {
  for (const r of RANKS) {
    if (total >= r.min) return r.label;
  }
  return RANKS[RANKS.length - 1].label;
}

function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function apiFetch(path, opts = {}) {
  return fetch(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': authToken || '',
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(r => r.json());
}

// ── Populate username list on load ─────────────────────────────────────────
async function loadUserList() {
  // We need the user list before login; use the state endpoint with no auth
  // Instead fetch via seed — actually use a public /api/users-public endpoint
  // Simplest: just try /api/users with no token and handle 401 gracefully,
  // OR keep a cached list. Let's fetch /api/state without token which returns 401,
  // so we need a separate endpoint. We'll add a public names route via query param trick.
  // Actually we just query /api/users-list (no auth needed for names only).
  try {
    const res = await fetch('/api/usernames');
    if (!res.ok) return;
    const names = await res.json();
    names.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      usernameSelect.appendChild(opt);
    });
  } catch (_) {}
}

// ── Login flow ─────────────────────────────────────────────────────────────
async function doLogin() {
  const username = usernameSelect.value;
  const password = passwordInput.value;
  loginError.textContent = '';
  if (!username) { loginError.textContent = 'Choose thy name.'; return; }
  if (!password) { loginError.textContent = 'Enter the password.'; return; }

  loginBtn.disabled = true;
  loginBtn.textContent = '...';

  try {
    const data = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then(r => r.json());

    if (data.error) {
      loginError.textContent = data.error === 'Wrong password' ? 'The password is wrong.' : data.error;
      return;
    }

    authToken  = data.token;
    authUser   = data.username;
    authUserId = data.userId;
    localStorage.setItem('sausage_token',  authToken);
    localStorage.setItem('sausage_user',   authUser);
    localStorage.setItem('sausage_userid', authUserId);

    showApp();
  } catch (e) {
    loginError.textContent = 'Connection failed.';
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Enter';
  }
}

loginBtn.addEventListener('click', doLogin);
passwordInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('sausage_token');
  localStorage.removeItem('sausage_user');
  localStorage.removeItem('sausage_userid');
  authToken = authUser = null;
  authUserId = 0;
  appEl.classList.add('hidden');
  loginScreen.classList.remove('hidden');
});

// ── Show app ───────────────────────────────────────────────────────────────
async function showApp() {
  loginScreen.classList.add('hidden');
  appEl.classList.remove('hidden');
  headerUser.textContent = authUser;

  // Fetch initial state
  try {
    const state = await apiFetch('/api/state');
    renderState(state);
    if (state.showCelebration) showCelebration();
  } catch (_) {}
}

// ── Render state ───────────────────────────────────────────────────────────
let currentLeaderboard = [];

function renderState(state, flashUserId = null) {
  currentLeaderboard = state.leaderboard || [];
  const total = state.groupTotal || 0;
  const goal  = state.goal || 100;
  const pct   = total / goal;

  progressCount.textContent = total;
  document.getElementById('progress-goal').textContent = goal;

  // Progress bar SVG
  const barWidth = Math.min(sausageBarWrap.offsetWidth || 320, 480);
  sausageBarWrap.innerHTML = buildSausageProgressBar(pct, barWidth, 48);

  // Leaderboard rows
  const existing = {};
  leaderboardEl.querySelectorAll('.lb-row').forEach(el => {
    existing[el.dataset.uid] = el;
  });

  const fragment = document.createDocumentFragment();

  currentLeaderboard.forEach((user, idx) => {
    const rank = idx + 1;
    const rankLabel = getRankLabel(user.total);
    const icons = Array.from({ length: user.total }, () => buildSmallSausageSVG()).join('');

    const row = document.createElement('div');
    row.className = 'lb-row';
    row.dataset.uid = user.id;
    row.innerHTML = `
      <div class="lb-top">
        <div class="lb-rank ${rank <= 3 ? 'rank-' + rank : ''}">${rank}</div>
        <div class="lb-name-wrap">
          <div class="lb-name">${escHtml(user.username)}</div>
          <div class="lb-rank-title">${escHtml(rankLabel)}</div>
        </div>
        <div class="lb-total">${user.total}</div>
      </div>
      ${user.total > 0 ? `<div class="lb-icons">${icons}</div>` : ''}
    `;

    if (flashUserId !== null && user.id === flashUserId) {
      // Flash row
      setTimeout(() => {
        row.classList.add('flash');
        setTimeout(() => row.classList.remove('flash'), 600);
      }, 10);

      // +1 float
      const plus = document.createElement('div');
      plus.className = 'plus-one';
      plus.textContent = '+1';
      row.appendChild(plus);
      setTimeout(() => plus.remove(), 1300);
    }

    fragment.appendChild(row);
  });

  leaderboardEl.innerHTML = '';
  leaderboardEl.appendChild(fragment);
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Socket state updates ───────────────────────────────────────────────────
socket.on('state_update', (state) => {
  if (!authToken) return;
  const flashId = state.lastLoggedUserId ?? null;
  renderState(state, flashId);
});

// ── Log buttons ─────────────────────────────────────────────────────────────
let logBusy = false;

async function logSausage(targetUserId) {
  if (logBusy) return;
  logBusy = true;
  logSelfBtn.disabled = true;
  logMateBtn.disabled = true;

  try {
    await apiFetch('/api/log', {
      method: 'POST',
      body: { targetUserId: targetUserId || null },
    });
    await playEatAnimation();
  } catch (_) {}

  setTimeout(() => {
    logBusy = false;
    logSelfBtn.disabled = false;
    logMateBtn.disabled = false;
  }, 400);
}

logSelfBtn.addEventListener('click', () => logSausage(null));

// ── Log for a mate modal ──────────────────────────────────────────────────
logMateBtn.addEventListener('click', async () => {
  mateList.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:12px">Loading…</p>';
  mateModal.classList.remove('hidden');

  const users = await apiFetch('/api/users').catch(() => []);
  mateList.innerHTML = '';
  users.forEach(u => {
    const item = document.createElement('div');
    item.className = 'mate-item';
    item.innerHTML = `<span class="mate-name">${escHtml(u.username)}</span><span class="mate-count">${u.total} 🥩</span>`;
    item.addEventListener('click', () => {
      mateModal.classList.add('hidden');
      logSausage(u.id);
    });
    mateList.appendChild(item);
  });
});

modalCloseBtn.addEventListener('click', () => mateModal.classList.add('hidden'));
mateModal.addEventListener('click', e => { if (e.target === mateModal) mateModal.classList.add('hidden'); });

// ── Eat animation ──────────────────────────────────────────────────────────
function playEatAnimation() {
  return new Promise(resolve => {
    const W = 170, H = 80;
    eatSausageWrap.innerHTML = buildSausageSVG(W, H);
    eatMsg.style.opacity = '0';
    eatMsg.textContent = randItem(FELLED_MESSAGES);

    eatOverlay.classList.remove('hidden');

    const svg = eatSausageWrap.querySelector('svg');
    svg.style.transition = 'none';
    svg.style.opacity = '0';
    svg.style.transform = 'scale(0.7)';

    // Step 1: scale in
    requestAnimationFrame(() => requestAnimationFrame(() => {
      svg.style.transition = 'opacity 0.25s ease, transform 0.3s ease';
      svg.style.opacity = '1';
      svg.style.transform = 'scale(1)';
    }));

    // Step 2: bite animation via clip-path (4 bites, eating from right)
    const bites = 4;
    const biteDelay = 250;
    const startDelay = 350;

    // We animate a clip rect getting narrower from the right
    // Inject a clipPath into the SVG
    const clipId = 'eat-bite-clip';
    const ns = 'http://www.w3.org/2000/svg';

    const defs = svg.querySelector('defs') || (() => {
      const d = document.createElementNS(ns, 'defs');
      svg.prepend(d);
      return d;
    })();

    const clipPath = document.createElementNS(ns, 'clipPath');
    clipPath.id = clipId;
    const clipRect = document.createElementNS(ns, 'rect');
    clipRect.setAttribute('x', '0');
    clipRect.setAttribute('y', '0');
    clipRect.setAttribute('width', String(W));
    clipRect.setAttribute('height', String(H));
    clipPath.appendChild(clipRect);
    defs.appendChild(clipPath);

    // Apply clip to all direct children that aren't defs
    svg.childNodes.forEach(node => {
      if (node !== defs && node.setAttribute) {
        node.setAttribute('clip-path', `url(#${clipId})`);
      }
    });

    let remainingWidth = W;
    let bitesDone = 0;

    function takeBite() {
      if (bitesDone >= bites) {
        // Final: fade out
        svg.style.transition = 'opacity 0.2s ease';
        svg.style.opacity = '0';
        // Show message
        setTimeout(() => {
          eatMsg.style.transition = 'opacity 0.35s ease';
          eatMsg.style.opacity = '1';
        }, 100);
        setTimeout(() => {
          eatOverlay.classList.add('hidden');
          eatMsg.style.opacity = '0';
          resolve();
        }, 900);
        return;
      }

      const biteSize = (W / (bites + 1)) * (1 + bitesDone * 0.15);
      remainingWidth = Math.max(0, remainingWidth - biteSize);

      // Animate clip rect width
      clipRect.style.transition = `width 0.15s ease-in`;
      clipRect.setAttribute('width', String(remainingWidth));

      // Add a "chomped" visual: brief shake
      svg.style.transition = 'transform 0.08s';
      svg.style.transform = 'scale(1) translateX(-4px)';
      setTimeout(() => { svg.style.transform = 'scale(1) translateX(0)'; }, 80);

      bitesDone++;
      setTimeout(takeBite, biteDelay);
    }

    setTimeout(takeBite, startDelay);
  });
}

// ── Goal celebration ────────────────────────────────────────────────────────
function showCelebration() {
  document.getElementById('celebrate-sausage').innerHTML = buildSausageSVG(120, 56);
  celebrateOverlay.classList.remove('hidden');
  startConfetti();
}

celebrateDismiss.addEventListener('click', async () => {
  celebrateOverlay.classList.add('hidden');
  stopConfetti();
  await apiFetch('/api/celebrate/seen', { method: 'POST' }).catch(() => {});
});

// ── Confetti ────────────────────────────────────────────────────────────────
let confettiAnim = null;
const CONFETTI_COLORS = ['#a8d8f0','#6abf80','#ddeef8','#4a8aaa','#2d7a50','#ffffff','#5ab0d0'];

function startConfetti() {
  const canvas = confettiCanvas;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: 8 + Math.random() * 10,
    h: 4 + Math.random() * 6,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    speed: 2 + Math.random() * 3,
    angle: Math.random() * Math.PI * 2,
    spin:  (Math.random() - 0.5) * 0.15,
    drift: (Math.random() - 0.5) * 1.2,
  }));

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      p.angle += p.spin;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    confettiAnim = requestAnimationFrame(frame);
  }
  frame();
}

function stopConfetti() {
  if (confettiAnim) cancelAnimationFrame(confettiAnim);
  confettiAnim = null;
}

// ── Resize: redraw progress bar ────────────────────────────────────────────
window.addEventListener('resize', () => {
  if (currentLeaderboard.length) {
    const total = currentLeaderboard.reduce((s, u) => s + u.total, 0);
    const pct = total / 100;
    const barWidth = Math.min(sausageBarWrap.offsetWidth || 320, 480);
    sausageBarWrap.innerHTML = buildSausageProgressBar(pct, barWidth, 48);
  }
});

// ── Boot ───────────────────────────────────────────────────────────────────
(async function boot() {
  await loadUserList();

  if (authToken && authUser) {
    showApp();
  }
})();
