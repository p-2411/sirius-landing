// Captures landing-page "Get in touch" emails into Airtable.
// Zero-dependency Vercel Serverless Function (uses global fetch, Node 18+).
// Mirrors the archived waitlist logic in archive/lib/airtable.ts.

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_ELAPSED_MS = 800;

function tableUrl(cfg) {
  return `${AIRTABLE_API_BASE}/${cfg.baseId}/${encodeURIComponent(cfg.tableName)}`;
}

async function findByEmail(cfg, email) {
  const safe = email.replace(/"/g, "");
  const filter = `LOWER({Email})="${safe}"`;
  const url = `${tableUrl(cfg)}?filterByFormula=${encodeURIComponent(filter)}&maxRecords=1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${cfg.token}` },
  });
  if (!res.ok) throw new Error(`Airtable findByEmail failed: ${res.status}`);
  const data = await res.json();
  return data.records && data.records[0] ? data.records[0] : null;
}

async function createEntry(cfg, email) {
  const res = await fetch(tableUrl(cfg), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [{ fields: { Email: email, Source: "landing" } }],
    }),
  });
  if (!res.ok) throw new Error(`Airtable createEntry failed: ${res.status}`);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};
  const { email, company, elapsedMs } = body;

  // Honeypot + submit-too-fast: silently accept so bots get no signal.
  if (typeof company === "string" && company.length > 0) {
    res.status(200).json({ ok: true });
    return;
  }
  if (typeof elapsedMs === "number" && elapsedMs < MIN_ELAPSED_MS) {
    res.status(200).json({ ok: true });
    return;
  }

  if (typeof email !== "string") {
    res.status(400).json({ ok: false, error: "invalid" });
    return;
  }
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalized)) {
    res.status(400).json({ ok: false, error: "invalid" });
    return;
  }

  const cfg = {
    token: process.env.AIRTABLE_TOKEN,
    baseId: process.env.AIRTABLE_BASE_ID,
    tableName: process.env.AIRTABLE_TABLE_NAME || "Waitlist",
  };
  if (!cfg.token || !cfg.baseId) {
    console.error("[contact] Airtable env vars missing");
    res.status(502).json({ ok: false, error: "server" });
    return;
  }

  try {
    const existing = await findByEmail(cfg, normalized);
    if (!existing) await createEntry(cfg, normalized);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[contact] submission failed", error);
    res.status(502).json({ ok: false, error: "server" });
  }
};
