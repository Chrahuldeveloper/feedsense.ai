"use client";
import Addintegration from "@/components/Addintegration";
import SideBar from "@/components/SideBar";
import React from "react";

const page = () => {
  return (
    <>
      <div className="bg-[#131315] w-screen min-h-screen flex overflow-x-clip ">
        <SideBar />
        <Addintegration />
      </div>
    </>
  );
};

export default page;
