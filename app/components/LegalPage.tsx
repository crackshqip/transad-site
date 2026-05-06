import Eyebrow from "@/app/components/Eyebrow";
import SiteNav from "@/app/components/SiteNav";
import Footer from "@/app/components/Footer";
import { getTranslations } from "next-intl/server";

type LegalNamespace = "imprint" | "privacy" | "terms";

type Section = {
  title: string;
  paragraphs?: string[];
  list?: string[];
};

/**
 * Shared layout for /imprint, /privacy, /terms.
 * Driven entirely from the matching message namespace — sections render in order,
 * with optional bullet lists.
 */
export default async function LegalPage({ namespace }: { namespace: LegalNamespace }) {
  const t = await getTranslations(namespace);
  const sections = t.raw("sections") as Section[];

  return (
    <>
      <SiteNav />
      <main>
        <section className="page-intro container">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="display">{t("headline")}</h1>
          <p className="lead">{t("lead")}</p>
          <p className="legal-meta">{t("lastUpdated")}</p>
        </section>

        <div className="container">
          <div className="legal">
          {sections.map((section, i) => (
            <section className="legal-section" key={i}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
