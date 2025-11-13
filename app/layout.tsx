import type { Metadata } from "next";
import Script from "next/script";
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
  title: "Colosseum Hackathon Analytics",
  description: "Explore innovative projects from Colosseum hackathons. Browse by tracks, teams, and engagement metrics.",
  keywords: ["Solana", "Hackathon", "Colosseum", "Blockchain", "Web3", "Dashboard", "Analytics"],
  authors: [{ name: "Figo", url: "https://x.com/figo_saleh" }],
  creator: "Figo",
  openGraph: {
    title: "Colosseum Hackathon Analytics",
    description: "Explore innovative projects from Colosseum hackathons",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Add your OG image to /public/og-image.png
        width: 1200,
        height: 630,
        alt: "Colosseum Hackathon Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Colosseum Hackathon Analytics",
    description: "Explore innovative projects from Colosseum hackathons",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
