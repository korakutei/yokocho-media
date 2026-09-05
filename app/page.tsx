import Hero from "@/components/Hero";
import Pillars from "@/components/Pillars";
import Digest from "@/components/Digest";
import Venues from "@/components/Venues";
import UranoProfile from "@/components/UranoProfile";
import SiteFooter from "@/components/SiteFooter";
import { getDigest, getVenues } from "@/lib/data";

function toDotDate(isoDate: string): string {
  // "2026-09-04" -> "2026.09.04"
  return isoDate.replaceAll("-", ".");
}

export default function HomePage() {
  const digest = getDigest();
  const venues = getVenues();

  return (
    <>
      <Hero
        digestCount={digest.items.length}
        venueCount={venues.venues.length}
        updatedAt={toDotDate(digest.updatedAt)}
      />
      <Pillars />
      <Digest data={digest} />
      <Venues data={venues} />
      <UranoProfile />
      <SiteFooter />
    </>
  );
}
