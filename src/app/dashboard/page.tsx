"use client";
import React, { useState } from "react";
import Table from "@/components/Table";
import SideBar from "@/components/SideBar";

const Page = () => {
  const [section, setsection] = useState();

  return (
    <div className="bg-[#000000] w-full  flex overflow-x-clip">
      <SideBar setsection={setsection} />
      {section === "dashboard" ? <Table /> : <Table />}
    </div>
  );
};

export default Page;
