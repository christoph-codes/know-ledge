import {Resource} from "@know-ledge/shared";
import {
    Sheet, SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/shared/ui/sheet";
import {Button} from "@/shared/ui/button";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import {Badge} from "@/shared/ui/badge";
import {Code} from "lucide-react";
import {toast} from "sonner";

export type ViewCodeSnippetProps = {
    resource: Resource;
    triggerElement: React.ReactNode;
}
export const ViewCodeSnippet = ({resource, triggerElement}: ViewCodeSnippetProps) => {
    const copy = async () => {
        toast.success("Code Copied!");
        await navigator.clipboard.writeText(resource?.snippet ?? "");
    };
    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    {/*<Button className={"w-44 px-4 py-2"}>Share Resource</Button>*/}
                    {triggerElement}
                </SheetTrigger>
                <SheetContent
                    side={"right"}
                    className={`top-28! right-10! bottom-4! left-auto! h-[85%] border-0 p-0 shadow-none`}
                >
                    <SheetHeader>
                        <SheetTitle>
                            <Badge variant={"outline"}><Code size={20} /> Code Snippet</Badge>

                        </SheetTitle>

                    </SheetHeader>
                    <div className={"mx-4"}>
                        <div className="flex flex-col gap-4">
                            <p className={'text-lg font-semibold'}>{resource.title}</p>
                            <p className={'text-sm'}>{resource.description}</p>

                            <div className={'flex flex-row gap-x-2'}>
                                {resource?.tags?.map((tag) => (

                                    <Badge key={tag.id} variant={"outline"}>{tag.name}</Badge>
                                ))}
                            </div>

                            <div className="overflow-hidden rounded-md border">
                                <div className="border-b bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                    ({resource.language})
                                </div>
                                <SyntaxHighlighter
                                    className={"min-h-[300px] h-full"}
                                    language={resource.language}
                                    style={vscDarkPlus}
                                    customStyle={{
                                        margin: 0,
                                        fontSize: "0.875rem",
                                        maxHeight: "200px",
                                        overflow: "auto",
                                    }}
                                >
                                    {resource?.snippet ?? ""}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <div className={"border-t"}>

                            <div className={"mt-2 flex justify-between gap-2"}>

                                <SheetClose>

                                </SheetClose>

                                <Button type="submit" className={"w-full"} onClick={copy}>
                                    Copy code snippet
                                </Button>
                            </div>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}
