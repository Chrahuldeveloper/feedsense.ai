"use client";
import SideBar from "@/components/SideBar";
import React, { useState } from "react";

const ReviewsTable = () => {
  const [reviews, setReviews] = useState([
    {
      taskName: "Fix UI issues",
      taskStatus: "In Progress",
    },
    {
      taskName: "Add new feature",
      taskStatus: "Pending",
    },
    {
      taskName: "Optimize loading speed",
      taskStatus: "Completed",
    },
    {
      taskName: "Improve SEO",
      taskStatus: "Pending",
    },
    {
      taskName: "Fix UI issues",
      taskStatus: "In Progress",
    },
    {
      taskName: "Add new feature",
      taskStatus: "Pending",
    },
    {
      taskName: "Optimize loading speed",
      taskStatus: "Completed",
    },
    {
      taskName: "Improve SEO",
      taskStatus: "Pending",
    },
    {
      taskName: "Fix UI issues",
      taskStatus: "In Progress",
    },
    {
      taskName: "Add new feature",
      taskStatus: "Pending",
    },
    {
      taskName: "Optimize loading speed",
      taskStatus: "Completed",
    },
    {
      taskName: "Improve SEO",
      taskStatus: "Pending",
    },
  ]);

  return (
    <div className="bg-[#000000] w-full h-screen flex gap-5 overflow-x-clip ">
      <SideBar />
      <div className="w-[89vw] md:w-[60vw] mx-auto my-12 md:ml-80">
        <table className="text-white w-full table-auto py-6 border-[1px] border-neutral-900">
          <thead className="bg-[#0f0d15]">
            <tr className="text-center text-xs">
              <th className="py-2 px-4 text-xs">S.No</th>
              <th className="py-2 px-4 text-xs">Task Name</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr
                key={index}
                className={`text-center transition duration-300 ease-in-out ${
                  index % 2 !== 0 ? "bg-[#0f0d15]" : ""
                }`}
              >
                <td className="py-2 px-4 text-[11px] md:text-sm ">
                  {index + 1}
                </td>
                <td className="py-2 px-4 text-[11px] md:text-sm ">
                  {review.taskName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsTable;
