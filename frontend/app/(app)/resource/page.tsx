import ResourceScreen from "@/features/resources/ui/ResourceScreen";
import { loadResources } from "@/features/resources/resource.action";
import {getCurrentUser} from "@/shared/server/auth";

export default async function Page() {
  const result = await getCurrentUser();
  const userId =  result.data?.id ?? 0 ;


  const data = await loadResources();
  return <ResourceScreen resources={data} userId={userId} />;
}
