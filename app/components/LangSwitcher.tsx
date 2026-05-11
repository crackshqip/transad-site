"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

export default function LangSwitcher() {
  const current = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname() || `/${current}`;

  // Strip the leading "/<currentLocale>" so we can re-prefix with the target.
  const stripped = pathname.replace(new RegExp(`^/(${routing.locales.join("|")})`), "");

  // Routes that only exist in one locale — toggling away from them
  // would 404, so we send the user to that locale's homepage instead.
  // Keyed by the locale where the route lives.
  const LOCALE_ONLY_ROUTES: Record<string, string[]> = {
    de: ["/germany"],
  };

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label={t("languageLabel")}
    >
      {routing.locales.map((l, i) => {
        const isActive = l === current;
        const ownedByOther = Object.entries(LOCALE_ONLY_ROUTES).some(
          ([owner, paths]) =>
            owner !== l && paths.some((p) => stripped === p || stripped.startsWith(`${p}/`)),
        );
        const href = ownedByOther ? `/${l}` : `/${l}${stripped}` || `/${l}`;
        return (
          <Fragment key={l}>
            {i > 0 && <span className="sep" aria-hidden="true">/</span>}
            <a
              href={href}
              className={isActive ? "active" : undefined}
              aria-current={isActive ? "page" : undefined}
              hrefLang={l}
            >
              {l.toUpperCase()}
            </a>
          </Fragment>
        );
      })}
    </div>
  );
}
