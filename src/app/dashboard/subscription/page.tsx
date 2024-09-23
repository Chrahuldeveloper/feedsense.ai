import React from "react";
import SubscriptionCard from "../../../components/SubscriptionCard";
import SideBar from "@/components/SideBar";
const page = () => {
  return (
    <div className="bg-[#000000] w-screen min-h-screen flex overflow-x-clip ">
      <SideBar />
      <SubscriptionCard />
    </div>
  );
};

export default page;
