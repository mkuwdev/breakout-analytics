import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.colosseum.org/api/projects?hackathonId=4&limit=1500&offset=0&showWinnersOnly=false&sort=RANDOM", {
      headers: {
        "Content-Type": "application/json",
      },
      // Remove Next.js cache due to 2MB limit
      cache: "no-store", // This prevents Next.js from trying to cache
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }

    const data = await response.json();

    // Validate and clean the data
    if (data.projects && Array.isArray(data.projects)) {
      data.projects = data.projects.filter((project: any) => project && project.name && project.id !== undefined && project.slug);
    }

    // Use standard HTTP caching headers instead
    return NextResponse.json(data, {
      headers: {
        // Cache for 1 hour in the browser
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
