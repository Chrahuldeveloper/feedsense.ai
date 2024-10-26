"use client";
import Bill from "@/components/Bill";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Script from "next/script";
import axios from "axios";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Page = () => {
  const [currentPlan, setCurrentPlan] = useState({
    name: "Basic",
    price: 10,
  });

  const AMOUNT = currentPlan.price;

  const handlePayment = async () => {
    try {
      const orderID = await axios.post("http://localhost:3000/api/subscribe");

      console.log(orderID.data);

      const data = orderID.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: AMOUNT * 100,
        currency: "INR",
        name: "TASKFEED",
        description: "TEST TRANSACTION",
        order_id: data.orderId,
        handler: function (response: any) {
          console.log("payment is successful", response);
        },
        prefill: {
          name: "Rahul",
          email: "chrahulofficial@gmail.com",
          contact: "8317680338",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div className="bg-[#0e0f11] w-screen min-h-screen overflow-x-clip">
      <div className="flex justify-between w-[80vw] mx-auto pt-5 pb-10">
        <h1 className="text-slate-300 text-lg">Change Plan</h1>
        <Link href={"/dashboard"}>
          <RxCross2 size={24} color="white" />
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between rounded-xl w-[90vw] md:w-[75vw] mx-auto pt-8 gap-6 items-center border-[1px] border-[#272b2f] p-6">
        <div className="space-y-4">
          <h1 className="text-slate-300 text-xl font-bold">Select Plan</h1>
          <p className="text-slate-300">
            For more details on our plans, visit our{" "}
            <span className="border-b-[1px] border-slate-300 cursor-pointer">
              <Link href={"/plans"}>Pricing page</Link>
            </span>
            .
          </p>
          <div>
            {subscriptionPlans.map((itm) => (
              <div
                key={itm.id}
                onClick={() => setCurrentPlan(itm)}
                className={`p-5 rounded-xl space-y-1 border-[1px] bg-[#17161c] border-[#272b2f] shadow-2xl mt-5 w-[80vw] md:w-[50vw] cursor-pointer ${
                  currentPlan.name === itm.name ? "border-blue-600" : ""
                }`}
              >
                <h1 className="text-lg font-semibold text-slate-300">
                  {itm.name}{" "}
                  {currentPlan.name === itm.name && (
                    <span className="bg-[#2e2e34] px-3 py-1.5 rounded-full text-[10px]">
                      {"Current Plan"}
                    </span>
                  )}
                </h1>
                <p className="text-slate-300">${itm.price}</p>
                <p className="text-slate-200">{itm.billingCycle}</p>
              </div>
            ))}
          </div>
        </div>
        <Bill selectedPlan={currentPlan} />
      </div>

      <div className="border-t-[1px] bg-[#17161c] border-[#272b2f]  md:fixed md:bottom-0  w-full pr-10">
        <div className="flex justify-end gap-4 py-5">
          <button className="border-[1px] border-[#272b2f] text-slate-300 px-5 rounded-lg text-sm py-2 cursor-pointer font-semibold">
            Cancel
          </button>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
          <button
            onClick={handlePayment}
            className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 px-5 rounded-lg text-sm py-2 cursor-pointer font-semibold text-white"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
