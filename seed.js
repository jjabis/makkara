'use strict';

// Usage: node seed.js
// Edit USERS below, then run once after first boot.

const USERS = [
  'Jimi',
  'Aleksi',
  'Kirsi',
  'Kaapo',
  'Santeri',
  'Riku',
  'Toni',
  'Karri',
  'Roni',
  'Mika',
  'Mirka',
  'Miikka',
  'Ville',
];

const ADMIN_KEY = process.env.ADMIN_KEY || 'letmein';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

(async () => {
  const res = await fetch(`${BASE_URL}/api/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ users: USERS, adminKey: ADMIN_KEY }),
  });
  const data = await res.json();
  console.log('Seeded:', data);
})();
