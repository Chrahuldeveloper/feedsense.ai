"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import { TiTickOutline } from "react-icons/ti";
import Link from "next/link";
import { IoIosStarOutline } from "react-icons/io";
import Footer from "@/components/Footer";

export default function PricingPage() {
  const Plans = [
    {
      name: "Basic",
      price: "₹450",
      features: [
        "Collect up to 100 feedback",
        "Priority Support",
        "Analytics",
        "Only 3 websites integration",
        "Incentivise Users",
        "3 website widgets",
      ],
      Bill: "Billed monthly",
      para: "That's less than $0.34/day ≈ 2 coffees per month",
    },
    {
      name: "Pro",
      price: "₹2700",
      features: [
        "Unlimited feedback entries",
        "Automated task generation from feedback",
        "Priority Support",
        "Analytics",
        "Unlimited websites",
        "Incentivise Users",
      ],
      Bill: "Billed once every 5 months",
      para: "That's $30/month ≈ $1/day ≈ 6 coffees per month",
    },
  ];

  return (
    <div className="bg-[#000000] w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[30vh] bg-blue-600 rounded-full opacity-20 blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[60vw] h-[30vh] bg-blue-500 rounded-full opacity-15 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[70vw] h-[30vh] bg-blue-400 rounded-full opacity-10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="max-w-5xl  mx-auto relative mt-36 p-5 lg:p-0">
          <div className="text-center space-y-5">
            <p className="bg-white p-2 rounded-full flex items-center justify-center gap-2 text-[11px] font-semibold w-44 mx-auto text-xs">
              <IoIosStarOutline size={20} color="black" />
              SIMPLE PRICING
            </p>
            <h1 className="text-3xl lg:text-5xl text-center font-semibold text-white leading-8 z-50">
              Transform Your Product Journey for <br />{" "}
              <span className=" font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
                – Less Than a Coffee
              </span>{" "}
            </h1>
            <p className="text-[#a2a2a2] max-w-xl mx-auto text-center z-50 text-sm md:text-base">
              Why spend $5 on a daily coffee when you could revolutionize your
              product feedback and development process? Invest in your product's
              future with feedsense.Ai.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 px-6 md:px-10 pb-14 justify-center my-24">
          {Plans.map((plan, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-lg border-[1px] bg-gradient-to-r from-[#000000] via-[black] to-[#1a1e21] border-[#282e32]  transform transition-transform duration-300 hover:scale-105 w-full max-w-md cursor-pointer shadow-2xl "
            >
              <div className=" p-6 space-y-3.5 rounded-t-lg ">
                <h1 className="text-white text-xl font-bold">{plan.name}</h1>
                <p className="text-3xl font-bold text-slate-200">
                  {plan.price}
                </p>
                <p className="font-bold text-slate-300 text-sm">{plan.Bill}</p>
                <p className="text-xs text-slate-300 w-56 font-semibold">
                  {plan.para}
                </p>
              </div>

              <ul className="space-y-5 text-slate-300 p-6 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className=" flex items-start gap-2">
                    <TiTickOutline size={20} className="text-green-500" />
                    <span className="font-semibold text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="p-6 mt-auto">
                <Link href={`/subscription/${plan.name}`}>
                  <button className="w-full bg-gradient-to-r from-[#23282c] via-[#131414] to-[#23282c] mt-4 text-white py-3 font-semibold rounded-lg hover:shadow-lg transition-shadow duration-200 shadow-xl text-sm">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
