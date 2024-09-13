"use client";
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { IoIosCall } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
import ModelLogout from "./ModelLogout";

interface SideBarProps {
  setsection: any;
}

const SideBar: React.FC<SideBarProps> = ({ setsection }) => {
  const [toggle, settoggle] = useState(false);

  return (
    <>
      <aside className="bg-[#0f0d15] w-32 h-screen space-y-10 px-12 py-6 hidden md:block fixed left-0 top-0">
        <div className="flex items-center space-x-2.5 w-32 justify-between">
          <MdDashboard
            onClick={() => {
              setsection("dashboard");
            }}
            size={22}
            color="white"
            cursor={"pointer"}
          />
        </div>
        <div className="flex items-center space-x-2.5 w-32 justify-between">
          <IoIosCall size={22} color="white" cursor={"pointer"} />
        </div>
        <div className="flex items-center space-x-2.5 w-32 justify-between">
          <IoIosNotifications
            onClick={() => {
              setsection("notifications");
            }}
            size={22}
            color="white"
            cursor={"pointer"}
          />
        </div>
        <div className="flex items-center space-x-2.5 w-32 justify-between">
          <MdOutlineAttachMoney size={22} color="white" cursor={"pointer"} />
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
