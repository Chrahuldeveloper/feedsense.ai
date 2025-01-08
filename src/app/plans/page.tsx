"use client";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { TiTickOutline } from "react-icons/ti";
import Link from "next/link";
import { IoIosStarOutline } from "react-icons/io";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";
import TermsConditions from "@/components/TermsConditions";

export default function PricingPage() {
  const Plans = [
    {
      name: "Basic",
      price: "$5",
      features: [
        "Collect up to 100 feedback",
        "Email support",
        "Analytics",
        "Only 3 websites integration",
        "Incentivise Users",
      ],
      Bill: "Billed monthly",
      para: "That's less than $0.34/day ≈ 2 coffees per month",
    },
    {
      name: "Pro",
      price: "$25",
      features: [
        "Unlimited feedback entries",
        "Automated task generation from feedback",
        "Priority email support",
        "Analytics",
        "Unlimited websites",
        "Incentivise Users",
      ],
      Bill: "Billed once every 5 months",
      para: "That's $30/month ≈ $1/day ≈ 6 coffees per month",
    },
  ];

  const [istoogle, setistoggle] = useState(false);

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

      {istoogle ? <TermsConditions setistoggle={setistoggle} /> : null}

      <footer className="bg-[#121212] text-white pt-10 px-4">
        <div className=" mx-auto flex flex-col md:flex-row items-center justify-around">
          <div className="text-center md:text-left mb-6 md:mb-0 space-y-5">
            <h1 className="text-2xl font-semibold">TaskFeed</h1>
            <p className="text-sm mt-2 text-gray-400 max-w-sm">
              Centralize and analyze feedback to continually improve your
              websites and business services.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-20">
            <div className="flex flex-col items-center mt-6 md:mt-0 ">
              <p
                onClick={() => {
                  setistoggle(true);
                }}
                className="font-semibold cursor-pointer text-lg"
              >
                Terms and Conditions
              </p>
              <div className="flex flex-col gap-5 text-sm mt-3">
                <Link href="/about">About</Link>
                <Link href="/services">Services</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/faq">FAQ</Link>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-5">
              <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
              <Link href="https://twitter.com/" aria-label="Twitter">
                <FaXTwitter size={24} className="hover:text-gray-400" />
              </Link>
              <Link href="https://instagram.com/" aria-label="Instagram">
                <FiInstagram size={24} className="hover:text-gray-400" />
              </Link>
              <Link href="https://facebook.com/" aria-label="Facebook">
                <FaFacebookF size={24} className="hover:text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 py-5 pt-16">
          © {new Date().getFullYear()} FeedSense Ai. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
