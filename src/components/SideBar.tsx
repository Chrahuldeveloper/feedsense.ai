"use client";
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
import ModelLogout from "./ModelLogout";
import Link from "next/link";
import { CgWebsite } from "react-icons/cg";

const SideBar = () => {
  const [toggle, settoggle] = useState(false);

  const iconSize = 24;

  return (
    <>
      <aside className="bg-[#0a0a0a] w-42 h-screen space-y-10 px-5 py-6 hidden md:block fixed left-0 top-0">
        <div className="flex flex-col space-y-10 pt-7">
          {/* Home */}
          <Link href="/dashboard">
            <div className="flex items-center space-x-3 py-2  rounded-lg border-[1px] border-[#0a0a0a] hover:border-blue-500   bg-gradient-to-r  from-blue-400 via-blue-600 to-blue-700  pr-8 pl-2 transition duration-200 ease-in-out">
              <MdDashboard color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Home</h1>
            </div>
          </Link>

          {/* Integrate */}
          <Link href="/dashboard/integrate">
            <div className="flex items-center space-x-3 py-2 rounded-lg  pr-8 pl-2 border-[#0a0a0a] hover:border-blue-500 border-b-[1px] shadow-lg">
              <CgWebsite color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Integrate</h1>
            </div>
          </Link>

          {/* Contact */}
          <div className="flex items-center space-x-3 py-2 rounded-lg border-b-[1px] border-[#0a0a0a] hover:border-blue-500 pr-8  pl-2 transition duration-200 ease-in-out">
            <IoIosCall color="white" size={iconSize} />
            <h1 className="text-white text-sm font-semibold">Contact</h1>
          </div>

          {/* Subscription */}
          <Link href="/dashboard/subscription">
            <div className="flex items-center space-x-3 py-2 rounded-lg border-b-[1px] border-[#0a0a0a] hover:border-blue-500 pr-8  pl-2  transition duration-200 ease-in-out">
              <MdOutlineAttachMoney color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Subscription</h1>
            </div>
          </Link>

          {/* Logout */}
          <div
            className="flex items-center space-x-3 py-2 rounded-lg border-b-[1px] border-[#0a0a0a] hover:border-blue-500  pr-8 transition  pl-2  duration-200 ease-in-out"
            onClick={() => settoggle(true)}
          >
            <IoLogOut size={iconSize} color="white" />
            <h1 className="text-white text-sm font-semibold">Logout</h1>
          </div>
        </div>
      </aside>
      {toggle ? <ModelLogout settoggle={settoggle} /> : null}
    </>
  );
};

export default SideBar;
