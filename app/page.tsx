import { redirect } from "next/navigation";
import { getDefaultHackathon } from "@/lib/hackathons";

export default function HomePage() {
  const defaultHackathon = getDefaultHackathon();
  redirect(`/${defaultHackathon.slug}`);
}
