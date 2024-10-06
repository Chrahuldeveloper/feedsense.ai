"use client";

import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import React, { useState } from "react";
import { CiMenuFries } from "react-icons/ci";

const page = () => {
  const [websites, setWebsites] = useState([
    {
      name: "Website 1",
      task: "Make good U",
      status: "Pending",
    },
    {
      name: "Website 2",
      task: "Make good U",
      status: "Pending",
    },
    {
      name: "Website 3",
      task: "Make good U",
      status: "Pending",
    },
    {
      name: "Website 4",
      task: "Make good U",
      status: "Pending",
    },
    {
      name: "Website 5",
      task: "Make good U",
      status: "Pending",
    },
  ]);

  const [toggle, setToggle] = useState(false);

  const handleAction = (idx: number, action: string) => {
    if (action === "Delete") {
      setWebsites(websites.filter((_, index) => index !== idx));
    } else if (action === "Done") {
      setWebsites(
        websites.map((site, index) =>
          index === idx ? { ...site, status: "Done" } : site
        )
      );
    }
  };

  return (
    <>
      <nav className="md:hidden bg-[#0f0d15] p-7 w-screen border-b-[1px] border-neutral-900 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
        <CiMenuFries
          onClick={() => {
            setToggle(true);
          }}
          size={26}
          color="white"
          className="cursor-pointer"
        />
      </nav>
      <div className="bg-[#000000] w-full h-screen flex overflow-x-clip">
        <SideBar />
        <div className="w-full md:w-[90vw] mt-12 px-4 md:px-12 py-6 md:ml-40 space-y-16">
          <div className="overflow-x-auto">
            <table className="text-white w-full table-auto border-[1px] border-neutral-900">
              <thead className="bg-[#0f0d15]">
                <tr className="text-center text-xs">
                  <th className="py-2 px-4">S.No</th>
                  <th className="py-2 px-4">Task Generated</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {websites.map((site, idx) => (
                  <tr
                    key={idx}
                    className={`text-center transition duration-300 ease-in-out ${
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
                        site.status === "Done"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {site.status}
                    </td>
                    <td className="py-2 px-4">
                      <select
                        className="bg-[#0f0d15] text-white text-sm px-2 py-1 border-[1px] border-neutral-800 rounded-md outline-none"
                        defaultValue="Select Action"
                        onChange={(e) => handleAction(idx, e.target.value)}
                      >
                        <option value="Select Action" disabled>
                          Select Action
                        </option>
                        <option value="Done">Done</option>
                        <option value="Delete">Delete</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {toggle ? <MobileSideBar setToggle={setToggle} /> : null}
    </>
  );
};

export default page;
