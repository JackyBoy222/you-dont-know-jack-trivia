import { LeaderboardsExplorer } from "@/components/leaderboards/LeaderboardsExplorer";
import { getData } from "@/services/data";

export const metadata = { title: "Leaderboards" };

export default async function LeaderboardsPage() {
  const data = await getData();
  return <LeaderboardsExplorer events={data.events} results={data.results} teams={data.teams} venues={data.venues} />;
}
