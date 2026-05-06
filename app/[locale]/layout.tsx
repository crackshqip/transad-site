import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/app/seo";
import CookieConsent from "@/app/components/CookieConsent";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ED1B50",
};

const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    { path: "../fonts/Inter_18pt-Light.ttf",    weight: "300", style: "normal" },
    { path: "../fonts/Inter_18pt-Regular.ttf",  weight: "400", style: "normal" },
    { path: "../fonts/Inter_18pt-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Inter_18pt-Bold.ttf",     weight: "700", style: "normal" },
  ],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${plexMono.variable}`}>
      <body className="app">
        <NextIntlClientProvider>
          {children}
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
