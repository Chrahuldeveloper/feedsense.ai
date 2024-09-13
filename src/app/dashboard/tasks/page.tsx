"use client";

import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import React, { useState } from "react";
import { CiMenuFries } from "react-icons/ci";

const page = () => {
  const websites = [
    {
      name: "Website 5",
      task: "Make good U",
    },
    {
      name: "Website 5",
      task: "Make good U",
    },
    {
      name: "Website 5",
      task: "Make good U",
    },
    {
      name: "Website 5",
      task: "Make good U",
    },
    {
      name: "Website 5",
      task: "Make good U",
    },
    {
      name: "Website 5",
      task: "Make good U",
    },
    {
      name: "Website 5",
      task: "Make good U",
    },
    {
      name: "Website 5",
      task: "Make good U",
    },
  ];

  const [toogle, settoogle] = useState(false);

  return (
    <>
      <nav className="md:hidden bg-[#0f0d15] p-7 w-screen border-b-[1px] border-neutral-900 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
        <CiMenuFries
          onClick={() => {
            settoogle(true);
          }}
          size={26}
          color="white"
          className="cursor-pointer"
        />
      </nav>
      <div className="bg-[#000000] w-full h-screen flex overflow-x-clip">
        <SideBar setsection={""} />

        <div className="w-full md:w-[90vw]  mt-12 px-4 md:px-12 py-6 md:ml-40">
          <div className="overflow-x-auto">
            <table className="text-white w-full table-auto  border-[1px] border-neutral-900 ">
              <thead className="bg-[#0f0d15]">
                <tr className="text-center text-xs">
                  <th className="py-2 px-4">S.No</th>
                  <th className="py-2 px-4">Task Generated</th>
                </tr>
              </thead>
              <tbody>
                {websites.map((site, idx) => (
                  <tr
                    key={idx}
                    className={`text-center transition duration-300 ease-in-out  ${
                      idx % 2 !== 0 ? "bg-[#0f0d15]" : ""
                    }`}
                  >
                    <td className="py-2 px-4 cursor-pointer text-[11px] md:text-sm">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-4 cursor-pointer text-[11px] md:text-sm">
                      {site.task}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {toogle ? <MobileSideBar settoogle={settoogle} /> : null}
    </>
  );
};

export default page;
