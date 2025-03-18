"use client";
import Addintegration from "@/components/Addintegration";
import SideBar from "@/components/SideBar";
import React from "react";

const page = () => {
  return (
    <>
      <div className="bg-[#1a1f2c] w-screen min-h-screen flex overflow-x-clip ">
        <SideBar page="Integrate"/>
        <Addintegration />
      </div>
    </>
  );
};

export default page;
