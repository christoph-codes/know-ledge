'use client'
export const Search = () => {
    return (
        <div>
            <div className={'flex flex-col'}>

                <p className={'text-2xl font-medium mb-2'}>Discover Resources</p>
                <p className={'text-lg pb-6'}> Explore shared knowledge from our community</p>
                <input type='text' className={'w-full border rounded-l p-2'} placeholder='Search' />
            </div>
        </div>
    )
}