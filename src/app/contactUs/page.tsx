"use client";

import Footer from "@/components/Footer";
import React from "react";

const page = () => {
  return (
    <>
      <div className="bg-[#1c2031] w-full overflow-hidden min-h-screen relative">
        <div className="absolute inset-0 bg-[#1c2031] opacity-95"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-96 h-72 bg-[#172d42] opacity-40 blur-3xl rounded-full"></div>
          <div className="absolute bottom-1/3 right-20 w-60 h-60 bg-[#172d42] opacity-30 blur-3xl rounded-full"></div>
          <div className="absolute top-10 right-40 w-32 h-72 bg-[#172d42] opacity-20 blur-2xl rounded-full"></div>
          <div className="absolute inset-0 bg-grid bg-opacity-10 pointer-events-none"></div>
        </div>

        <div className="relative z-10 bg-[#151923] p-8 rounded-lg w-[80vw] md:w-[35vw] mx-auto border-[#282e32] border-[1px] shadow-2xl mt-10 md:mt-10">
          <div>
            <h1 className="text-white text-2xl font-semibold">Contact Us</h1>
          </div>

          <div>
            <div className="space-y-6 mt-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-300"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="bg-[#20242e] border-[1px] border-[#282e32] pl-4 pr-4 py-2 w-full rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="bg-[#20242e] border-[1px] border-[#282e32] pl-4 pr-4 py-2 w-full rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="bg-[#20242e] border-[1px] border-[#282e32] pl-4 pr-4 py-2 w-full rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your message"
                  rows={8}
                  required
                />
              </div>
              <button className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 mt-8 text-white py-2 px-4 w-full font-semibold rounded-lg  transition-colors flex items-center justify-center">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default page;
