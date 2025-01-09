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
      icon: <GoGoal size={24} color="white" />,
      tittle: "Customer-Centric",
      para: "We believe in putting customers first and building solutions that truly serve their needs.",
    },
    {
      icon: <TbBulb size={24} color="white" />,
      tittle: "Innovation",
      para: "We constantly push boundaries to create better ways of handling customer feedback.",
    },
    {
      icon: <FaHandshake size={24} color="white" />,
      tittle: "Collaboration",
      para: "We believe great products are built through effective team collaboration and shared insights.",
    },
    {
      icon: <AiFillThunderbolt size={24} color="white" />,
      tittle: "Efficiency",
      para: "We strive to make product development more efficient and feedback-driven.",
    },
  ];

  return (
    <div className="bg-[#0e0f12] w-full flex flex-col min-h-screen overflow-x-clip">
      <Navbar />

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

        <div className="flex items-center md:items-start justify-center md:flex-row flex-col gap-6 pt-10">
          {data.map((i, id) => {
            return (
              <React.Fragment key={id}>
                <div className="bg-[#17171c] p-5 rounded-lg max-w-xs border-[1px] border-[#15171b] cursor-pointer shadow-xl">
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
