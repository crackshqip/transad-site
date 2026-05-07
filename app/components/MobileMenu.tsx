"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LangSwitcher from "./LangSwitcher";

type LinkSpec = { href: string; label: string; type: "anchor" | "page" };

type Props = {
  links: LinkSpec[];
  cta: { href: string; label: string };
  labels: {
    open: string;
    close: string;
    menu: string;
  };
};

export default function MobileMenu({ links, cta, labels }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  const overlay = (
    <div
      id="mobile-menu"
      className={`mobile-menu${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={labels.menu}
      aria-hidden={!open}
    >
      <div className="mobile-menu-bar">
        <span className="mobile-menu-eyebrow">{labels.menu}</span>
        <button
          ref={closeRef}
          type="button"
          className="nav-close"
          aria-label={labels.close}
          onClick={() => setOpen(false)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 3 L19 19 M19 3 L3 19"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>

      <hr className="mobile-menu-divider" />

      <div className="mobile-menu-body">
        <nav className="mobile-menu-links" aria-label="Mobile primary">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                {l.type === "page" ? (
                  <Link href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                ) : (
                  <a href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-menu-lang">
          <LangSwitcher />
        </div>

        <a
          className="btn btn-primary btn-lg mobile-menu-cta"
          href={cta.href}
          onClick={() => setOpen(false)}
        >
          <span>{cta.label}</span>
          <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="nav-hamburger"
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
