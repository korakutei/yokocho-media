import Hero from "@/components/Hero";
import MoodSearch from "@/components/MoodSearch";
import MapSection from "@/components/MapSection";
import Venues from "@/components/Venues";
import Pillars from "@/components/Pillars";
import Digest from "@/components/Digest";
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
      <Digest data={digest} />
      <MoodSearch data={venues} />
      <MapSection />
      <Venues data={venues} />
      <Pillars />
      <UranoProfile />
      <SiteFooter />
    </>
  );
}
