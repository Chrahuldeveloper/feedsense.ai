"use client";
import React from "react";
import Table from "@/components/Table";
import SideBar from "@/components/SideBar";

const Page = () => {
  return (
    <div className="bg-[#131315] w-full flex min-h-screen overflow-x-clip">
      <SideBar page="Home" />
      <Table />
    </div>
  );
};

export default Page;
