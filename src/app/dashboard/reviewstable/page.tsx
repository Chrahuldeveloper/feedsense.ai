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
  ]);

  interface Review {
    taskName: string;
    taskStatus: "Pending" | "In Progress" | "Completed";
  }

  const handleStatusChange = (
    index: number,
    newStatus: Review["taskStatus"]
  ) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].taskStatus = newStatus;
    setReviews(updatedReviews);
  };

  return (
    <div className="bg-[#000000] w-full h-screen flex gap-5 overflow-x-clip">
      <SideBar />
      <div className="w-[88vw] md:w-[80vw] mx-auto mt-16">
        <table className="text-white w-full table-auto py-6 border-[1px] border-neutral-900">
          <thead className="bg-[#0f0d15]">
            <tr className="text-center text-xs">
              <th className="py-2 px-4 text-xs">S.No</th>
              <th className="py-2 px-4 text-xs">Task Name</th>
              <th className="py-2 px-4 text-xs">Task Status</th>
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
                <td className="py-2 px-4 text-[11px] md:text-sm ">
                  <select
                    onChange={(e) =>
                      handleStatusChange(
                        index,
                        e.target.value as Review["taskStatus"]
                      )
                    }
                    value={review.taskStatus}
                    className="bg-[#0f0d15] text-white  rounded-lg px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
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
