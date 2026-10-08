import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeeshan | Senior Logo Designer & Brand Strategist",
  description: "Crafting Timeless Design & Brand Identities",
  openGraph: {
    title: "Zeeshan | Senior Logo Designer & Brand Strategist",
    description: "Crafting Timeless Design & Brand Identities",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased snap-y snap-proximity`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
