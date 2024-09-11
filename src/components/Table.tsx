"use client";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const Navbar = () => {
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

  return (
    <>
      <div className="px-8 py-8">
        <h1 className="text-2xl font-semibold text-white mb-4">
          Your Websites
        </h1>
        <div className="w-[80vw] mx-auto mt-7">
          <div className="flex gap-5 justify-center items-center mb-6">
            <FaAngleLeft size={20} color="white" cursor={"pointer"} />
            {[1, 2, 4, 5, 6, 7, 8, 9, 10].map((i, idx) => (
              <div className="flex items-center" key={idx}>
                <h1 className="text-white cursor-pointer">{i}</h1>
              </div>
            ))}
            <FaAngleRight size={20} color="white" cursor={"pointer"} />
          </div>

          <table className="text-white w-[80vw] mx-auto table-auto mt-10">
            <thead className="bg-[#0f0d15] py-2">
              <tr className="text-center">
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
                  className={`text-center ${
                    idx % 2 !== 0 ? "bg-[#0f0d15]" : ""
                  }`}
                >
                  <td className="py-2 px-4">{site.name}</td>
                  <td className="py-2 px-4">{site.feedbackCount}</td>
                  <td className="py-2 px-4">{site.taskStatus}</td>
                  <td className="py-2 px-4">{site.feedbackRating}/5</td>
                  <td className="py-2 px-4">
                    <button className="bg-blue-500 text-white  px-5 rounded-full text-sm py-1">
                      View Task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Navbar;
