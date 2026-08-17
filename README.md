# 3D Print Cost Calculator

A small, fast React + Vite + Tailwind calculator for estimating the real cost of a 3D print.

The goal is intentionally simple: enter a few numbers and get the result instantly. No backend, account, database, or unnecessary configuration.

## What it calculates

- **Filament** — spool price, spool weight and grams used.
- **Electricity** — average printer power, print time and electricity price.
- **Printer wear** — printer purchase price and estimated lifetime in hours.
- **Labour** — hourly labour rate and actual hands-on time.

The total updates immediately in the browser whenever an input changes.

### Printer wear

Printer wear is calculated as:

```text
printer price / expected lifetime in hours = printer wear per hour
printer wear per hour × print time = printer wear for the job
```

Example:

```text
3000 RON / 5000 h = 0.60 RON/h
0.60 RON/h × 5 h = 3.00 RON printer wear
```

## Docker

The published image is:

```text
ghcr.io/chr1s16/filament-calculator:latest
```

### Docker Compose

```bash
docker compose up -d
```

The app is available on port `5151`:

```text
http://localhost:5151
```

### Docker Run

```bash
docker run -d \
  --name filament-calculator \
  --restart unless-stopped \
  -p 5151:80 \
  ghcr.io/chr1s16/filament-calculator:latest
```

## Local development

Requirements: Node 18+

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Design principles

- Instant calculation.
- Minimal number of inputs.
- No backend.
- No network requests for calculations.
- Mobile-friendly.
- Keep the original calculator simple instead of turning it into a full print-management system.
