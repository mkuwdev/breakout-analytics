import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getHackathonBySlug, hackathons } from "@/lib/hackathons";
import Dashboard from "@/components/dashboard";

interface PageProps {
  params: Promise<{
    hackathon: string;
  }>;
}

export async function generateStaticParams() {
  // Generate static params for all hackathons
  return hackathons.map((hackathon) => ({
    hackathon: hackathon.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hackathon: slug } = await params;
  const hackathon = getHackathonBySlug(slug);

  if (!hackathon) {
    return {
      title: "Hackathon Not Found",
    };
  }

  // Use absolute URL for OG image in production
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://colosseum.frontseat.co";
  const ogImageUrl = `${baseUrl}/og-image.png`;

  return {
    title: `${hackathon.name} Hackathon Analytics | Colosseum`,
    description: `Explore innovative projects from the Colosseum ${hackathon.name} Hackathon. Browse by tracks, teams, and engagement metrics.`,
    keywords: ["Solana", "Hackathon", "Colosseum", "Blockchain", "Web3", "Dashboard", hackathon.name],
    authors: [{ name: "Figo", url: "https://x.com/figo_saleh" }],
    creator: "Figo",
    openGraph: {
      title: `${hackathon.name} Hackathon Analytics | Colosseum`,
      description: `Explore innovative projects from the Colosseum ${hackathon.name} Hackathon`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${hackathon.name} Hackathon Analytics`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${hackathon.name} Hackathon Analytics | Colosseum`,
      description: `Explore innovative projects from the Colosseum ${hackathon.name} Hackathon`,
      images: [ogImageUrl],
    },
  };
}

export default async function HackathonPage({ params }: PageProps) {
  const { hackathon: slug } = await params;
  const hackathon = getHackathonBySlug(slug);

  if (!hackathon) {
    notFound();
  }

  return <Dashboard hackathon={hackathon} />;
}

