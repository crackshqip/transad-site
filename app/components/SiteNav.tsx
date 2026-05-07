import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import LangSwitcher from "./LangSwitcher";
import MobileMenu from "./MobileMenu";

export default function SiteNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const home = `/${locale}`;

  // Anchors point at the homepage so they work from any sub-page;
  // the dedicated pages link via next/link for client-side routing.
  const links: Array<{ href: string; label: string; type: "anchor" | "page" }> = [
    { href: `${home}/work`,     label: t("work"),     type: "page"   },
    { href: `${home}/studio`,   label: t("studio"),   type: "page"   },
    { href: `${home}/services`, label: t("services"), type: "page"   },
    { href: `${home}/pricing`,  label: t("pricing"),  type: "page"   },
    { href: `${home}#contact`,  label: t("contact"),  type: "anchor" },
  ];

  return (
    <nav className="site-nav" aria-label="Primary">
      <Link className="brand" href={home} aria-label={t("homeLabel")}>
        {/* SVG wordmark — explicit width prevents CLS before the asset loads.
            344:55 native aspect ⇒ 125×20 at the desired height. next/image
            adds no value for inline SVGs (no rasterization to optimize). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/transad-wordmark.svg" alt="Transad" width={125} height={20} />
      </Link>
      <ul className="nav-links">
        {links.map((l) =>
          l.type === "page" ? (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ) : (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ),
        )}
      </ul>
      <div className="nav-right">
        <LangSwitcher />
        <span className="loc-meta">{t("locations")}</span>
        <MobileMenu
          links={links}
          labels={{
            open: t("menuOpen"),
            close: t("menuClose"),
            menu: t("menuLabel"),
          }}
        />
        <a className="btn btn-dark btn-sm" href={`${home}#contact`}>
          <span>{t("cta")}</span>
          <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </nav>
  );
}
