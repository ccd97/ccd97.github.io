const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(isodate: string): string {
  return dateFormatter.format(new Date(isodate));
}

const LANGUAGE_CLASSES: Record<string, string> = {
  "c++": "lang-cpp",
  c: "lang-c",
  python: "lang-python",
  django: "lang-django",
  java: "lang-java",
  android: "lang-android",
  javascript: "lang-javascript",
};

export function languageClass(language: string): string {
  return LANGUAGE_CLASSES[language.toLowerCase()] ?? "lang-misc";
}
