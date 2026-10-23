import tr from "./locales/tr.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import fa from "./locales/fa.json";
import fr from "./locales/fr.json";
import ru from "./locales/ru.json";
import de from "./locales/de.json";
import it from "./locales/it.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";

export const SUPPORTED_LOCALES = [
  "tr",
  "en",
  "ar",
  "ru",
  "fa",
  "fr",
  "de",
  "it",
  "es",
  "zh",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

export const translations: Record<Locale, Record<string, any>> = {
  tr,
  en,
  ar,
  fa,
  fr,
  ru,
  de,
  it,
  es,
  zh,
};

export function getDictionary(locale: string): Record<string, any> {
  const target = SUPPORTED_LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;

  const current = translations[target] || translations[DEFAULT_LOCALE];
  const fallback = translations.en || translations[DEFAULT_LOCALE];

  // Return a proxy to safely fallback to English for any missing key
  return new Proxy(current, {
    get(targetObj, prop: string) {
      if (prop in targetObj) {
        return targetObj[prop];
      }
      return fallback?.[prop] ?? prop;
    },
  });
}
