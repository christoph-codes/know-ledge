'use client'
import {SearchIcon} from "lucide-react";
import {Input} from "@/shared/ui/input";
// import {
//     Drawer, DrawerClose,
//     DrawerContent,
//     DrawerDescription,
//     DrawerFooter,
//     DrawerHeader,
//     DrawerTitle,
//     DrawerTrigger
// } from "@/shared/ui/drawer";
// import {Button} from "@/shared/ui/button";

export const Search = () => {
    return (
        <div>
            <div className={'flex flex-col'}>

                <p className={'text-2xl font-medium mb-2'}>Discover Resources</p>
                <p className={'text-lg pb-6'}> Explore shared knowledge from our community</p>

                <div className={'flex flex-row justify-start items-center border border-gray-200 p-2 rounded-lg gap-2'}>
                    <SearchIcon size={30}  /> <Input className={'border-none text-lg'}
                placeholder={'Search resource by title or description'}
                />
                </div>


            </div>
        </div>
    )
}