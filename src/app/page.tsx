import { HomePage } from "@/components/home/HomePage";
import { getData } from "@/services/data";

export default async function Home() {
  const data = await getData();

  return <HomePage data={data} />;
}
