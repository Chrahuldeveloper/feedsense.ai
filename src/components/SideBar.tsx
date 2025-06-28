"use client";
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
// import { MdOutlineAttachMoney } from "react-icons/md";
import ModelLogout from "./ModelLogout";
import Link from "next/link";
import { CgWebsite } from "react-icons/cg";
import { IoMdHelpCircle } from "react-icons/io";

interface props {
  page: string;
}

const SideBar: React.FC<props> = ({ page }) => {
  const [toggle, settoggle] = useState(false);

  const iconSize = 24;

  return (
    <>
      <aside className=" bg-[#0b0d0e] w-[60vw] lg:w-[15vw] h-full space-y-4 px-5 py-6 hidden md:block fixed left-0 top-0 bottom-0 border-r-[1px] border-[#1f2327]">
        <div>
          <h1 className="text-cyan-500 font-bold text-xl">FeedSenseAI</h1>
        </div>
        <div className="flex flex-col space-y-3 pt-7">
          <Link href="/dashboard">
            <div
              className={`flex  hover:bg-[#09343e] border border-black   backdrop-blur-sm  text-cyan-400 items-center space-x-4 py-1 pr-12 pl-4 transition duration-200 ease-in-out  rounded-lg ${
                page === "Home" ? "bg-[#09343e] border border-cyan-400/20  backdrop-blur-sm  text-cyan-400 " : ""
              }`}
            >
              <MdDashboard color="white" size={iconSize} />
              <h1 className="text-sm font-semibold">Home</h1>
            </div>
          </Link>

          <Link href="/dashboard/integrate">
            <div
              className={`flex  hover:bg-[#09343e] border border-black   backdrop-blur-sm  text-cyan-400  items-center space-x-4 py-1 pr-12 pl-4 transition duration-200 ease-in-out  rounded-lg ${
                page === "Integrate" ? "bg-[#09343e] border border-cyan-400/20  backdrop-blur-sm  text-cyan-400" : ""
              }`}
            >
              <CgWebsite color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Integrate</h1>
            </div>
          </Link>

          <Link href="/dashboard/contact">
            <div
              className={`flex items-center hover:bg-[#09343e] border border-black   backdrop-blur-sm  text-cyan-400   space-x-4  py-1 cursor-pointer  pr-12 pl-4 transition duration-200 ease-in-out  rounded-lg ${
                page === "Contact" ? "bg-[#09343e] border border-cyan-400/20  backdrop-blur-sm  text-cyan-400" : ""
              }`}
            >
              <IoMdHelpCircle color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Help</h1>
            </div>
          </Link>

          {/* Subscription */}
          {/* <Link href="/plans">
            <div
              className={`flex items-center hover:bg-slate-800 space-x-4 py-1  pr-12 pl-4 transition duration-200 ease-in-out text-gray-300 rounded-lg ${
                page === "Subscription" ? "bg-[#242737]" : ""
              }`}
            >
              <MdOutlineAttachMoney color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Subscription</h1>
            </div>
          </Link> */}

          {/* Logout */}
          <div
            className={`flex  items-center hover:bg-red-600 space-x-4 py-1 cursor-pointer pr-16 pl-5 transition duration-200 ease-in-out  text-red-500 hover:text-white rounded-lg ${
              page === "Logout" ? "bg-red-400" : ""
            }`}
            onClick={() => settoggle(true)}
          >
            <IoLogOut size={iconSize} />
            <button className="  text-sm font-semibold ">Logout</button>
          </div>
        </div>
      </aside>
      {toggle ? <ModelLogout settoggle={settoggle} /> : null}
    </>
  );
};

export default SideBar;
