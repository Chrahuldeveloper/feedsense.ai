import Navbar from "@/components/Navbar";
import React from "react";
import { TiTickOutline } from "react-icons/ti";
import Link from "next/link";

export default function PricingPage() {
  const Plans = [
    {
      name: "Basic",
      price: "₹450/month",
      features: [
        "Collect up to 100 feedback",
        "Email support",
        "Analytics",
        "Only 3 websites integration",
      ],
    },
    {
      name: "Pro",
      price: "₹2000 for 5 months",
      features: [
        "Unlimited feedback entries",
        "Automated task generation from feedback",
        "Priority email support",
        "Analytics",
        "Unlimited websites",
      ],
    },
  ];

  return (
    <div className="bg-[#000000] w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[30vh] bg-blue-600 rounded-full opacity-20 blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[60vw] h-[30vh] bg-blue-500 rounded-full opacity-15 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[70vw] h-[30vh] bg-blue-400 rounded-full opacity-10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="flex items-center justify-start md:pl-64 min-h-screen relative -mt-48">
          <div className="absolute inset-2 flex "></div>
          <div className="p-10 rounded-lg  relative z-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-semibold text-white max-w-2xl">
              Choose your Plan
            </h1>
            <p className="text-white max-w-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 px-6 md:px-10 pb-14 justify-center -mt-48">
          {Plans.map((plan, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-lg border-[1px] bg-[#121212] border-[#282e32] shadow-lg transform transition-transform duration-300 hover:scale-105 w-full max-w-md cursor-pointer"
            >
              <div className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 p-6 space-y-4 rounded-t-lg text-center">
                <h1 className="text-white text-2xl font-bold">{plan.name}</h1>
                <p className="text-lg font-semibold text-slate-200">
                  {plan.price}
                </p>
              </div>

              <ul className="space-y-3 text-slate-300 p-6 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className=" flex items-start gap-2">
                    <TiTickOutline size={20} className="text-green-500" />
                    <span className="font-semibold">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="p-6 mt-auto">
                <Link href={`/subscription/${plan.name}`}>
                  <button className="w-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 mt-4 text-white py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                    Get Plan
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
