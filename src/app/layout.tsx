import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { CookieConsent } from "@/components/cookie-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScopeForm - Capture More Leads with Instant Price Estimates",
  description: "Let your customers get instant price estimates on your website. Capture leads automatically and grow your business.",
  metadataBase: new URL("https://scopeform.io"),
  openGraph: {
    title: "ScopeForm - Instant Price Estimates for Your Website",
    description: "Let your customers get instant price estimates on your website. Capture leads automatically and grow your business.",
    url: "https://scopeform.io",
    siteName: "ScopeForm",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScopeForm - Instant Price Estimates for Your Website",
    description: "Let your customers get instant price estimates on your website. Capture leads automatically and grow your business.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <Suspense fallback={null}>
            <PostHogProvider>
              {children}
              <CookieConsent />
            </PostHogProvider>
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
