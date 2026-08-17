import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const SETTINGS_FILE = process.env.SETTINGS_FILE || "/data/settings.json";
const PORT = Number(process.env.PORT || 80);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

async function readSettings() {
  try {
    return JSON.parse(await fs.readFile(SETTINGS_FILE, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

async function writeSettings(settings) {
  await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });

  const temporary = `${SETTINGS_FILE}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(settings, null, 2), "utf8");
  await fs.rename(temporary, SETTINGS_FILE);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (url.pathname === "/api/settings" && req.method === "GET") {
      return json(res, 200, await readSettings());
    }

    if (url.pathname === "/api/settings" && req.method === "PUT") {
      let body = "";

      for await (const chunk of req) {
        body += chunk;

        if (body.length > 100000) {
          return json(res, 413, { error: "Settings payload too large" });
        }
      }

      const settings = JSON.parse(body || "{}");

      if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
        return json(res, 400, { error: "Invalid settings" });
      }

      await writeSettings(settings);
      return json(res, 200, { ok: true });
    }

    if (!["GET", "HEAD"].includes(req.method)) {
      return json(res, 405, { error: "Method not allowed" });
    }

    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/") pathname = "/index.html";

    let file = path.join(DIST, pathname);

    try {
      const stat = await fs.stat(file);
      if (stat.isDirectory()) file = path.join(file, "index.html");
    } catch {
      file = path.join(DIST, "index.html");
    }

    const data = await fs.readFile(file);
    const type = types[path.extname(file).toLowerCase()] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": type });
    if (req.method === "HEAD") return res.end();
    res.end(data);
  } catch (error) {
    console.error(error);
    json(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Filament Calculator listening on port ${PORT}`);
  console.log(`Settings file: ${SETTINGS_FILE}`);
});
