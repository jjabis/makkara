'use strict';

// ── Config: ranks (CS:GO) ─────────────────────────────────────────────────
const RANKS = [
  { min: 10, label: 'Global Elite' },
  { min: 9,  label: 'Supreme Master First Class' },
  { min: 8,  label: 'Legendary Eagle Master' },
  { min: 7,  label: 'Legendary Eagle' },
  { min: 6,  label: 'Distinguished Master Guardian' },
  { min: 5,  label: 'Master Guardian Elite' },
  { min: 4,  label: 'Master Guardian I' },
  { min: 3,  label: 'Gold Nova Master' },
  { min: 2,  label: 'Gold Nova I' },
  { min: 1,  label: 'Silver Elite' },
  { min: 0,  label: 'Silver I' },
];

// ── Config: multi-kill streaks ────────────────────────────────────────────
const MULTI_KILLS = [
  { min: 6, label: 'MONSTER KILL', color: '#ff2222' },
  { min: 5, label: 'PENTA KILL',   color: '#ff4400' },
  { min: 4, label: 'QUADRA KILL',  color: '#ff8800' },
  { min: 3, label: 'TRIPLE KILL',  color: '#ffaa00' },
  { min: 2, label: 'DOUBLE KILL',  color: '#ffe040' },
];

// ── Config: eat animation messages ────────────────────────────────────────
const FELLED_MESSAGES = [
  'Sausage eliminated',
  'Clutched the banger 1v1',
  'Sausage defused',
  'Headshot. Sausage down.',
  'AWP shot. Clean kill.',
  'Banger has been planted',
  'Sausage bought with eco money',
  'Full buy — full eat',
  'Sausage rushed B, got eaten',
  'GG EZ. Next sausage.',
  'Sausage disconnected (eaten)',
  'Knife kill. Sausage rekt.',
  'That sausage was hacking. Reported.',
  'Molotov. Sausage cooked.',
  'Flash assist — sausage blinded and eaten',
  'Bingo bango bongo, bish bash bosh',
  'Easy peasy lemon squeezy',
  'Tango down',
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
    startPaceTicker();
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

    // Build multi-kill streak badges
    const mk = user.multiKills || {};
    const mkBadges = [
      { count: mk.monster, label: 'Monster Kill', color: '#ff2222' },
      { count: mk.penta,   label: 'Penta Kill',   color: '#ff4400' },
      { count: mk.overkill,label: 'Quadra Kill',  color: '#ff8800' },
      { count: mk.triple,  label: 'Triple Kill',  color: '#ffaa00' },
      { count: mk.double,  label: 'Double Kill',  color: '#ffe040' },
    ].filter(b => b.count > 0)
     .map(b => `<span class="mk-badge" style="color:${b.color};border-color:${b.color}">${b.count}× ${b.label}</span>`)
     .join('');

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
      ${mkBadges ? `<div class="lb-streaks">${mkBadges}</div>` : ''}
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
let prevGroupTotal = 0;

socket.on('state_update', (state) => {
  if (!authToken) return;
  const flashId = state.lastLoggedUserId ?? null;
  renderState(state, flashId);
  updatePace();

  const newTotal = state.groupTotal || 0;

  // Goal just reached — show celebration to everyone live, no refresh needed
  if (prevGroupTotal < 100 && newTotal >= 100) {
    const seenKey = `goal_seen_${authUserId}`;
    if (!localStorage.getItem(seenKey)) {
      showCelebration();
    }
  }

  // Every sausage after 100 also gets confetti (brief burst)
  if (newTotal > 100 && newTotal > prevGroupTotal) {
    startConfetti();
    setTimeout(stopConfetti, 2500);
  }

  prevGroupTotal = newTotal;
});

// ── Log buttons ─────────────────────────────────────────────────────────────
let logBusy = false;

async function logSausage(targetUserId) {
  if (logBusy) return;
  logBusy = true;
  logSelfBtn.disabled = true;
  logMateBtn.disabled = true;

  try {
    const result = await apiFetch('/api/log', {
      method: 'POST',
      body: { targetUserId: targetUserId || null },
    });
    await playEatAnimation(result.multiKillCount || 1);
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
    item.innerHTML = `<span class="mate-name">${escHtml(u.username)}</span><span class="mate-count">${buildSmallSausageSVG()} ${u.total}</span>`;
    item.addEventListener('click', () => {
      mateModal.classList.add('hidden');
      logSausage(u.id);
    });
    mateList.appendChild(item);
  });
});

modalCloseBtn.addEventListener('click', () => mateModal.classList.add('hidden'));
mateModal.addEventListener('click', e => { if (e.target === mateModal) mateModal.classList.add('hidden'); });

