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

The published Docker image is available from GitHub Container Registry (GHCR).

```bash
docker compose up -d
```

The included `compose.yaml` pulls the latest published image:

`ghcr.io/chr1s16/filament-calculator:latest`

Then open:

`http://YOUR_SERVER_IP:5151`

### Updating

The GitHub repository is the source of truth. Every push to `main` builds and publishes a new Docker image.

To update an existing deployment:

```bash
docker compose pull
docker compose up -d
```

The same Compose file can be copied to another Docker host and deployed without cloning this repository.

## GitHub Actions

Every push to `main` builds the existing `Dockerfile` and publishes the image to GHCR as:

- `ghcr.io/chr1s16/filament-calculator:latest`
- `ghcr.io/chr1s16/filament-calculator:1.1.0` for the current release

The first published GHCR package may need to be changed to **Public** in the repository's GitHub Packages settings so Docker hosts can pull it without authentication.

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
