import ResourceScreen from "@/features/resources/ui/ResourceScreen";
import { loadResources } from "@/features/resources/resource.action";
import { getCurrentUser } from "@/shared/server/auth";
import { loadResourceTypes, loadTags } from "@/features/resources/queries";

export default async function Page() {
  const result = await getCurrentUser();
  const userId = result.data?.id ?? 0;
  const initialTags = await loadTags();
  const resourceTypes = loadResourceTypes();
  const data = await loadResources();

  return (
    <ResourceScreen
      resources={data}
      initialTags={initialTags}
      resourceTypes={resourceTypes}
      userId={userId}
    />
  );
}
