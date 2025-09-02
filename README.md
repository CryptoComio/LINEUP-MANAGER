# Fifa Lineup Manager

Simple full-stack app with a React + Vite client and an Express server written in TypeScript.

## Development

```bash
npm install
npm run dev
```

The command above starts both the API server (with `tsx` in watch mode) and the Vite dev server.

## Production

```bash
npm run build
npm start
```

`build` bundles the client into `dist/public` and compiles the server into `dist/index.js`. `start` runs the compiled server on `process.env.PORT || 8080` and serves the static client with a SPA fallback.

## Docker

```bash
docker build -t lineup-manager .
docker run -p 8080:8080 lineup-manager
```

## Deploy on Render

Create a new **Web Service** and set:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

Expose port `8080` (or the value of `PORT` if provided).

## Health Check

A health endpoint is available at `GET /healthz` which returns `200 OK` with body `ok`.
