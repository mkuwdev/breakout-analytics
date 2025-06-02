import type { Metadata } from "next";
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Colosseum Breakout Hackathon Dashboard",
  description: "Explore innovative projects from the Solana Colosseum Breakout Hackathon. Browse by tracks, teams, and engagement metrics.",
  generator: "Next.js",
  keywords: ["Solana", "Hackathon", "Colosseum", "Blockchain", "Web3", "Dashboard"],
  authors: [{ name: "Figo", url: "https://x.com/figo_saleh" }],
  creator: "Figo",
  openGraph: {
    title: "Colosseum Breakout Hackathon Dashboard",
    description: "Explore innovative projects from the Solana Colosseum Breakout Hackathon",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
