// Captures landing-page "Get in touch" emails into Airtable.
// Zero-dependency Vercel Serverless Function (uses global fetch, Node 18+).
//
// Resilience:
//  - If Airtable is unavailable (rate limit, outage, missing env), it falls back
//    to emailing a notification via Resend so no signup is ever lost.
//  - Handles no-JS native form posts (urlencoded) and returns an HTML thank-you
//    page; the JS path posts JSON and gets JSON back.

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_ELAPSED_MS = 800;

// Where the fallback notification goes, and who it's from.
const NOTIFY_TO = process.env.CONTACT_NOTIFY_TO || "parhamsepas@gmail.com";
// Must be a Resend-verified sender. onboarding@resend.dev works for testing
// (it can only deliver to your own Resend account email).
const NOTIFY_FROM = process.env.RESEND_FROM || "Sirus signups <onboarding@resend.dev>";

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

async function captureToAirtable(email) {
  const cfg = {
    token: process.env.AIRTABLE_TOKEN,
    baseId: process.env.AIRTABLE_BASE_ID,
    tableName: process.env.AIRTABLE_TABLE_NAME || "Waitlist",
  };
  if (!cfg.token || !cfg.baseId) throw new Error("Airtable env vars missing");
  const existing = await findByEmail(cfg, email);
  if (!existing) await createEntry(cfg, email);
}

// Fallback so a signup is never lost when Airtable can't be reached.
async function notifyByEmail(email) {
  const key = process.env.RESEND_API_KEY || process.env.RESEND_API;
  if (!key) throw new Error("RESEND_API_KEY missing");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      reply_to: email,
      subject: `New Sirus signup: ${email}`,
      text:
        `Someone signed up on the Sirus landing page.\n\n` +
        `Email: ${email}\n\n` +
        `(Sent as a fallback because the Airtable capture was unavailable — ` +
        `you may want to add them to the waitlist manually.)`,
    }),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status}`);
}

function parseBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    const ct = req.headers["content-type"] || "";
    if (ct.indexOf("application/x-www-form-urlencoded") !== -1) {
      body = Object.fromEntries(new URLSearchParams(body));
    } else {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
  }
  return body || {};
}

// The JS path posts JSON; a no-JS native form post is urlencoded → wants HTML.
function wantsHtml(req) {
  return (req.headers["content-type"] || "").indexOf("application/json") === -1;
}

function htmlPage(ok, email) {
  const msg = ok
    ? `Thanks — a real person will reply to ${email} within one business day.`
    : `Something went wrong saving your details. Please email us at ${NOTIFY_TO}.`;
  return (
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<title>Sirus</title><style>body{margin:0;min-height:100vh;display:flex;` +
    `align-items:center;justify-content:center;background:#000;color:#fff;` +
    `font-family:system-ui,sans-serif;line-height:1.7;padding:32px}` +
    `main{max-width:30rem}a{color:#fff}p{font-size:15px}</style></head>` +
    `<body><main><p>${msg}</p>` +
    `<p style="margin-top:24px"><a href="/">&larr; Back to Sirus</a></p>` +
    `</main></body></html>`
  );
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method" });
    return;
  }

  const html = wantsHtml(req);
  const body = parseBody(req);
  const { email, company, elapsedMs } = body;

  const respond = (status, ok) => {
    if (html) {
      res.status(status).setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(htmlPage(ok, typeof email === "string" ? email.trim() : ""));
    } else {
      res.status(status).json({ ok });
    }
  };

  // Honeypot + submit-too-fast: silently accept so bots get no signal.
  if (typeof company === "string" && company.length > 0) {
    respond(200, true);
    return;
  }
  const elapsed = typeof elapsedMs === "string" ? Number(elapsedMs) : elapsedMs;
  if (typeof elapsed === "number" && !Number.isNaN(elapsed) && elapsed < MIN_ELAPSED_MS) {
    respond(200, true);
    return;
  }

  if (typeof email !== "string") {
    respond(400, false);
    return;
  }
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalized)) {
    respond(400, false);
    return;
  }

  let ok = false;
  try {
    await captureToAirtable(normalized);
    ok = true;
  } catch (err) {
    console.error("[contact] Airtable capture failed, trying email fallback", err);
    try {
      await notifyByEmail(normalized);
      ok = true; // lead preserved via email
    } catch (mailErr) {
      console.error("[contact] email fallback also failed", mailErr);
    }
  }
  respond(ok ? 200 : 502, ok);
};
