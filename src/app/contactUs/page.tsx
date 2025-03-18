"use client";

import Footer from "@/components/Footer";
import React from "react";

const page = () => {
  return (
    <>
      <div className="bg-[#1a1f2c] w-full overflow-hidden min-h-screen relative">
        <div className="absolute inset-0 bg-[#000000] opacity-95"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 right-96 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full opacity-20 blur-[120px]" />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500 rounded-full opacity-15 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-blue-600 rounded-full opacity-10 blur-[130px]" />
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
