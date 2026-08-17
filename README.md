# 3D Print Cost Calculator

A small, fast React + Vite + Tailwind calculator for estimating the real cost of a 3D print.

The goal stays intentionally simple: enter a few numbers and get the result instantly. No account, database, or unnecessary configuration.

## What it calculates

- **Filament** — spool price, spool weight and grams used.
- **Electricity** — average printer power, print time and electricity price.
- **Printer wear** — printer purchase price and estimated lifetime in hours.
- **Labour** — hourly labour rate and actual hands-on time.

## Languages & currency

The interface starts in **English** with **USD**. Romanian and other major international languages are available from the language selector. Changing language automatically switches to that language's default representative currency and converts the monetary settings using ECB reference rates.

The currency can also be changed independently from the currency dropdown.

Exchange rates are fetched from the ECB when available and cached locally. A bundled fallback keeps the calculator working when the rate service is unavailable.

## Saved settings

Calculator settings, selected language and currency are saved in the browser's `localStorage`. This means they survive browser refreshes, new sessions and Docker container updates without requiring a backend or database.

This is deliberately client-side: a Docker volume would not be useful for per-user settings and would add unnecessary complexity.

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
- No account or backend required.
- Settings persist locally.
- International language and currency support without turning the calculator into an overcomplicated app.
