"use client";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const Table = () => {
  const websites = [
    {
      name: "Website 1",
      feedbackCount: "19",
      taskGenerated: "Yes",
      taskStatus: "In Progress",
      feedbackRating: 4,
    },
    {
      name: "Website 2",
      feedbackCount: "15",
      taskGenerated: "No",
      taskStatus: "Pending",
      feedbackRating: 3,
    },
    {
      name: "Website 3",
      feedbackCount: "22",
      taskGenerated: "Yes",
      taskStatus: "Completed",
      feedbackRating: 5,
    },
    {
      name: "Website 4",
      feedbackCount: "30",
      taskGenerated: "Yes",
      taskStatus: "In Progress",
      feedbackRating: 4,
    },
    {
      name: "Website 5",
      feedbackCount: "10",
      taskGenerated: "No",
      taskStatus: "Pending",
      feedbackRating: 2,
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

  return (
    <>
      <div className="px-8 py-8 md:ml-36">
        <h1 className="text-2xl font-semibold text-white mb-4">
          Your Websites
        </h1>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-10">
          {data.map((itm, idx) => {
            return (
              <div
                key={idx}
                className="bg-[#0f0d15] p-4 rounded-lg w-[13vw] cursor-pointer"
              >
                <div className="text-white space-y-3">
                  <h1>{itm.label}</h1>
                  <p>{itm.number}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full md:w-[85vw] mx-auto mt-12">
          <div className="overflow-x-auto">
            <table className="text-white w-full table-auto  border-[1px] border-neutral-900 ">
              <thead className="bg-[#0f0d15]">
                <tr className="text-center text-xs">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Feedback Count</th>
                  <th className="py-2 px-4">Task Generated</th>
                  <th className="py-2 px-4">Feedback Rating</th>
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
                    <td className="py-2 px-4 cursor-pointer text-[11px] md:text-sm">
                      {site.feedbackRating}/5
                    </td>
                    <td className="py-2 px-4 cursor-pointer">
                      <button className="bg-blue-500 text-white px-5 rounded-full text-sm py-1 cursor-pointer hover:bg-blue-600">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-5 justify-center items-center mt-14">
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