// ── Eat animation helpers ──────────────────────────────────────────────────
function buildRawSausageSVG(w, h) {
  const r = h / 2;
  const id = Math.random().toString(36).slice(2, 7);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="raw-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#f5cdb8"/>
      <stop offset="60%"  stop-color="#e8a888"/>
      <stop offset="100%" stop-color="#d08060"/>
    </linearGradient>
    <clipPath id="rawc-${id}">
      <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}"/>
    </clipPath>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="url(#raw-${id})"/>
  <ellipse cx="${r}"     cy="${h * 0.6}" rx="${r * 0.5}" ry="${r * 0.8}" fill="rgba(0,0,0,0.1)"  clip-path="url(#rawc-${id})"/>
  <ellipse cx="${w - r}" cy="${h * 0.6}" rx="${r * 0.5}" ry="${r * 0.8}" fill="rgba(0,0,0,0.1)"  clip-path="url(#rawc-${id})"/>
  <ellipse cx="${w / 2}" cy="${h * 0.3}" rx="${w * 0.3}" ry="${h * 0.14}" fill="rgba(255,240,230,0.5)" clip-path="url(#rawc-${id})"/>
  <rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="${r}" ry="${r}" fill="none" stroke="#c08868" stroke-width="1.5"/>
</svg>`;
}

function buildBonfireSVG(w) {
  // Bonfire rising from the bottom — flames engulf from below
  const SH = 200; // SVG height
  const base = SH; // flames start at the very bottom

  // Outer flames (tall, wide, orange/red)
  const outerFlames = [
    { x: w*0.28, fh: 175, fw: 0.35, delay: '0.09s' },
    { x: w*0.50, fh: 185, fw: 0.38, delay: '0.04s' },
    { x: w*0.72, fh: 170, fw: 0.33, delay: '0.13s' },
  ];

  // Inner flames (shorter, narrower, yellow/white — the hot core)
  const innerFlames = [
    { x: w*0.32, fh: 110, fw: 0.18, delay: '0.06s' },
    { x: w*0.50, fh: 130, fw: 0.22, delay: '0.02s' },
    { x: w*0.68, fh: 105, fw: 0.17, delay: '0.11s' },
  ];

  function flamePath(x, fh, fw) {
    const hw = fh * fw;
    const tip = base - fh;
    return `M ${x},${base} C ${x-hw},${base-fh*0.28} ${x-hw*0.55},${base-fh*0.68} ${x},${tip} C ${x+hw*0.55},${base-fh*0.68} ${x+hw},${base-fh*0.28} ${x},${base} Z`;
  }

  const outerPaths = outerFlames.map(({x, fh, fw, delay}) =>
    `<path d="${flamePath(x, fh, fw)}" fill="url(#fout)"
      style="transform-origin:${x}px ${base}px;animation:flicker 0.38s ${delay} ease-in-out infinite alternate"/>`
  ).join('');

  const innerPaths = innerFlames.map(({x, fh, fw, delay}) =>
    `<path d="${flamePath(x, fh, fw)}" fill="url(#fin)"
      style="transform-origin:${x}px ${base}px;animation:flicker 0.30s ${delay} ease-in-out infinite alternate"/>`
  ).join('');

  return `<svg width="${w}" height="${SH}" viewBox="0 0 ${w} ${SH}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block">
  <defs>
    <linearGradient id="fout" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%"   stop-color="#cc2200"/>
      <stop offset="35%"  stop-color="#ff6600"/>
      <stop offset="75%"  stop-color="#ffaa00"/>
      <stop offset="100%" stop-color="#ffdd00" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fin" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%"   stop-color="#ff8800"/>
      <stop offset="50%"  stop-color="#ffdd00"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="ember" cx="50%" cy="100%" r="55%">
      <stop offset="0%"   stop-color="#ff6600" stop-opacity="0.9"/>
      <stop offset="60%"  stop-color="#ff2200" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#aa1100" stop-opacity="0"/>
    </radialGradient>
    <style>
      @keyframes flicker {
        from { transform: scaleX(1)    scaleY(1);    }
        to   { transform: scaleX(0.78) scaleY(1.14); }
      }
    </style>
  </defs>
  <!-- ember glow at base -->
  <ellipse cx="${w/2}" cy="${SH}" rx="${w*0.55}" ry="28" fill="url(#ember)"/>
  <!-- logs (2x bigger) -->
  <rect x="${w*0.08}" y="${SH - 18}" width="${w*0.56}" height="18" rx="7" fill="#3a1a08" transform="rotate(-8,${w*0.36},${SH-9})"/>
  <rect x="${w*0.36}" y="${SH - 18}" width="${w*0.60}" height="18" rx="7" fill="#3a1a08" transform="rotate(6,${w*0.66},${SH-9})"/>
  ${outerPaths}
  ${innerPaths}
