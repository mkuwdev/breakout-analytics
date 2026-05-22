const PAGE_LIMIT = 50;
const CONCURRENCY = 4;
const REVALIDATE_SECONDS = 600;
const MAX_RETRIES = 4;

function buildUrl(id: number, offset: number, seed?: string) {
  const params = new URLSearchParams({
    "hackathonIds[]": String(id),
    limit: String(PAGE_LIMIT),
    offset: String(offset),
    showWinnersOnly: "false",
    sort: "RANDOM",
  });
  if (seed) params.set("seed", seed);
  return `https://api.colosseum.org/api/projects?${params.toString()}`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(id: number, offset: number, seed?: string): Promise<any> {
  let attempt = 0;
  while (true) {
    const res = await fetch(buildUrl(id, offset, seed), {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: [`hackathon-${id}`] },
    });
    if (res.ok) return res.json();
    if (res.status === 429 && attempt < MAX_RETRIES) {
      const retryAfter = Number(res.headers.get("retry-after"));
      const resetSec = Number(res.headers.get("ratelimit-reset"));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : Number.isFinite(resetSec) && resetSec > 0
          ? Math.min(resetSec * 1000, 60_000)
          : Math.min(1000 * 2 ** attempt, 15_000);
      await sleep(wait + Math.random() * 250);
      attempt++;
      continue;
    }
    throw new Error(`Failed to fetch projects (offset=${offset}): ${res.status}`);
  }
}

async function runPool<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= tasks.length) return;
      results[i] = await tasks[i]();
    }
  });
  await Promise.all(workers);
  return results;
}

export async function fetchHackathonProjects(id: number) {
  const first = await fetchPage(id, 0);
  const totalCount: number = first.totalCount ?? first.projects?.length ?? 0;
  const seed: string | undefined = first.seed;

  const offsets: number[] = [];
  for (let off = PAGE_LIMIT; off < totalCount; off += PAGE_LIMIT) offsets.push(off);

  const restPages = await runPool(
    offsets.map((off) => () => fetchPage(id, off, seed)),
    CONCURRENCY,
  );

  const allProjects = [first, ...restPages]
    .flatMap((page) => (Array.isArray(page.projects) ? page.projects : []))
    .filter((p: any) => p && p.name && p.id !== undefined && p.slug)
    .map((p: any) => {
      const hasTracks = Array.isArray(p.tracks) && p.tracks.length > 0;
      if (hasTracks) return p;
      if (typeof p.category === "string" && p.category.trim()) {
        return { ...p, tracks: [p.category] };
      }
      return { ...p, tracks: Array.isArray(p.tracks) ? p.tracks : [] };
    });

  return {
    ...first,
    projects: allProjects,
    offset: 0,
    hasMore: false,
    totalCount,
  };
}
