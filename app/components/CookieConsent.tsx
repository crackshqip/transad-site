"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "transad-cookie-consent";
const VERSION = 1;

type Consent = {
  v: number;
  ts: string;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

type Mode = "hidden" | "banner" | "preferences";

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (parsed.v !== VERSION) return null;
    return parsed as Consent;
  } catch {
    return null;
  }
}

function writeConsent(analytics: boolean, marketing: boolean) {
  const consent: Consent = {
    v: VERSION,
    ts: new Date().toISOString(),
    necessary: true,
    analytics,
    marketing,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage unavailable (Safari private mode etc.) — silently no-op.
  }
}

export default function CookieConsent() {
  const t = useTranslations("cookies");
  const [mode, setMode] = useState<Mode>("hidden");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (!stored) {
      setMode("banner");
      return;
    }
    // Pre-fill toggles in case the user later opens preferences.
    setAnalytics(stored.analytics);
    setMarketing(stored.marketing);
  }, []);

  if (mode === "hidden") return null;

  const acceptAll = () => {
    writeConsent(true, true);
    setMode("hidden");
  };
  const rejectAll = () => {
    writeConsent(false, false);
    setMode("hidden");
  };
  const savePrefs = () => {
    writeConsent(analytics, marketing);
    setMode("hidden");
  };

  return (
    <aside
      className="cookie-consent"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
    >
      <div className="container">
        {mode === "banner" ? (
          <div className="cc-row">
            <div className="cc-text">
              <h2 id="cookie-consent-title" className="cc-title">
                {t("title")}
              </h2>
              <p className="cc-desc">{t("description")}</p>
            </div>
            <div className="cc-actions">
              <button type="button" className="btn btn-primary" onClick={acceptAll}>
                {t("acceptAll")}
              </button>
              <button type="button" className="btn btn-ghost" onClick={rejectAll}>
                {t("rejectAll")}
              </button>
              <button
                type="button"
                className="btn btn-text"
                onClick={() => setMode("preferences")}
              >
                {t("managePreferences")}
              </button>
            </div>
          </div>
        ) : (
          <div className="cc-prefs">
            <h2 id="cookie-consent-title" className="cc-title">
              {t("preferencesTitle")}
            </h2>
            <ul className="cc-categories">
              <li className="cc-cat">
                <div className="cc-cat-head">
                  <span className="cc-cat-name">
                    {t("categories.necessaryTitle")}
                  </span>
                  <span className="cc-cat-status">
                    {t("categories.necessaryStatus")}
                  </span>
                </div>
                <p>{t("categories.necessaryDescription")}</p>
              </li>
              <li className="cc-cat">
                <div className="cc-cat-head">
                  <span className="cc-cat-name">
                    {t("categories.analyticsTitle")}
                  </span>
                  <Toggle
                    checked={analytics}
                    onChange={setAnalytics}
                    ariaLabel={t("categories.analyticsTitle")}
                  />
                </div>
                <p>{t("categories.analyticsDescription")}</p>
              </li>
              <li className="cc-cat">
                <div className="cc-cat-head">
                  <span className="cc-cat-name">
                    {t("categories.marketingTitle")}
                  </span>
                  <Toggle
                    checked={marketing}
                    onChange={setMarketing}
                    ariaLabel={t("categories.marketingTitle")}
                  />
                </div>
                <p>{t("categories.marketingDescription")}</p>
              </li>
            </ul>
            <div className="cc-actions cc-actions-prefs">
              <button type="button" className="btn btn-ghost" onClick={() => setMode("banner")}>
                {t("cancel")}
              </button>
              <button type="button" className="btn btn-primary" onClick={savePrefs}>
                {t("save")}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={`cc-toggle${checked ? " cc-toggle-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="cc-toggle-thumb" aria-hidden="true" />
    </button>
  );
}
