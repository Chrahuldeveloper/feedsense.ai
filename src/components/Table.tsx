"use client";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const Navbar = () => {
  return (
    <>
      <div className="px-8 py-8">
        <h1 className="text-2xl font-semibold text-white">Your Websites</h1>
        <div className=" w-[80vw] mx-auto mt-6">
          <div className="flex gap-5 justify-center items-center">
            <FaAngleLeft size={20} color="white" cursor={"pointer"} />
            {[1, 2, 4, 5, 6, 7, 8, 9, 10].map((i, idx) => {
              return (
                <div className="flex items-center" key={idx}>
                  <h1 className="text-white cursor-pointer ">{i}</h1>
                </div>
              );
            })}
            <FaAngleRight size={20} color="white" cursor={"pointer"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
