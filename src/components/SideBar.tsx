"use client";
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
import ModelLogout from "./ModelLogout";
import Link from "next/link";
import { CgWebsite } from "react-icons/cg";

interface props {
  page: string;
}

const SideBar: React.FC<props> = ({ page }) => {
  const [toggle, settoggle] = useState(false);

  const iconSize = 24;

  return (
    <>
      <aside className="bg-[#04050a]  w-42 h-full space-y-10 px-5 py-6 hidden md:block fixed left-0 top-0 bottom-0 border-r-[1px] border-[#15171b]">
        <div className="flex flex-col space-y-8 pt-7">
          {/* Home */}
          <Link href="/dashboard">
            <div
              className={`flex items-center space-x-4 py-3  pr-12 pl-4 transition duration-200 ease-in-out text-gray-300 rounded-lg ${
                page === "Home" ? "bg-[#12131a] " : ""
              }`}
            >
              <MdDashboard color="white" size={iconSize} />
              <h1 className=" text-sm font-semibold">Home</h1>
            </div>
          </Link>

          {/* Integrate */}
          <Link href="/dashboard/integrate">
            <div
              className={`flex items-center space-x-4 py-3 pr-12 pl-4 transition duration-200 ease-in-out text-gray-300 rounded-lg ${
                page === "Integrate" ? "bg-[#12131a]" : ""
              }`}
            >
              <CgWebsite color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Integrate</h1>
            </div>
          </Link>

          {/* Contact */}
          <Link href="/dashboard/contact">
            <div
              className={`flex items-center space-x-4 py-3 cursor-pointer  pr-12 pl-4 transition duration-200 ease-in-out text-gray-300 rounded-lg ${
                page === "Contact" ? "bg-[#12131a]" : ""
              }`}
            >
              <IoIosCall color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Contact</h1>
            </div>
          </Link>

          {/* Subscription */}
          <Link href="/plans">
            <div
              className={`flex items-center space-x-4 py-3  pr-12 pl-4 transition duration-200 ease-in-out text-gray-300 rounded-lg ${
                page === "Subscription" ? "bg-[#12131a]" : ""
              }`}
            >
              <MdOutlineAttachMoney color="white" size={iconSize} />
              <h1 className="text-white text-sm font-semibold">Subscription</h1>
            </div>
          </Link>

          {/* Logout */}

          <div
            className={`flex items-center space-x-4 py-3 cursor-pointer  pr-12 pl-4 transition duration-200 ease-in-out  text-gray-300 rounded-lg ${
              page === "Logout" ? "bg-[#12131a]" : ""
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
