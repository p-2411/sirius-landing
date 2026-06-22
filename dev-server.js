// Local dev server: serves the static app/ AND runs the /api/contact function,
// so the "Get in touch" form works locally (Live Preview can't execute /api).
// Run:  node dev-server.js   then open the printed URL.
const http = require("http");
const fs = require("fs");
const path = require("path");

try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch {
  console.warn("No .env loaded — RESEND_API_KEY may be missing.");
}

const handler = require("./api/contact.js");
const APP_DIR = path.join(__dirname, "app");
const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
};

const server = http.createServer((req, res) => {
  const pathname = req.url.split("?")[0];

  if (pathname === "/api/contact") {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      req.body = raw;
      const shim = {
        status(code) {
          res.statusCode = code;
          return this;
        },
        json(obj) {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(obj));
        },
      };
      Promise.resolve(handler(req, shim)).catch((err) => {
        console.error(err);
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, error: "server" }));
      });
    });
    return;
  }

  const rel = pathname === "/" ? "/index.html" : pathname;
  const file = path.join(APP_DIR, rel);
  fs.readFile(file, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
    res.end(data);
  });
});

const PORT = process.env.PORT || 4321;
server.listen(PORT, () => {
  console.log(`Local dev (static + /api) → http://localhost:${PORT}`);
});
