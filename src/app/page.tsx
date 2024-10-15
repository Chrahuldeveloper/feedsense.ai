import Navbar from "@/components/Navbar";
import React from "react";

export default function page() {
  return (
    <div className="bg-[#131315] w-full min-h-screen">
      <Navbar />
      <div className="flex justify-center flex-col items-center space-y-8">
        <h1 className="text-xl md:text-3xl lg:text-6xl lg:max-w-2xl text-center max-w-sm font-semibold text-white leading-8">
          Boost your design productivity
        </h1>
        <p className="text-[#a2a2a2] max-w-lg text-center">
          Design Maestro is a free extension for Keyboard Maestro app. It lets
          you automate tasks that you repeat hundreds of times each day.
        </p>
        <button className="bg-[#db1a5a]  text-white  py-2 px-20  font-semibold rounded-full  ">
          Get Started
        </button>
      </div>
    </div>
  );
}
