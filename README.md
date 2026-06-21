# Sausage Tracker

Dark Souls-flavored real-time sausage leaderboard for a group of friends.

## Setup

### 1. Configure users and password

Edit `seed.js` — replace the `USERS` array with your group's names.

Change the shared password by setting `SHARED_PASSWORD` in `docker-compose.yml`
(or in your environment). Default is `sausage123` — change it before deploying.

### 2. Build and run

```bash
# Build and start (Podman-compatible)
docker compose up -d --build

# Check it's running
docker compose logs -f
```

The app is now at **http://localhost:3000**.

### 3. Seed users

After the container is running, seed the initial user list from inside the container (no Node needed on the host):

```bash
podman exec -it makkara-sausage-tracker-1 node seed.js
```

Or with Docker:

```bash
docker exec -it makkara-sausage-tracker-1 node seed.js
```

### 4. Share with your group

Give everyone the URL and the shared password. They pick their name from the
dropdown and enter the password once — session persists in localStorage.

---

## Redeploy after code changes

```bash
git pull
podman compose up -d --build
# (or docker compose up -d --build)
```

The SQLite database lives in `./data/sausage.db` (mounted as a volume with `:Z`
for SELinux-safe Podman use). It survives restarts and rebuilds.

---

## Environment variables

| Variable          | Default        | Description                             |
|-------------------|----------------|-----------------------------------------|
| `PORT`            | `3000`         | Port the server listens on              |
| `SHARED_PASSWORD` | `sausage123`   | Password all users share                |
| `ADMIN_KEY`       | `letmein`      | Key for the `/api/seed` admin route     |

---

## File structure

```
makkara/
├── data/               # SQLite DB lives here (volume-mounted)
├── public/
│   ├── index.html      # Single-page app
│   ├── style.css
│   └── app.js          # Frontend logic (ranks + messages config at top)
├── server.js           # Express + Socket.io backend
├── seed.js             # One-time user seeding script
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Changing ranks or messages

Both config arrays live near the top of `public/app.js`:

- `RANKS` — Dark Souls rank thresholds and labels
- `FELLED_MESSAGES` — random boss-kill messages shown after each sausage log
