# FifaLineupManager — Avvio & Deploy

## Sviluppo
```bash
npm install
npm run dev
```

## Produzione
```bash
npm run build
npm start
```

- Il server legge `PORT` (default 5000) e risponde a `GET /healthz` con `200`.
- In produzione serve la build Vite da `dist/public` e fa SPA fallback su `index.html` per rotte non-API.

## Docker
```bash
docker build -t fifalineup:latest .
docker run -p 5000:5000 -e PORT=5000 fifalineup:latest
curl -fsSL http://localhost:5000/healthz
```

## CI (GitHub Actions)
Il workflow `.github/workflows/ci.yml` esegue install, check e build su ogni push/PR (Node 20).
