import Porfile from "@/components/Porfile";
import SideBar from "@/components/SideBar";

export default function page() {
    return (
        <>
            <div>
                <div className="flex min-h-screen w-full overflow-x-clip bg-[#09090b] text-zinc-200 antialiased">
                    <SideBar page="My Profile" />
                    <Porfile/>
                </div>
            </div>
        </>
    )
}
