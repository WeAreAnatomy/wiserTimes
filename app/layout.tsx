import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { siteConfig } from '@/lib/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SkipLink from '@/components/layout/SkipLink';
import CookieConsent from '@/components/compliance/CookieConsent';
import OrganizationSchema from '@/components/seo/OrganizationSchema';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    locale: 'en_GB',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <meta name="google-adsense-account" content="ca-pub-2141931804727693" />
        <Script
          id="adsbygoogle-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2141931804727693"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <SkipLink />
        <Header />
        <main id="main" className="pb-20">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <OrganizationSchema />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
