import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.email("Invalid email").max(200),
  company: z.string().trim().max(200).optional(),
  project: z.string().trim().min(10, "Tell us a bit more").max(5000),
  // Honeypot — accepted by the schema so the handler can return a fake-success
  // for bots, instead of leaking a 400 they could learn from.
  website: z.string().optional(),
  // Locale for context only; not validated strictly.
  locale: z.enum(["en", "de"]).optional(),
});

const TO_ADDRESS = process.env.CONTACT_TO ?? "hello@transad.de";
const FROM_ADDRESS = process.env.CONTACT_FROM ?? "Transad Site <onboarding@resend.dev>";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const { name, email, company, project, website, locale } = parsed.data;

  // Honeypot tripped — pretend success so the bot doesn't retry.
  if (website && website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Email is not configured on the server." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);
  const lines = [
    `From:    ${name} <${email}>`,
    company ? `Company: ${company}` : null,
    locale ? `Locale:  ${locale}` : null,
    "",
    project,
  ].filter((l): l is string => l !== null);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `New enquiry — ${name}`,
      text: lines.join("\n"),
    });

    if (error) {
      console.error("Resend send failed:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("Unexpected contact route error:", err);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
