import React, { useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";

const Addintegration = () => {
  const [toogle, settoogle] = useState(false);

  return (
    <>
      <div className="md:ml-80">
        <nav className="md:hidden bg-[#0f0d15] p-7 w-screen border-b-[1px] border-neutral-900 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => {
              settoogle(true);
            }}
          />
        </nav>

        {toogle ? <MobileSideBar settoogle={settoogle} /> : null}

        <div className="space-y-5 lg:space-y-8 text-slate-300 mt-14 p-8">
          <h1 className="text-3xl font-bold  lg:text-5xl">Add your website</h1>
          <p className="max-w-sm md:text-lg md:max-w-md">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            consectetur enim praesentium.
          </p>
          <button className="bg-blue-500 text-white px-5 rounded-lg text-sm py-2 cursor-pointer hover:bg-blue-600 ease-in-out duration-500 font-semibold">
            Start Integration
          </button>
        </div>
      </div>
    </>
  );
};

export default Addintegration;
