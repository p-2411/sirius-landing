import fs from "node:fs";
import path from "node:path";

export type StartupAnalystDemoFile = {
  id: string;
  path: string;
  name: string;
  group: "report" | "data" | "companies" | "founders";
  kind: "markdown" | "csv";
  content: string;
};

const GROUP_ORDER: StartupAnalystDemoFile["group"][] = ["report", "data", "companies", "founders"];

function titleFromMarkdown(content: string, fallback: string) {
  const firstHeading = content
    .split("\n")
    .find((line) => line.trim().startsWith("# "))
    ?.replace(/^#\s+/, "")
    .trim();

  return firstHeading || fallback;
}

function titleFromFile(filePath: string, content: string) {
  const base = path.basename(filePath);
  if (base.endsWith(".md")) {
    return titleFromMarkdown(content, base.replace(/\.md$/, ""));
  }

  return base;
}

function groupFromPath(relativePath: string): StartupAnalystDemoFile["group"] {
  if (relativePath.startsWith("reports/")) return "report";
  if (relativePath.startsWith("data/")) return "data";
  if (relativePath.startsWith("companies/")) return "companies";
  return "founders";
}

function collectFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(fullPath);
    if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".csv"))) return [fullPath];
    return [];
  });
}

export function getStartupAnalystDemoFiles(): StartupAnalystDemoFile[] {
  const root = path.join(process.cwd(), "Demo-Files");
  const files = collectFiles(root);

  return files
    .map((filePath) => {
      const relativePath = path.relative(root, filePath).replaceAll(path.sep, "/");
      const content = fs.readFileSync(filePath, "utf8");
      const kind = filePath.endsWith(".csv") ? "csv" : "markdown";

      return {
        id: relativePath,
        path: relativePath,
        name: titleFromFile(filePath, content),
        group: groupFromPath(relativePath),
        kind,
        content,
      } satisfies StartupAnalystDemoFile;
    })
    .sort((a, b) => {
      const groupDelta = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
      if (groupDelta !== 0) return groupDelta;
      return a.name.localeCompare(b.name);
    });
}
