import { Button } from "@/shared/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { getResourceTypes } from "@/features/resources/data/queries";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

export const ShareResource = () => {
  const resourceTypes = getResourceTypes();

  return (
    <Drawer direction={"right"}>
      <DrawerTrigger asChild={true}>
        <Button className={"w-44 px-4 py-2"}>Share Resource</Button>
      </DrawerTrigger>
      <DrawerContent
        className={`!top-28 !right-44 !bottom-4 !left-auto max-w-[calc(100vw-2rem)] border-0 bg-transparent p-0 shadow-none`}
      >
        <div className="rounded-xlx bg-background h-full w-[511px] border shadow-lg">
          <DrawerHeader>
            <DrawerTitle>Share a resource</DrawerTitle>
            <DrawerDescription>
              Contribute to the knowledge base by sharing valuable content
            </DrawerDescription>
          </DrawerHeader>
          <div className={"mx-4"}>
            <div className="flex flex-col gap-4">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue
                    className={"w-full"}
                    placeholder="Select Resource Type"
                  />
                </SelectTrigger>
                <SelectContent className="mt-10">
                  <SelectGroup>
                    {resourceTypes.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div>
                <label>Title</label>
                <Input placeholder="Enter a descriptive title" />
              </div>

              <div>
                <label>Description</label>
                <Textarea placeholder="Enter a detailed description" />
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild={true}>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
