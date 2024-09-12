"use client";
import React, { useState } from "react";
import Table from "@/components/Table";
import SideBar from "@/components/SideBar";
import Notifications from "@/components/Notifications";

const Page = () => {
  const [section, setsection] = useState();

  return (
    <div className="bg-[#000000] w-full h-screen  flex  overflow-x-clip">
      <SideBar />
      <Notifications />
      {/* <Table /> */}
    </div>
  );
};

export default Page;
