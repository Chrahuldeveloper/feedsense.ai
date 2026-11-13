import Showwebsites from '@/components/Showwebsites'
import SideBar from '@/components/SideBar'
import React from 'react'

export default function page() {
    return (
        <div>
            <div className="flex min-h-screen w-full overflow-x-clip bg-[#09090b] text-zinc-200 antialiased">
                <SideBar page="Your websites" />
                <Showwebsites/>
            </div>
        </div>
    )
}
