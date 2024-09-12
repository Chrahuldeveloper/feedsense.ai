import React from "react";
import Table from "@/components/Table";
import SideBar from "@/components/SideBar";

const Page = () => {
  return (
    <div className="bg-[#000000] w-full   flex  overflow-x-clip">
      <SideBar />
      <Table />
    </div>
  );
};

export default Page;
