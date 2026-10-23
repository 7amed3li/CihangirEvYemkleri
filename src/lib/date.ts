/**
 * Europe/Istanbul business date helpers.
 * Canonical restaurant dates must strictly align with Turkey local time.
 */

export const RESTAURANT_TIMEZONE = "Europe/Istanbul";

/**
 * Returns the current date in Europe/Istanbul formatted as YYYY-MM-DD.
 */
export function getIstanbulDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: RESTAURANT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Returns formatted readable date for UI in Istanbul timezone (e.g. "22 Ekim 2026, Perşembe")
 */
export function formatIstanbulReadable(dateString: string, locale: string = "tr"): string {
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    // Create UTC date representing the local date
    const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
      timeZone: RESTAURANT_TIMEZONE,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}
