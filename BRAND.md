# Transad — Brand Context

## Company

**Transad** is a minimal marketing and branding agency that helps modern
businesses communicate with clarity, consistency, and visual impact. The brand
focuses on clean identities, strategic campaigns, and refined digital content
built around simplicity, purpose, and strong visual direction.

## Design System

**Transad Minimal System** — a clean, modern design system for Transad, built
around minimal layouts, strong typography, neutral colors, subtle accents, and
spacious composition. The system should feel professional, elegant, strategic,
and easy to adapt across web, social media, presentations, and brand materials.

## Voice

- Minimal, strategic, professional.
- Sentence case for headlines and UI; ALL-CAPS reserved for tiny eyebrow labels
  and section numbers (`01 — WORK`).
- Confident, calm, plainspoken. Never hypey. Never cute.
- Short, declarative sentences. Two-sentence paragraphs are normal.
- Imperative CTAs ("View work", "Get in touch") — never "Click here".
- No emoji, anywhere.

## Positioning keywords

clarity · consistency · visual impact · clean identities · strategic campaigns ·
refined digital content · simplicity · purpose · strong visual direction

## Localisation

The site ships in **English (`en`, default)** and **German (`de`)**. All
user-visible copy lives in `messages/en.json` and `messages/de.json` and is
rendered via `next-intl`. **Whenever you add new copy, add the same key to
both files.** Missing keys are a build-time error in production.

- Keep keys nested by section (`hero.*`, `about.*`, `services.*`, `work.*`,
  `contact.*`, `nav.*`, `footer.*`).
- For inline emphasis, use `<em>...</em>` inside the value and render with
  `t.rich(key, { em: (chunks) => <em>{chunks}</em> })`.
- German is **not** a literal translation. Match the Transad voice — minimal,
  strategic, professional, plainspoken — and adapt for native German business
  tone (Sie-form, sentence case for headlines, no Anglicism unless idiomatic).
