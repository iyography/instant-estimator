import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { PostHogProvider } from "@/components/analytics/posthog-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instant Estimator - Capture More Leads with Instant Price Estimates",
  description: "Let your customers get instant price estimates on your website. Capture leads automatically and grow your business.",
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
            </PostHogProvider>
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
