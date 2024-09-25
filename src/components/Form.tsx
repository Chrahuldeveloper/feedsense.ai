"use client";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const Form = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="">
        <button
          className={`fixed right-[-1.5rem] text-lg top-1/2 p-3 rotate-90 transform translate-y-[-50%] bg-[#0d0d13] text-slate-300   focus:outline-none z-50 ${
            isOpen ? "hidden" : "block"
          }`}
          onClick={toggleForm}
        >
          Feedback
        </button>

        <div
          className={`fixed right-0   w-[85vw] md:w-[30vw] top-16 p-5 bg-[#131b2376] rounded-lg shadow-lg z-50 transform transition-transform duration-500 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end">
            <RxCross2
              onClick={toggleForm}
              size={25}
              color="white"
              cursor={"pointer"}
            />
          </div>
          <div className="text-center">
            <h1 className="text-slate-300 text-xl font-bold">Feedback</h1>
          </div>
          <div className="space-y-2 mt-6">
            <h1 className="font-semibold text-slate-300">Name*</h1>
            <input
              type="text"
              autoComplete="false"
              className="bg-[#0d0d13] border-[1px] border-neutral-900 px-3 py-2 outline-none w-full rounded-lg text-slate-300"
            />
          </div>
          <div className="space-y-2 mt-6">
            <h1 className="font-semibold text-slate-300">Email*</h1>
            <input
              type="text"
              autoComplete="false"
              className="bg-[#0d0d13] border-[1px] border-neutral-900 px-3 py-2 outline-none w-full rounded-lg text-slate-300"
            />
          </div>
          <div className="space-y-2 mt-6">
            <h1 className="font-semibold text-slate-300">Feedback*</h1>
            <textarea
              autoComplete="false"
              cols={20}
              rows={5}
              className="bg-[#0d0d13] border-[1px] border-neutral-900 px-3 py-2 outline-none w-full rounded-lg text-slate-300"
            />
          </div>
          <div className="mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:brightness-75 ease-in-out duration-300">
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
