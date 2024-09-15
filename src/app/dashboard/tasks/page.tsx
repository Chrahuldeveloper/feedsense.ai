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
      Piority: "Low",
    },
    {
      name: "Website 5",
      task: "Make good U",
      Piority: "Low",
    },
    {
      name: "Website 5",
      task: "Make good U",
      Piority: "Low",
    },
    {
      name: "Website 5",
      task: "Make good U",
      Piority: "Medium",
    },
    {
      name: "Website 5",
      task: "Make good U",
      Piority: "High",
    },
    {
      name: "Website 5",
      task: "Make good U",
      Piority: "High",
    },
    {
      name: "Website 5",
      task: "Make good U",
      Piority: "High",
    },
    {
      name: "Website 5",
      task: "Make good U",
      Piority: "Low",
    },
  ];

  type dataItem = {
    label: String;
    number: String;
  };

  const data: dataItem[] = [
    {
      label: "Total website",
      number: "20",
    },
    {
      label: "Total website",
      number: "20",
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
        <div className="w-full md:w-[90vw]  mt-12 px-4 md:px-12 py-6 md:ml-40 space-y-16">
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center  px-8">
            {data.map((itm, idx) => {
              return (
                <div
                  key={idx}
                  className="bg-[#0f0d15] p-4 rounded-lg md:w-[25vw] w-[65vw]  cursor-pointer border-[1px] border-neutral-900"
                >
                  <div className="text-white space-y-3 text-center">
                    <h1>{itm.label}</h1>
                    <p>{itm.number}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="text-white w-full table-auto  border-[1px] border-neutral-900 ">
              <thead className="bg-[#0f0d15]">
                <tr className="text-center text-xs">
                  <th className="py-2 px-4">S.No</th>
                  <th className="py-2 px-4">Task Generated</th>
                  <th className="py-2 px-4">Piority</th>
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
                    <td
                      className={`py-2 px-4 cursor-pointer text-[11px] md:text-sm ${
                        site.Piority === "Low"
                          ? "text-blue-600"
                          : site.Piority === "High"
                          ? "text-red-600"
                          : site.Piority === "Medium"
                          ? "text-yellow-600"
                          : null
                      }`}
                    >
                      {site.Piority}
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
