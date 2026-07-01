import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { woofWashJsonLd } from "./jsonld";
import "./woofwash.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Demo previews stay noindex (we never want demo subdomains indexed).
export const metadata: Metadata = {
  title:
    "Mobile Dog Grooming in Austin | Woof Wash — Eco-Friendly & Cage-Free",
  description:
    "Eco-friendly, cage-free mobile dog grooming in Austin & Travis County, TX. Renewable-energy vans, all-natural products, force-free care.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function WoofWashLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${inter.variable} font-sans bg-white min-h-screen pb-16 sm:pb-0`}
      style={{ color: "#33415c" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(woofWashJsonLd) }}
      />
      {children}
    </div>
  );
}
