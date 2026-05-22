import { NextResponse } from "next/server";
import { getDefaultHackathon } from "@/lib/hackathons";
import { fetchHackathonProjects } from "@/lib/projects";

export const revalidate = 600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hackathonId = searchParams.get("hackathonId");
    const id = hackathonId ? parseInt(hackathonId, 10) : getDefaultHackathon().id;

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid hackathon ID" }, { status: 400 });
    }

    const data = await fetchHackathonProjects(id);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
