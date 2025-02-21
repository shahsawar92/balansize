import { Metadata } from "next";
import * as React from "react";
import { ToastContainer } from "react-toastify";

import "@/styles/globals.css";

import { siteConfig } from "@/constant/config";

import Providers from "../redux/providers";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },

  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/icon.png",
    apple: "/favicon/icon.png",
  },
  manifest: `/favicon/manifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.png`],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.png`],
    creator: "@shahsawar",
  },
  authors: [
    {
      name: "Shah Sawar",
      // url: 'https://theodorusclarence.com',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
