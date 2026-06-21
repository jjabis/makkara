'use strict';

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// ─── Config ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const SHARED_PASSWORD = process.env.SHARED_PASSWORD || 'sausage123';
const GOAL = 100;

// ─── DB setup ─────────────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'sausage.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    token TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    logged_by_user_id INTEGER NOT NULL,
    ts INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getLeaderboard() {
  const rows = db.prepare(`
    SELECT u.id, u.username, COUNT(l.id) AS total
    FROM users u
    LEFT JOIN logs l ON l.user_id = u.id
    GROUP BY u.id
    ORDER BY total DESC, u.username ASC
  `).all();
  return rows;
}

function getGroupTotal() {
  return db.prepare('SELECT COUNT(*) AS total FROM logs').get().total;
}

function getMeta(key) {
  const row = db.prepare('SELECT value FROM meta WHERE key = ?').get(key);
  return row ? row.value : null;
}

function setMeta(key, value) {
  db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run(key, String(value));
}

function buildState() {
  const leaderboard = getLeaderboard();
  const groupTotal = getGroupTotal();
  const goalReachedAt = getMeta('goal_reached_at');
  return { leaderboard, groupTotal, goal: GOAL, goalReachedAt };
}

function checkGoal(prevTotal, newTotal) {
  if (prevTotal < GOAL && newTotal >= GOAL) {
    setMeta('goal_reached_at', Date.now());
  }
}

function requireAuth(req, res, next) {
  const token = req.headers['x-auth-token'];
  if (!token) return res.status(401).json({ error: 'No token' });
  const user = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });
  req.user = user;
  next();
}

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth: login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (password !== SHARED_PASSWORD) return res.status(401).json({ error: 'Wrong password' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return res.status(404).json({ error: 'Unknown username' });

  // Generate or reuse token
  let token = user.token;
  if (!token) {
    token = crypto.randomBytes(32).toString('hex');
    db.prepare('UPDATE users SET token = ? WHERE id = ?').run(token, user.id);
  }

  res.json({ token, username: user.username, userId: user.id });
});

// Get state
app.get('/api/state', requireAuth, (req, res) => {
  const state = buildState();
  const goalReachedAt = getMeta('goal_reached_at');
  const seenKey = `goal_seen_${req.user.id}`;
  const hasSeen = getMeta(seenKey);
  state.showCelebration = goalReachedAt && !hasSeen;
  res.json(state);
});

// Mark celebration seen
app.post('/api/celebrate/seen', requireAuth, (req, res) => {
  setMeta(`goal_seen_${req.user.id}`, '1');
  res.json({ ok: true });
});

// Log a sausage
app.post('/api/log', requireAuth, (req, res) => {
  const { targetUserId } = req.body;
  const loggedBy = req.user.id;
  const forUser = targetUserId ? Number(targetUserId) : loggedBy;

  const targetUser = db.prepare('SELECT * FROM users WHERE id = ?').get(forUser);
  if (!targetUser) return res.status(404).json({ error: 'Target user not found' });

  const prevTotal = getGroupTotal();
  db.prepare('INSERT INTO logs (user_id, logged_by_user_id) VALUES (?, ?)').run(forUser, loggedBy);
  const newTotal = getGroupTotal();
  checkGoal(prevTotal, newTotal);

  const state = buildState();
  io.emit('state_update', { ...state, lastLoggedUserId: forUser });

  res.json({ ok: true, lastLoggedUserId: forUser });
});

// List users (for "log for a mate" modal)
app.get('/api/users', requireAuth, (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.username, COUNT(l.id) AS total
    FROM users u
    LEFT JOIN logs l ON l.user_id = u.id
    GROUP BY u.id
    ORDER BY total DESC, u.username ASC
  `).all();
  res.json(users);
});

// Public: get just the usernames (no auth) — for login dropdown
app.get('/api/usernames', (req, res) => {
  const names = db.prepare('SELECT username FROM users ORDER BY username ASC').all().map(r => r.username);
  res.json(names);
});

// Admin: seed users (only works if DB is empty or user doesn't exist yet)
app.post('/api/seed', (req, res) => {
  const { users, adminKey } = req.body;
  if (adminKey !== (process.env.ADMIN_KEY || 'letmein')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const insert = db.prepare('INSERT OR IGNORE INTO users (username) VALUES (?)');
  const results = [];
  for (const u of users) {
    const info = insert.run(u);
    results.push({ username: u, inserted: info.changes > 0 });
  }
  res.json(results);
});

io.on('connection', (socket) => {
  // Send current state on connect
  socket.emit('state_update', buildState());
});

server.listen(PORT, () => {
  console.log(`Sausage Tracker running on http://localhost:${PORT}`);
});
