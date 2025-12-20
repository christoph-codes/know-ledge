import {Button} from "@/shared/ui/button";
import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/shared/ui/drawer";

export const ShareResource = () => {
    return (
        <Drawer direction={"right"}>
            <DrawerTrigger asChild={true}>
                <Button className={'w-44 py-2 px-4'}>Share Resource</Button>
            </DrawerTrigger>
            <DrawerContent className={`
                        bg-transparent border-0 shadow-none p-0
                          !left-auto
                          !right-44
                          !top-28
                          !bottom-4
                    
                           max-w-[calc(100vw-2rem)] `}>
                <div className=" w-[511px] h-full rounded-xlx border bg-background shadow-lg">


                    <DrawerHeader>
                        <DrawerTitle>Share a resource</DrawerTitle>
                        <DrawerDescription>Contribute to the knowledge base by sharing valuable
                            content</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild={true}>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>

        </Drawer>
    )
}