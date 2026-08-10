# 3D Print Cost Calculator (v1.1)

React + Vite + Tailwind calculator for estimating the cost of a 3D print job.


A mobile-friendly calculator to estimate the cost of a 3D print job from filament, electricity, printer usage, and labour. Packaged for Docker + Nginx. Docker Compose is included for simple deployment and Dockhand use.

## Cost calculation

The calculator breaks a print into four costs:

- **Filament**: spool price and weight determine the cost per gram.
- **Electricity**: average printer power, print time, and electricity price determine energy cost.
- **Printer usage**: an editable hourly printer usage fee multiplied by print time.
- **Labour**: an editable hourly labour rate multiplied by the labour time entered for the job.

The printer usage fee and labour rate are simple defaults that can be changed directly in the calculator for each job.

## Quick Start (Docker)

```bash
# 1) Build the image
docker compose build

# 2) Start the container
docker compose up -d

# 3) Open in your browser
# http://YOUR_SERVER_IP:5151
```

### Docker Compose

```bash
docker compose up -d --build
```

Then open the port configured by `compose.yaml`.

### Stop / Start / Logs

```bash
docker compose down
docker compose start
docker compose logs -f
```

## Local Development (optional)

Requirements: Node 18+

```bash
npm install
npm run dev
```

Then open the printed `http://localhost:5173` URL.

## Inputs

- **Currency symbol**: $, €, £, RON, etc.
- **Filament price & weight**: price per spool and grams per spool.
- **Used weight**: grams used for the print.
- **Power & print time**: average printer power and print duration.
- **Electricity cost**: cost per kWh.
- **Printer usage fee**: hourly charge for using the printer.
- **Labour rate & labour time**: separate hourly labour charge and time spent on the job.

## Rebuilding after source changes

```bash
docker compose build --no-cache
docker compose up -d
```
