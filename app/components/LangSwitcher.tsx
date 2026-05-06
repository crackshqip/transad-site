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

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label={t("languageLabel")}
    >
      {routing.locales.map((l, i) => {
        const isActive = l === current;
        const href = `/${l}${stripped}` || `/${l}`;
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
