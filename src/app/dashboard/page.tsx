"use client";
import React, { useState } from "react";
import Table from "@/components/Table";
import SideBar from "@/components/SideBar";

const Page = () => {
  const [section, setsection] = useState("dashboard");

  return (
    <div className="bg-[#000000] w-full  flex overflow-x-clip">
      <SideBar setsection={setsection} />
      {section === "dashboard" ? <Table /> : null}
    </div>
  );
};

export default Page;
