# Soft Start

A personal daily-planning PWA for one user. See [`CLAUDE.md`](CLAUDE.md) for the
working rules and stack, and [`docs/soft-start-prd.md`](docs/soft-start-prd.md)
for the full product spec — it's the source of truth for all feature work.

## Run it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. The dev server also listens on your local
network, so it's reachable from an iPhone on the same Wi-Fi at
`http://<this-machine's-LAN-IP>:5173`.

## Stack

Vite + React + TypeScript, plain CSS custom properties for the Soft Focus
design tokens (`src/styles/tokens.css`). Local-first: no backend, no accounts.
