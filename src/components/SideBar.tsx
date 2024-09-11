"use client";
import React from "react";
import { CiHome } from "react-icons/ci";

const SideBar = () => {
  return (
    <aside className="bg-[#0f0d15] w-28 h-full space-y-8 px-10 py-6 hidden md:block">
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
