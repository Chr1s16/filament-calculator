# Filament Power Cost Calculator (React + Vite + Tailwind)

A mobile-friendly calculator to estimate filament cost, energy usage, and total print cost. Packaged for Docker + Nginx.

## Quick Start (Docker)

```bash
# 1) Build the image (run this inside the project folder)
docker build -t filament-calculator .

# 2) Run the container on port 5151
docker run -d --name filament-calculator -p 5151:80 filament-calculator

# 3) Open in your browser
# http://YOUR_SERVER_IP:5151
```

### Stop / Start / Logs

```bash
docker stop filament-calculator
docker start filament-calculator
docker logs -f filament-calculator
```

### Remove

```bash
docker rm -f filament-calculator
docker rmi filament-calculator
```

## Local Development (optional)

You only need this if you want to edit the app on your machine (not required for Docker use).

Requirements: Node 18+

```bash
npm install
npm run dev
```

Then open the printed `http://localhost:5173` URL.

## What you can change

- **Currency symbol**: choose $, €, £, etc.
- **Filament price & weight**: price per spool and grams per spool.
- **Used weight**: grams used for the print.
- **Power (W) & Time (h)**: average printer power and print duration.
- **Electricity cost**: cost per kWh.

## FIX REBUILDING IF MODIFYING SRC CODE (APP.JSX)

docker compose build --no-cache
docker compose up -d
