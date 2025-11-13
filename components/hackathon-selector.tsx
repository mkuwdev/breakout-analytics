"use client";

import { useRouter, usePathname } from "next/navigation";
import { hackathons } from "@/lib/hackathons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function HackathonSelector() {
  const router = useRouter();
  const pathname = usePathname();

  // Extract current hackathon slug from pathname
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const currentSlug = pathSegments[0] || "cypherpunk";

  const handleHackathonChange = (slug: string) => {
    router.push(`/${slug}`);
  };

  const currentHackathon = currentSlug ? hackathons.find((h) => h.slug === currentSlug) : null;

  return (
    <Select value={currentSlug || "cypherpunk"} onValueChange={handleHackathonChange}>
      <SelectTrigger className="h-9 w-[180px] bg-black border-gray-800 text-gray-100 text-sm focus:border-gray-700">
        <SelectValue>
          <div className="flex items-center gap-2">
            {currentHackathon ? (
              <>
                <span>{currentHackathon.emoji}</span>
                <span>{currentHackathon.name}</span>
              </>
            ) : (
              <span>Select Hackathon</span>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-black border-gray-800 text-gray-100">
        {hackathons.map((hackathon) => (
          <SelectItem key={hackathon.slug} value={hackathon.slug} className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-sm">
            <div className="flex items-center gap-2">
              <span>{hackathon.emoji}</span>
              <span>{hackathon.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