</svg>`;
}

// ── Eat animation ──────────────────────────────────────────────────────────
function playEatAnimation(multiKillCount = 1) {
  return new Promise(resolve => {
    const W = 170, H = 80;
    eatMsg.style.opacity = '0';
    eatMsg.textContent = randItem(FELLED_MESSAGES);
    eatOverlay.classList.remove('hidden');

    // Multi-kill banner element (recreate each time to reset transitions)
    const multiKill = MULTI_KILLS.find(mk => multiKillCount >= mk.min);
    const existingMkEl = document.getElementById('eat-multikill');
    if (existingMkEl) existingMkEl.remove();
    const mkEl = document.createElement('p');
    mkEl.id = 'eat-multikill';
    mkEl.className = 'eat-multikill';
    mkEl.style.cssText = `opacity:0;transform:scale(1.6);color:${multiKill ? multiKill.color : 'transparent'}`;
    mkEl.textContent = multiKill ? multiKill.label : '';
    // Insert AFTER sausage wrap, before felled message
    eatMsg.parentNode.insertBefore(mkEl, eatMsg);

    // Build layered stage:
    // sausage sits at top; bonfire rises from below and engulfs it
    const WRAP_H = 175;
    eatSausageWrap.style.cssText = `position:relative;width:${W}px;height:${WRAP_H}px;overflow:visible`;

    // Raw sausage — sits near top
    const rawDiv = document.createElement('div');
    rawDiv.style.cssText = 'position:absolute;top:8px;left:0;opacity:0;transform:scale(0.8);transition:opacity 0.3s ease,transform 0.35s ease';
    rawDiv.innerHTML = buildRawSausageSVG(W, H);

    // Cooked sausage — same position, fades over raw
    const cookedDiv = document.createElement('div');
    cookedDiv.style.cssText = 'position:absolute;top:8px;left:0;opacity:0;transition:opacity 1s ease';
    cookedDiv.innerHTML = buildSausageSVG(W, H);

    // Bonfire — on top of sausage so flames engulf it
    const flameDiv = document.createElement('div');
    flameDiv.style.cssText = 'position:absolute;bottom:0;left:0;opacity:0;transform:scaleY(0);transform-origin:bottom center;transition:opacity 0.4s ease,transform 0.6s ease;pointer-events:none';
    flameDiv.innerHTML = buildBonfireSVG(W);

    eatSausageWrap.innerHTML = '';
    eatSausageWrap.appendChild(rawDiv);
    eatSausageWrap.appendChild(cookedDiv);
    eatSausageWrap.appendChild(flameDiv);  // on top — engulfs sausage

    // ── Stage 1: raw sausage scales in (0–400ms)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      rawDiv.style.opacity = '1';
      rawDiv.style.transform = 'scale(1)';
    }));

    // ── Stage 2: bonfire builds from the bottom (500ms)
    setTimeout(() => {
      flameDiv.style.opacity = '1';
      flameDiv.style.transform = 'scaleY(1)';
      // cooking starts once flames reach the sausage
      setTimeout(() => { cookedDiv.style.opacity = '1'; }, 300);
    }, 500);

    // ── Stage 3: bonfire dies down, fully cooked visible (1600ms)
    setTimeout(() => {
      flameDiv.style.opacity = '0';
      flameDiv.style.transform = 'scaleY(0)';
      rawDiv.style.opacity = '0';
    }, 1600);

    // ── Stage 4: bite animation on cooked sausage (1750ms)
    setTimeout(() => {
      const svg = cookedDiv.querySelector('svg');
      const ns = 'http://www.w3.org/2000/svg';
      const defs = svg.querySelector('defs') || (() => {
        const d = document.createElementNS(ns, 'defs'); svg.prepend(d); return d;
      })();
      const clipId = 'eat-bite-clip';
      const clipPath = document.createElementNS(ns, 'clipPath');
      clipPath.id = clipId;
      const clipRect = document.createElementNS(ns, 'rect');
      clipRect.setAttribute('x', '0');
      clipRect.setAttribute('y', '0');
      clipRect.setAttribute('width', String(W));
      clipRect.setAttribute('height', String(H));
      clipPath.appendChild(clipRect);
      defs.appendChild(clipPath);
      svg.childNodes.forEach(node => {
        if (node !== defs && node.setAttribute) node.setAttribute('clip-path', `url(#${clipId})`);
      });

      let remaining = W;
      let bite = 0;
      const bites = 4;

      function takeBite() {
        if (bite >= bites) {
          svg.style.transition = 'opacity 0.2s';
          svg.style.opacity = '0';
          if (multiKill) {
            // Show only multi-kill banner, no felled message
            setTimeout(() => {
              mkEl.style.transition = 'opacity 0.15s ease, transform 0.25s cubic-bezier(0.17,0.67,0.35,1.4)';
              mkEl.style.opacity = '1';
              mkEl.style.transform = 'scale(1)';
            }, 80);
            setTimeout(() => {
              mkEl.style.transition = 'opacity 0.4s ease';
              mkEl.style.opacity = '0';
            }, 1400);
            setTimeout(() => {
              eatOverlay.classList.add('hidden');
              mkEl.style.opacity = '0';
              resolve();
            }, 1900);
          } else {
            setTimeout(() => {
              eatMsg.style.transition = 'opacity 0.4s';
              eatMsg.style.opacity = '1';
            }, 100);
            setTimeout(() => {
              eatOverlay.classList.add('hidden');
              eatMsg.style.opacity = '0';
              resolve();
            }, 2200);
          }
          return;
        }
        remaining = Math.max(0, remaining - (W / (bites + 1)) * (1 + bite * 0.15));
        clipRect.style.transition = 'width 0.14s ease-in';
        clipRect.setAttribute('width', String(remaining));
        svg.style.transition = 'transform 0.07s';
        svg.style.transform = 'translateX(-5px)';
        setTimeout(() => { svg.style.transform = 'translateX(0)'; }, 70);
        bite++;
        setTimeout(takeBite, 230);
      }
      takeBite();
    }, 1750);
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
  localStorage.setItem(`goal_seen_${authUserId}`, '1');
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

