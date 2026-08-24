/**
 * Reads the table number from the current URL, e.g. https://cafe.app/?table=07
 * Falls back to "01" when the QR / link doesn't carry a table param
 * (useful for local testing).
 */
export function getTableFromUrl(): string {
  if (typeof window === "undefined") return "01";
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("table") ?? params.get("meja");
  if (!raw) return "01";
  const cleaned = raw.trim();
  return cleaned || "01";
}

/** Builds the guest ordering URL for a given table number. */
export function buildTableUrl(table: string): string {
  if (typeof window === "undefined") return `?table=${table}`;
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("table", table);
  return url.toString();
}

/** Zero-pads a table number for display, e.g. 4 -> "04". */
export function padTable(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}
