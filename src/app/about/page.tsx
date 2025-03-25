"use client";

import Navbar from "@/components/Navbar";
import React from "react";
import { GoGoal } from "react-icons/go";
import { TbBulb } from "react-icons/tb";
import { FaHandshake } from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import Footer from "@/components/Footer";
import useAuth from "@/hooks/CurrentUser";
import Link from "next/link";

export default function page() {
  const { user, loading } = useAuth();

  const data = [
    {
      icon: <GoGoal size={24} color="#00a3ff" />,
      tittle: "Customer-Centric",
      para: "We prioritize user feedback, ensuring businesses gain valuable insights to enhance their products.",
    },
    {
      icon: <TbBulb size={24} color="#00a3ff" />,
      tittle: "Innovation",
      para: "We leverage AI to transform raw feedback into actionable insights, driving smarter decisions.",
    },
    {
      icon: <FaHandshake size={24} color="#00a3ff" />,
      tittle: "Collaboration",
      para: "We enable teams to work efficiently by centralizing and analyzing feedback for data-driven improvements.",
    },
    {
      icon: <AiFillThunderbolt size={24} color="#00a3ff" />,
      tittle: "Efficiency",
      para: "Our AI-powered platform streamlines feedback analysis, reducing guesswork and saving time.",
    },
  ];
  

  return (
    <div className="bg-[#1c2031] w-full flex flex-col min-h-screen overflow-x-clip">
      <Navbar />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-96 h-72 bg-[#172d42] opacity-40 blur-3xl rounded-full"></div>
        <div className="absolute bottom-1/3 right-20 w-60 h-60 bg-[#172d42] opacity-30 blur-3xl rounded-full"></div>
        <div className="absolute top-10 right-40 w-32 h-72 bg-[#172d42] opacity-20 blur-2xl rounded-full"></div>
        <div className="absolute inset-0 bg-grid bg-opacity-10 pointer-events-none"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="max-w-5xl  mx-auto relative mt-36 p-5 lg:p-0">
          <div className="text-center space-y-5">
            <p className="bg-white p-2 rounded-full flex items-center justify-center gap-2 text-[11px] font-semibold w-44 mx-auto text-xs">
              Our Story
            </p>
            <h1 className="text-3xl lg:text-5xl text-center font-semibold text-white leading-8 z-50">
              Transforming{" "}
              <span className=" font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
                Ideas
              </span>{" "}
              Into Reality ✨
            </h1>
            <p className="text-[#a2a2a2] max-w-xl mx-auto text-center z-50 text-sm md:text-base">
              We're a passionate team of innovators dedicated to building
              solutions that make a difference. Since 2020, we've been helping
              businesses transform their digital presence.
            </p>
            <button className="bg-white text-black py-2 px-8 md:px-16 lg:px-20 font-semibold rounded-lg text-sm">
              <Link href={`${user ? "/dashboard" : "/login"}`} className="">
                Get Started
              </Link>
            </button>
          </div>
        </div>
      </div>

      <div className=" p-5 w-full mx-auto my-28 space-y-8">
        <p className="bg-white p-2 rounded-full flex items-center justify-center gap-2 text-[11px] font-semibold w-44 mx-auto text-xs">
          Our Values
        </p>
        <h1 className="text-3xl lg:text-4xl text-center font-semibold text-white leading-8 z-50 ">
          The Principles That{" "}
          <span className=" font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            Guide
          </span>{" "}
          Our Journey ✨
        </h1>

        <div className="flex flex-col items-center justify-center gap-6 pt-10">
          {data.map((i, id) => {
            return (
              <React.Fragment key={id}>
                <div className="bg-[#1a2030] max-w-xl p-5 rounded-lg border-[1px] border-[#2f3a49] cursor-pointer shadow-xl">
                  {i.icon}
                  <div className="space-y-3 mt-3">
                    <h1 className="text-white font-semibold">{i.tittle}</h1>
                    <p className="text-slate-300 text-sm">{i.para}</p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div>
          <p className="text-white text-center max-w-sm mx-auto">
            <i>
              "We believe that the best products are built when teams truly
              understand and act on their customers' needs."
            </i>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
