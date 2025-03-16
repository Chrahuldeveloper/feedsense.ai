"use client";
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
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
      <aside className=" bg-[#151923] w-[60vw] lg:w-[15vw] h-full space-y-4 px-5 py-6 hidden md:block fixed left-0 top-0 bottom-0 border-r-[1px] border-[#15171b]">
        <div className="flex flex-col space-y-6 pt-7">
          {/* Home */}
          <Link href="/dashboard">
            <div
              className={`flex hover:bg-slate-800 items-center space-x-4 py-1.5 pr-12 pl-4 transition duration-200 ease-in-out text-gray-300 rounded-lg ${
                page === "Home" ? "bg-[#151720]" : ""
              }`}
            >
              <MdDashboard color="white" size={iconSize} />
              <h1 className="text-sm font-semibold">Home</h1>
            </div>
          </Link>

          {/* Integrate */}
          <Link href="/dashboard/integrate">
            <div
              className={`flex hover:bg-slate-800 items-center space-x-4 py-1.5 pr-12 pl-4 transition duration-200 ease-in-out text-gray-300 rounded-lg ${
                page === "Integrate" ? "bg-[#151720]" : ""
              }`}
            >
              <CgWebsite color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Integrate</h1>
            </div>
          </Link>

          {/* Contact */}
          <Link href="/dashboard/contact">
            <div
              className={`flex items-center hover:bg-slate-800 space-x-4 py-1.5 cursor-pointer  pr-12 pl-4 transition duration-200 ease-in-out text-gray-300 rounded-lg ${
                page === "Contact" ? "bg-[#151720]" : ""
              }`}
            >
              <IoMdHelpCircle color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Help</h1>
            </div>
          </Link>

          {/* Subscription */}
          <Link href="/plans">
            <div
              className={`flex items-center hover:bg-slate-800 space-x-4 py-1.5  pr-12 pl-4 transition duration-200 ease-in-out text-gray-300 rounded-lg ${
                page === "Subscription" ? "bg-[#151720]" : ""
              }`}
            >
              <MdOutlineAttachMoney color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Subscription</h1>
            </div>
          </Link>

          {/* Logout */}

          <div
            className={`flex items-center hover:bg-slate-800 space-x-4 py-1.5 cursor-pointer  pr-12 pl-4 transition duration-200 ease-in-out  text-gray-300 rounded-lg ${
              page === "Logout" ? "bg-[#151720]" : ""
            }`}
            onClick={() => settoggle(true)}
          >
            <IoLogOut size={iconSize} color="white" />
            <button className="text-white text-sm font-semibold ">
              Logout
            </button>
          </div>
        </div>
      </aside>
      {toggle ? <ModelLogout settoggle={settoggle} /> : null}
    </>
  );
};

export default SideBar;
