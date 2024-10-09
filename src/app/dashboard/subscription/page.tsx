"use client";
import Bill from "@/components/Bill";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const page = () => {
  const subscriptionPlans = [
    {
      id: 1,
      name: "Basic",
      price: 10,
      features: [
        "Collect user feedback",
        "Manual task creation from feedback",
        "Basic analytics",
        "Email support",
        "Up to 100 feedback submissions per month",
      ],
      billingCycle: "monthly",
    },
    {
      id: 2,
      name: "Premium",
      price: 50,
      features: [
        "Collect user feedback",
        "Automated task generation from feedback",
        "Advanced analytics and insights",
        "Priority email and chat support",
        "Unlimited feedback submissions",
        "Customizable feedback forms",
        "AI-powered feedback analysis",
        "Integration with project management tools (e.g., Jira, Trello)",
        "Real-time feedback dashboard",
        "Visual feedback tools (screenshot annotations)",
      ],
      billingCycle: "monthly",
    },
  ];

  const [currentPlan, setcurrentPlan] = useState("Basic");

  return (
    <div className="bg-[#1c1c21] w-screen min-h-screen overflow-x-clip">
      <div className="flex justify-between w-[80vw] mx-auto pt-5 pb-10">
        <h1 className="text-white text-lg">Change Plan</h1>
        <RxCross2 size={24} color="white" />
      </div>

      <div className=" flex flex-col md:flex-row justify-between w-[90vw] md:w-[75vw] mx-auto pt-8 gap-6 items-center border-[1px] border-[#272b2f] p-6">
        <div className="space-y-4">
          <h1 className="text-white text-sm">Select Plan</h1>
          <p className="text-slate-300">
            For more details on our plans, visit our pricing page.
          </p>
          <div>
            {subscriptionPlans.map((itm, idx) => {
              return (
                <>
                  <div
                    key={idx}
                    className={`bg-[#1c1c21] p-5 rounded-lg space-y-1 border-[1px] border-[#272b2f] shadow-2xl mt-5 w-[80vw] md:w-[50vw] ${
                      currentPlan === itm.name ? "border-[#db1a5a]" : ""
                    }`}
                  >
                    <h1 className="text-lg font-semibold text-white">
                      {itm.name}{" "}
                      {currentPlan === itm.name && (
                        <span className="bg-[#2e2e34] px-3 py-1.5 rounded-full text-[10px]">
                          {"CurrentPlan"}
                        </span>
                      )}
                    </h1>
                    <p className="text-slate-300">${itm.price}</p>
                    <p className="text-slate-200">{itm.billingCycle}</p>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <Bill />
      </div>

      <div className="border-t-[1px] border-[#272b2f] md:fixed md:bottom-3 w-full pr-10 mt-6">
        <div className="flex justify-end gap-4  py-5">
          <button className="border-[1px] border-[#272b2f] text-white px-5 rounded-lg text-sm py-2 cursor-pointer font-semibold">
            Cancel
          </button>
          <button className="bg-[#db1a5a] text-white px-5 rounded-lg text-sm py-2 cursor-pointer font-semibold">
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
