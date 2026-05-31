const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

type AirtableConfig = {
  token: string;
  baseId: string;
  tableName: string;
};

function readConfig(): AirtableConfig {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME ?? "Waitlist";
  if (!token || !baseId) {
    throw new Error("Airtable env vars missing (AIRTABLE_TOKEN / AIRTABLE_BASE_ID)");
  }
  return { token, baseId, tableName };
}

function tableUrl(cfg: AirtableConfig): string {
  return `${AIRTABLE_API_BASE}/${cfg.baseId}/${encodeURIComponent(cfg.tableName)}`;
}

function authHeaders(cfg: AirtableConfig): HeadersInit {
  return {
    Authorization: `Bearer ${cfg.token}`,
    "Content-Type": "application/json",
  };
}

export type WaitlistRecord = {
  id: string;
  email: string;
  name: string | null;
};

export async function findByEmail(email: string): Promise<WaitlistRecord | null> {
  const cfg = readConfig();
  const safeEmail = email.replace(/"/g, "");
  const filter = `LOWER({Email})="${safeEmail}"`;
  const url = `${tableUrl(cfg)}?filterByFormula=${encodeURIComponent(filter)}&maxRecords=1`;
  const res = await fetch(url, { headers: authHeaders(cfg), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Airtable findByEmail failed: ${res.status}`);
  }
  const data = (await res.json()) as { records: Array<{ id: string; fields: Record<string, unknown> }> };
  const row = data.records[0];
  if (!row) return null;
  return {
    id: row.id,
    email: String(row.fields.Email ?? ""),
    name: (row.fields.Name as string | undefined) ?? null,
  };
}

export async function createEntry(input: {
  email: string;
  name?: string;
  source: string;
}): Promise<WaitlistRecord> {
  const cfg = readConfig();
  const body = {
    records: [
      {
        fields: {
          Email: input.email,
          ...(input.name ? { Name: input.name } : {}),
          Source: input.source,
        },
      },
    ],
  };
  const res = await fetch(tableUrl(cfg), {
    method: "POST",
    headers: authHeaders(cfg),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Airtable createEntry failed: ${res.status}`);
  }
  const data = (await res.json()) as { records: Array<{ id: string; fields: Record<string, unknown> }> };
  const row = data.records[0];
  if (!row) {
    throw new Error("Airtable createEntry returned no record");
  }
  return {
    id: row.id,
    email: String(row.fields.Email ?? ""),
    name: (row.fields.Name as string | undefined) ?? null,
  };
}

export async function updateName(recordId: string, name: string): Promise<void> {
  const cfg = readConfig();
  const url = `${tableUrl(cfg)}/${recordId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: authHeaders(cfg),
    body: JSON.stringify({ fields: { Name: name } }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Airtable updateName failed: ${res.status}`);
  }
}

// ── Free-tier downloads (capped) ────────────────────────────────────────────
// Saved to the Users table. Columns: name, email, phone, consent
// (consent is a single-select with options "yes" / "no"). The cap counts
// every row in this table.
function usersConfig(): AirtableConfig {
  const cfg = readConfig();
  // Falls back to the configured table (AIRTABLE_TABLE_NAME) when no dedicated
  // users table is set.
  return { ...cfg, tableName: process.env.AIRTABLE_USERS_TABLE ?? cfg.tableName };
}

/** How many free downloads have been claimed (every row in the Users table). */
export async function countDownloads(): Promise<number> {
  const cfg = usersConfig();
  const url = `${tableUrl(cfg)}?maxRecords=100`;
  const res = await fetch(url, { headers: authHeaders(cfg), cache: "no-store" });
  if (!res.ok) throw new Error(`Airtable countDownloads failed: ${res.status}`);
  const data = (await res.json()) as { records: unknown[] };
  return Array.isArray(data.records) ? data.records.length : 0;
}

/** True if this email already claimed a free download (don't double-count). */
export async function downloadExists(email: string): Promise<boolean> {
  const cfg = usersConfig();
  const safe = email.replace(/"/g, "");
  const filter = `LOWER({email})="${safe}"`;
  const url = `${tableUrl(cfg)}?filterByFormula=${encodeURIComponent(filter)}&maxRecords=1`;
  const res = await fetch(url, { headers: authHeaders(cfg), cache: "no-store" });
  if (!res.ok) throw new Error(`Airtable downloadExists failed: ${res.status}`);
  const data = (await res.json()) as { records: unknown[] };
  return Array.isArray(data.records) && data.records.length > 0;
}

export async function createDownload(input: {
  name: string;
  email: string;
  mobile?: string;
  consent: boolean;
}): Promise<void> {
  const cfg = usersConfig();
  const fields: Record<string, unknown> = {
    name: input.name,
    email: input.email,
    consent: input.consent ? "yes" : "no", // single-select option
  };
  if (input.mobile) fields.phone = input.mobile;
  const res = await fetch(tableUrl(cfg), {
    method: "POST",
    headers: authHeaders(cfg),
    body: JSON.stringify({ records: [{ fields }] }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Airtable createDownload failed: ${res.status}`);
}
