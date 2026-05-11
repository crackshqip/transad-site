import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const home = `/${locale}`;

  return (
    <footer className="site-footer">
      <div className="ft-grid">
        <div className="ft-brand">
          <Image
            className="ft-mark"
            src="/transad-wordmark.svg"
            alt="Transad"
            width={172}
            height={28}
            priority={false}
          />
          <div className="ft-meta">{t("rights")}</div>
        </div>
        <div className="ft-col">
          <h3>{t("studioHeading")}</h3>
          <Link href={`${home}/work`}>{t("studioWork")}</Link>
          <Link href={`${home}/studio`}>{t("studioStudio")}</Link>
          <Link href={`${home}/services`}>{t("studioServices")}</Link>
          <Link href={`${home}/pricing`}>{t("studioPricing")}</Link>
          {locale === "de" && (
            <Link href={`${home}/germany`}>{t("germanyLink")} →</Link>
          )}
        </div>
        <div className="ft-col">
          <h3>{t("contactHeading")}</h3>
          <a href="mailto:marketing@transadgroup.com">marketing@transadgroup.com</a>
          <a href="mailto:info@transadgroup.com">info@transadgroup.com</a>
          <a href="tel:+38348558822">+383 485 588 22</a>
        </div>
        <div className="ft-col">
          <h3>{t("studiosHeading")}</h3>
          {(t.raw("studiosList") as string[]).map((city) => (
            <span key={city}>{city}</span>
          ))}
        </div>
        <div className="ft-col">
          <h3>{t("legalHeading")}</h3>
          <Link href={`${home}/imprint`}>{t("legalImprint")}</Link>
          <Link href={`${home}/privacy`}>{t("legalPrivacy")}</Link>
          <Link href={`${home}/terms`}>{t("legalTerms")}</Link>
        </div>
      </div>
    </footer>
  );
}
