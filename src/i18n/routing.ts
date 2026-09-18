import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"], // expand when multilang is needed
  defaultLocale: "id",
  localePrefix: "never",
});

export type Locale = (typeof routing.locales)[number];
