// Handles landing-page "Get in touch" / waitlist signups.
// Primary action: email a notification via Resend to the team inbox.
// Best-effort: also store the address in Airtable (non-blocking).
// Zero-dependency Vercel Serverless Function (uses global fetch, Node 18+).

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_ELAPSED_MS = 800;

const RESEND_FROM = process.env.RESEND_FROM || "Sirius <sirius@trysirius.me>";
const NOTIFY_TO = process.env.CONTACT_NOTIFY_TO || "parhamsepas@gmail.com";

async function sendNotification(email) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY missing");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [NOTIFY_TO],
      reply_to: email,
      subject: `New waitlist signup: ${email}`,
      text: `${email} signed up to the waitlist.`,
      html: `<p><strong>${email}</strong> signed up to the waitlist.</p>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend send failed: ${res.status} ${detail}`);
  }
}

// Best-effort Airtable capture — never blocks the response.
async function storeInAirtable(email) {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Waitlist";
  if (!token || !baseId) return;

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
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

  // Store in Airtable, but don't fail the signup if it errors (e.g. quota).
  try {
    await storeInAirtable(normalized);
  } catch (error) {
    console.error("[contact] Airtable store failed (non-blocking)", error);
  }

  // The notification email is the required outcome.
  try {
    await sendNotification(normalized);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[contact] notification failed", error);
    res.status(502).json({ ok: false, error: "server" });
  }
};
