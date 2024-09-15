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
      <aside className="bg-[#0f0d15] w-32 h-screen space-y-10 px-12 py-6 hidden md:block fixed left-0 top-0">
        <div className="flex items-center space-x-2.5 w-32 justify-between">
          <Link href="/dashboard">
            <MdDashboard size={22} color="white" cursor={"pointer"} />
          </Link>
        </div>
        <div className="flex items-center space-x-2.5 w-32 justify-between">
          <IoIosCall size={22} color="white" cursor={"pointer"} />
        </div>
        <div className="flex items-center space-x-2.5 w-32 justify-between">
          <MdOutlineAttachMoney size={22} color="white" cursor={"pointer"} />
        </div>
        <div className="flex items-center space-x-2.5 w-32 justify-between">
          <CgWebsite size={22} color="white" cursor={"pointer"} />
        </div>
        <div className="flex items-center space-x-2.5 w-32 justify-between">
          <IoLogOut
            onClick={() => {
              settoggle(true);
            }}
            size={22}
            color="white"
            cursor={"pointer"}
          />
        </div>
      </aside>
      {toggle ? <ModelLogout settoggle={settoggle} /> : null}
    </>
  );
};

export default SideBar;
