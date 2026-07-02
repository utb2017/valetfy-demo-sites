import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { lotusPetSpaJsonLd } from "./jsonld";
import { LOTUS_SITE } from "@/lib/lotuspetspa/site";
import "./lotuspetspa.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const assetBase = "/lotus-pet-spa-mobile";
const ogImage = `${assetBase}/og-image.png`;
const twitterImage = `${assetBase}/twitter-image.png`;
const appleTouchIcon = `${assetBase}/apple-touch-icon.png`;

export const viewport: Viewport = {
  themeColor: LOTUS_SITE.colors.primary,
};

export const metadata: Metadata = {
  metadataBase: new URL(LOTUS_SITE.demoUrl),
  title:
    "Mobile Dog Grooming in Columbus, GA | Lotus Pet Spa Mobile Grooming",
  description:
    "Book calm, cage-free mobile dog grooming with April of Lotus Pet Spa Mobile Grooming in Columbus, Muscogee County, Phenix City, and the Fort Benning corridor.",
  applicationName: LOTUS_SITE.businessName,
  category: "Pet Grooming",
  manifest: `${assetBase}/site.webmanifest`,
  icons: {
    icon: [
      { url: `${assetBase}/favicon.ico`, sizes: "any" },
      {
        url: `${assetBase}/favicon-16x16.png`,
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: `${assetBase}/favicon-32x32.png`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: `${assetBase}/favicon-48x48.png`,
        sizes: "48x48",
        type: "image/png",
      },
    ],
    shortcut: `${assetBase}/favicon.ico`,
    apple: [
      {
        url: appleTouchIcon,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Lotus Pet Spa",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
  },
  keywords: [
    "mobile dog grooming Columbus GA",
    "Lotus Pet Spa Mobile Grooming",
    "dog groomer Columbus GA",
    "mobile pet grooming Muscogee County",
    "dog grooming Phenix City",
    "cage-free dog grooming",
    "April dog groomer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lotus Pet Spa Mobile Grooming | Columbus, GA",
    description:
      "Luxury one-on-one mobile dog grooming by April, serving Columbus, Muscogee County, Phenix City, and the Fort Benning corridor.",
    url: LOTUS_SITE.demoUrl,
    siteName: LOTUS_SITE.businessName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Lotus Pet Spa Mobile Grooming social card for mobile dog grooming in Columbus, Georgia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lotus Pet Spa Mobile Grooming | Columbus, GA",
    description:
      "Calm mobile dog grooming with April across Columbus, Muscogee County, Phenix City, and the Fort Benning corridor.",
    images: [twitterImage],
  },
  other: {
    "msapplication-TileColor": LOTUS_SITE.colors.primary,
    "msapplication-config": `${assetBase}/browserconfig.xml`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function LotusPetSpaMobileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${inter.variable} min-h-screen bg-white pb-16 font-sans sm:pb-0`}
      style={{ color: "#35405A" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lotusPetSpaJsonLd) }}
      />
      {children}
    </div>
  );
}
