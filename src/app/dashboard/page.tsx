"use client";
import React, { useState } from "react";
import Table from "@/components/Table";
import SideBar from "@/components/SideBar";
import Notifications from "@/components/Notifications";

const Page = () => {
  const [section, setsection] = useState();

  return (
    <div className="bg-[#000000] w-full  flex overflow-x-clip">
      <SideBar setsection={setsection} />
      {section === "dashboard" ? (
        <Table />
      ) : section === "notifications" ? (
        <Notifications />
      ) : (
        <Table />
      )}
    </div>
  );
};

export default Page;
