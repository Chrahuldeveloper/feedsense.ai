"use client";
import React from "react";
import { MdDashboard } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { IoIosCall } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";

interface SideBarProps {
  setsection: Function;
}

const SideBar: React.FC<SideBarProps> = ({ setsection }) => {
  return (
    <aside className="bg-[#0f0d15] w-36 h-screen space-y-10 px-14 py-6 hidden md:block fixed left-0 top-0">
      <MdDashboard
        onClick={() => {
          setsection("dashboard");
        }}
        size={23}
        color="white"
        cursor={"pointer"}
      />
      <IoIosNotifications
        onClick={() => {
          setsection("notifications");
        }}
        size={23}
        color="white"
        cursor={"pointer"}
      />
      <IoIosCall size={23} color="white" cursor={"pointer"} />
      <MdOutlineAttachMoney size={23} color="white" cursor={"pointer"} />
      <IoLogOut size={23} color="white" cursor={"pointer"} />

   

    </aside>
  );
};

export default SideBar;