// ── Countdown + pace ──────────────────────────────────────────────────────
const GOAL = 100;
const SLEEP_START = 0;   // midnight
const SLEEP_END   = 8;   // 8 AM

function getNextSunday10AM() {
  const now = new Date();
  const d = new Date(now);
  const day = d.getDay(); // 0 = Sun
  let daysToAdd = day === 0 ? 0 : 7 - day;
  // If it's Sunday but already past 10:00, push to next Sunday
  if (day === 0 && (d.getHours() > 10 || (d.getHours() === 10 && d.getMinutes() > 0))) {
    daysToAdd = 7;
  }
  const deadline = new Date(d);
  deadline.setDate(d.getDate() + daysToAdd);
  deadline.setHours(10, 0, 0, 0);
  return deadline;
}

function getAwakeHoursRemaining(now, deadline) {
  // Walk from now to deadline, skipping 00:00–08:00 each night
  let awakeMs = 0;
  let cursor = new Date(now);

  while (cursor < deadline) {
    const h = cursor.getHours();

    if (h >= SLEEP_START && h < SLEEP_END) {
      // In sleep window — jump to 08:00 today
      const wake = new Date(cursor);
      wake.setHours(SLEEP_END, 0, 0, 0);
      cursor = wake < deadline ? wake : deadline;
      continue;
    }

    // Awake — advance to next midnight or deadline, whichever is sooner
    const nextMidnight = new Date(cursor);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);

    const boundary = nextMidnight < deadline ? nextMidnight : deadline;
    awakeMs += boundary - cursor;
    cursor = boundary;
  }

  return awakeMs / 3_600_000;
}

function formatCountdown(ms) {
  if (ms <= 0) return 'Now!';
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

let paceInterval = null;

function startPaceTicker() {
  if (paceInterval) return;
  updatePace();
  paceInterval = setInterval(updatePace, 30_000);
}

function updatePace() {
  const countdownEl = document.getElementById('countdown');
  const paceEl      = document.getElementById('pace-value');
  if (!countdownEl || !paceEl) return;

  const now      = new Date();
  const deadline = getNextSunday10AM();
  const msLeft   = deadline - now;

  countdownEl.textContent = formatCountdown(msLeft);

  const current = parseInt(progressCount.textContent, 10) || 0;
  const remaining = GOAL - current;

  if (remaining <= 0) {
    paceEl.textContent = 'Goal reached!';
    paceEl.classList.add('pace-done');
    return;
  }

  paceEl.classList.remove('pace-done');

  const awakeHours = getAwakeHoursRemaining(now, deadline);
  if (awakeHours <= 0) {
    paceEl.textContent = 'Too late 💀';
    return;
  }

  const rate = remaining / awakeHours;
  paceEl.textContent = `${rate.toFixed(1)} / hr`;
}

// ── Boot ───────────────────────────────────────────────────────────────────
(async function boot() {
  await loadUserList();

  if (authToken && authUser) {
    showApp();
  }
})();
