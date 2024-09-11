import React from "react";
import Table from "@/components/Table";
import SideBar from "@/components/SideBar";
const page = () => {
  return (
    <div className="bg-[#000000] w-screen h-screen flex gap-10">
      <SideBar />
      <Table />
    </div>
  );
};

export default page;
