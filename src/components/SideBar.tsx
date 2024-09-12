"use client";
import React from "react";
import { CiHome } from "react-icons/ci";

const SideBar = () => {
  return (
    <aside className="bg-[#0f0d15] w-28 h-screen space-y-8 px-10 py-6 hidden md:block fixed left-0 top-0">
      <CiHome size={20} color="white" cursor={"pointer"} />
      <CiHome size={20} color="white" cursor={"pointer"} />
      <CiHome size={20} color="white" cursor={"pointer"} />
      <CiHome size={20} color="white" cursor={"pointer"} />
      <CiHome size={20} color="white" cursor={"pointer"} />
      <CiHome size={20} color="white" cursor={"pointer"} />
      <CiHome size={20} color="white" cursor={"pointer"} />
      <CiHome size={20} color="white" cursor={"pointer"} />
    </aside>
  );
};

export default SideBar;
