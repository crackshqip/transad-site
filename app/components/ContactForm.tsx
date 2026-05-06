"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Form = { name: string; email: string; company: string; project: string };
type Status = "idle" | "submitting" | "success" | "error";

const empty: Form = { name: "", email: "", company: "", project: "" };

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [form, setForm] = useState<Form>(empty);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update =
    (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website, locale }),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      // Translate server status into a user-facing message.
      setStatus("error");
      setErrorMsg(res.status === 400 ? t("errorValidation") : t("errorGeneric"));
    } catch {
      setStatus("error");
      setErrorMsg(t("errorGeneric"));
    }
  };

  if (status === "success") {
    return (
      <div className="confirm" role="status">
        <span className="ind" aria-hidden="true" />
        <span className="msg">{t("confirmation")}</span>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="row">
        <label className="field">
          <span className="field-label">{t("nameLabel")}</span>
          <input
            name="name"
            type="text"
            placeholder={t("namePlaceholder")}
            value={form.name}
            onChange={update("name")}
            required
            autoComplete="name"
            disabled={submitting}
          />
        </label>
        <label className="field">
          <span className="field-label">{t("emailLabel")}</span>
          <input
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={form.email}
            onChange={update("email")}
            required
            autoComplete="email"
            disabled={submitting}
          />
        </label>
      </div>
      <label className="field">
        <span className="field-label">{t("companyLabel")}</span>
        <input
          name="company"
          type="text"
          placeholder={t("companyPlaceholder")}
          value={form.company}
          onChange={update("company")}
          autoComplete="organization"
          disabled={submitting}
        />
      </label>
      <label className="field">
        <span className="field-label">{t("projectLabel")}</span>
        <textarea
          name="project"
          placeholder={t("projectPlaceholder")}
          rows={4}
          value={form.project}
          onChange={update("project")}
          required
          disabled={submitting}
        />
      </label>

      {/* Honeypot — must stay empty. Hidden from real users; bots tend to fill every field. */}
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {status === "error" && errorMsg && (
        <div className="form-error" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="form-actions">
        <p className="form-disclaimer">{t("disclaimer")}</p>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={submitting}
          aria-busy={submitting}
        >
          <span>{submitting ? t("submitting") : t("submit")}</span>
          {!submitting && (
            <span className="arrow" aria-hidden="true">→</span>
          )}
        </button>
      </div>
    </form>
  );
}
