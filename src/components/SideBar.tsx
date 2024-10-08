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

  return (
    <>
      <aside className="bg-[#0a0a0a] w-36 h-screen space-y-10 px-6 py-6 hidden md:block fixed left-0 top-0">
        <div className="flex items-center space-x-5 pt-4">
          <Link href="/dashboard">
            <MdDashboard size={20} color="white" cursor={"pointer"} />
          </Link>
          <h1 className="text-white text-sm">Home</h1>
        </div>
        <div className="flex items-center space-x-5">
          <Link href="/dashboard/integrate">
            <CgWebsite size={20} color="white" cursor={"pointer"} />
          </Link>
          <h1 className="text-white text-sm">Home</h1>
        </div>
        <div className="flex items-center space-x-5">
          <IoIosCall size={20} color="white" cursor={"pointer"} />
          <h1 className="text-white text-sm">Home</h1>
        </div>
        <div className="flex items-center space-x-5">
          <Link href="/dashboard/subscription">
            <MdOutlineAttachMoney size={20} color="white" cursor={"pointer"} />
          </Link>
          <h1 className="text-white text-sm">Home</h1>
        </div>
        <div className="flex items-center space-x-5">
          <IoLogOut
            onClick={() => {
              settoggle(true);
            }}
            size={20}
            color="white"
            cursor={"pointer"}
          />
          <h1 className="text-white text-sm">Home</h1>
        </div>
      </aside>
      {toggle ? <ModelLogout settoggle={settoggle} /> : null}
    </>
  );
};

export default SideBar;
