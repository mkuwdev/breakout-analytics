export interface Hackathon {
  id: number;
  slug: string;
  name: string;
  emoji: string; // Emoji for the selector
  description?: string;
  isDefault: boolean;
}

export const hackathons: Hackathon[] = [
  {
    id: 5,
    slug: "cypherpunk",
    name: "Cypherpunk",
    emoji: "🔐",
    description: "The latest Colosseum hackathon",
    isDefault: true,
  },
  {
    id: 4,
    slug: "breakout",
    name: "Breakout",
    emoji: "💥",
    description: "The Colosseum Breakout Hackathon",
    isDefault: false,
  },
  {
    id: 3,
    slug: "radar",
    name: "Radar",
    emoji: "📡",
    description: "The latest Colosseum hackathon",
    isDefault: false,
  },
  {
    id: 2,
    slug: "renaissance",
    name: "Renaissance",
    emoji: "🎨",
    description: "The latest Colosseum hackathon",
    isDefault: false,
  },
];

export function getHackathonBySlug(slug: string): Hackathon | undefined {
  return hackathons.find((h) => h.slug === slug);
}

export function getDefaultHackathon(): Hackathon {
  return hackathons.find((h) => h.isDefault) || hackathons[0];
}

export function getHackathonById(id: number): Hackathon | undefined {
  return hackathons.find((h) => h.id === id);
}
