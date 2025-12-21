import {BookMarked, CircleUser} from "lucide-react";
import {ShareResource} from "@/features/resources/ui/ShareResource";


export const HeaderNav = () => (
    <div className={'h-20 border-b border-b-gray-300 drop-shadow-md  bg-white mb-20'}>
        <div className={'flex flex-row pl-12 items-center h-full gap-2 '}>

            <div className={'rounded-full bg-black p-2'}>
                <BookMarked size={35} color={"white"} className={'p-1'}/>
            </div>

            <p className={'text-2xl font-bold'}>Method Know</p>

            <div className={'ml-auto pr-12 '}>

                <div className={'flex justify-betweenx gap-4'}>

                    <ShareResource/>

                    <div className={'flex items-center justify-center gap-2'}>
                        <CircleUser size={35}/>
                        <p className={'text-xl'}>Mike</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
)