import { NextResponse } from "next/server";
import { getDefaultHackathon } from "@/lib/hackathons";

export async function GET(request: Request) {
  try {
    // Get hackathon ID from query params, default to default hackathon
    const { searchParams } = new URL(request.url);
    const hackathonId = searchParams.get("hackathonId");

    // If no hackathonId provided, use default
    const id = hackathonId ? parseInt(hackathonId, 10) : getDefaultHackathon().id;

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid hackathon ID" }, { status: 400 });
    }

    const response = await fetch(`https://api.colosseum.org/api/projects?hackathonIds[]=${id}&limit=1600&offset=0&showWinnersOnly=false&sort=RANDOM`, {
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
        //"Cache-Control": "public, max-age=3600, stale-while-revalidate=7200",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
