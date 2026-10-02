import { WinnersExplorer } from "@/components/winners/WinnersExplorer";
import { getData } from "@/services/data";

export const metadata = { title: "Winners" };

export default async function WinnersPage() {
  const data = await getData();
  return <WinnersExplorer events={data.events} teams={data.teams} results={data.results} awards={data.awards} venues={data.venues} />;
}
