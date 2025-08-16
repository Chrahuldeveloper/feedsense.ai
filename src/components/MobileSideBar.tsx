import React from "react";
import { MdDashboard } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { CgWebsite } from "react-icons/cg";
import Link from "next/link";

interface MobileSideBarProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleLogout: (value: boolean) => void;
  Page: string;
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({
  setToggle,
  setToggleLogout,
  Page,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden">
      <aside className="bg-[#161617] py-6 w-[50vw] h-full fixed top-0 left-0 md:hidden space-y-3 border-r-[1px] border-[#272b2f] z-50 px-4">
        <div className="flex justify-end cursor-pointer">
          <RxCross2 size={23} color="white" onClick={() => setToggle(false)} />
        </div>

        <Link href="/dashboard">
          <div
            className={`flex items-center space-x-6  cursor-pointer my-5 hover:bg-[#09343e] transition duration-200 ease-in-out rounded-lg w-48 px-5 py-2 ${
              Page === "Home"
                ? "bg-[#09343e] border border-cyan-400/20  backdrop-blur-sm  text-cyan-400"
                : ""
            }`}
          >
            <MdDashboard size={22} color="white" />
            <h1 className="text-slate-300 font-semibold text-sm">DashBoard</h1>
          </div>
        </Link>

        <Link href="/dashboard/integrate">
          <div
            className={`flex items-center space-x-6  cursor-pointer my-5 hover:bg-[#09343e] transition duration-200 ease-in-out rounded-lg w-48 px-5 py-2 ${
              Page === "Integrate"
                ? "bg-[#09343e] border border-cyan-400/20  backdrop-blur-sm  text-cyan-400"
                : ""
            }`}
          >
            <CgWebsite size={22} color="white" />
            <h1 className="text-slate-300 font-semibold text-sm">Integrate</h1>
          </div>
        </Link>

        <Link href="/dashboard/contact">
          <div
            className={`flex items-center space-x-6  cursor-pointer my-5 hover:bg-[#09343e] transition duration-200 ease-in-out rounded-lg w-48 px-5 py-2 ${
              Page === "Help"
                ? "bg-[#09343e] border border-cyan-400/20  backdrop-blur-sm  text-cyan-400"
                : ""
            }`}
          >
            <IoIosCall size={22} color="white" />
            <h1 className="text-slate-300 font-semibold text-sm">Help</h1>
          </div>
        </Link>

        <div
          className={`flex items-center space-x-6  cursor-pointer my-5 hover:bg-red-600 transition duration-200 ease-in-out rounded-lg w-48 px-5 py-2 text-red-500 hover:text-white ${
            Page === "Logout" ? "bg-red-400" : ""
          }`}
          onClick={() => setToggleLogout(true)}
        >
          <IoLogOut size={22} color="white" />
          <h1 className="text-slate-300 font-semibold text-sm">LogOut</h1>
        </div>
      </aside>
    </div>
  );
};

export default MobileSideBar;
