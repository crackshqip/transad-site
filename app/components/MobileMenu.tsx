"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LangSwitcher from "./LangSwitcher";

type LinkSpec = { href: string; label: string; type: "anchor" | "page" };

type Props = {
  links: LinkSpec[];
  labels: {
    open: string;
    close: string;
    menu: string;
  };
};

export default function MobileMenu({ links, labels }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

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
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 3 L17 17 M17 3 L3 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>

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

        <div className="mobile-menu-foot">
          <LangSwitcher />
        </div>
      </div>
    </>
  );
}
