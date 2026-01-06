import ResourceScreen from "@/features/resources/ui/ResourceScreen";
import { loadResources } from "@/features/resources/server/resource.action";

export default async function Page() {
  const data = await loadResources();
  return <ResourceScreen resources={data} />;
}
