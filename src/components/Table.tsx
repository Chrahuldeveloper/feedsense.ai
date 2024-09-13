"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";

const Table = () => {
  const websites = [
    {
      name: "Website 1",
      feedbackCount: "19",
      taskGenerated: "Yes",
      taskStatus: "In Progress",
    },
    {
      name: "Website 2",
      feedbackCount: "15",
      taskGenerated: "No",
      taskStatus: "Pending",
    },
    {
      name: "Website 3",
      feedbackCount: "22",
      taskGenerated: "Yes",
      taskStatus: "Completed",
    },
    {
      name: "Website 4",
      feedbackCount: "30",
      taskGenerated: "Yes",
      taskStatus: "In Progress",
    },
    {
      name: "Website 5",
      feedbackCount: "10",
      taskGenerated: "No",
      taskStatus: "Pending",
    },
    {
      name: "Website 3",
      feedbackCount: "22",
      taskGenerated: "Yes",
      taskStatus: "Completed",
    },
    {
      name: "Website 4",
      feedbackCount: "30",
      taskGenerated: "Yes",
      taskStatus: "In Progress",
    },
    {
      name: "Website 5",
      feedbackCount: "10",
      taskGenerated: "No",
      taskStatus: "Pending",
    },
    {
      name: "Website 3",
      feedbackCount: "22",
      taskGenerated: "Yes",
      taskStatus: "Completed",
    },
    {
      name: "Website 4",
      feedbackCount: "30",
      taskGenerated: "Yes",
      taskStatus: "In Progress",
    },
    {
      name: "Website 5",
      feedbackCount: "10",
      taskGenerated: "No",
      taskStatus: "Pending",
    },
    {
      name: "Website 3",
      feedbackCount: "22",
      taskGenerated: "Yes",
      taskStatus: "Completed",
    },
    {
      name: "Website 4",
      feedbackCount: "30",
      taskGenerated: "Yes",
      taskStatus: "In Progress",
    },
    {
      name: "Website 5",
      feedbackCount: "10",
      taskGenerated: "No",
      taskStatus: "Pending",
    },
    {
      name: "Website 3",
      feedbackCount: "22",
      taskGenerated: "Yes",
      taskStatus: "Completed",
    },
    {
      name: "Website 4",
      feedbackCount: "30",
      taskGenerated: "Yes",
      taskStatus: "In Progress",
    },
    {
      name: "Website 5",
      feedbackCount: "10",
      taskGenerated: "No",
      taskStatus: "Pending",
    },
  ];

  const data = [
    {
      label: "Total website",
      number: "20",
    },
    {
      label: "Total website",
      number: "20",
    },
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
      <div className=" md:ml-40">
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

        <h1 className="text-2xl font-semibold text-white mb-4 px-8 py-6">
          Your DashBoard
        </h1>

        {toogle ? <MobileSideBar settoogle={settoogle} /> : null}

        <div className="flex flex-col md:flex-row gap-5 justify-center items-center mt-7 px-8">
          {data.map((itm, idx) => {
            return (
              <div
                key={idx}
                className="bg-[#0f0d15] p-4 rounded-lg md:w-[15vw] w-[50vw]  cursor-pointer border-[1px] border-neutral-900"
              >
                <div className="text-white space-y-3 text-center">
                  <h1>{itm.label}</h1>
                  <p>{itm.number}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full md:w-[90vw]  mt-12 px-12 py-6">
          <div className="overflow-x-auto">
            <table className="text-white w-full table-auto  border-[1px] border-neutral-900 ">
              <thead className="bg-[#0f0d15]">
                <tr className="text-center text-xs">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Feedback Count</th>
                  <th className="py-2 px-4">Task Generated</th>
                  <th className="py-2 px-4">Action</th>
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
                      {site.name}
                    </td>
                    <td className="py-2 px-4 cursor-pointer text-[11px] md:text-sm">
                      {site.feedbackCount}
                    </td>
                    <td
                      className={`py-2 px-4 cursor-pointer text-[11px] md:text-sm ${
                        site.taskStatus === "Pending"
                          ? "text-red-500"
                          : site.taskStatus === "Completed"
                          ? "text-green-500"
                          : site.taskStatus === "In Progress"
                          ? "text-blue-500"
                          : ""
                      }`}
                    >
                      • {site.taskStatus}
                    </td>

                    <td className="py-2 px-4 cursor-pointer">
                      <Link href="/dashboard/reviewstable">
                        <button className="bg-blue-500 text-white px-5 rounded-full text-xs py-1 cursor-pointer hover:bg-blue-600">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-5 justify-center items-center mt-14 px-8 py-8">
              <FaAngleLeft size={20} color="white" cursor={"pointer"} />
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div className="flex items-center" key={i}>
                  <h1 className="text-white cursor-pointer">{i}</h1>
                </div>
              ))}
              <FaAngleRight size={20} color="white" cursor={"pointer"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
