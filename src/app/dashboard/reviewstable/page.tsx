import SideBar from "@/components/SideBar";
import React from "react";

const ReviewsTable = () => {
  const reviews = [
    {
      name: "Website A",
      feedbackCount: "5",
      taskGenerated: "Yes",
      feedbackRating: 4,
    },
    {
      name: "Website B",
      feedbackCount: "3",
      taskGenerated: "No",
      feedbackRating: 2,
    },
    {
      name: "Website C",
      feedbackCount: "10",
      taskGenerated: "Yes",
      feedbackRating: 5,
    },
    {
      name: "Website D",
      feedbackCount: "7",
      taskGenerated: "No",
      feedbackRating: 3,
    },
  ];

  return (
    <div className="bg-[#000000] w-full h-screen flex gap-5 overflow-x-clip">
      <SideBar />
      <div className="w-full md:w-[85vw] mx-auto mt-10">
        <table className="text-white w-full table-auto py-6">
          <thead className="bg-[#0f0d15]">
            <tr className="text-center text-xs">
              <th className="py-2 px-4 text-xs">Name</th>
              <th className="py-2 px-4 text-xs">Feedback Count</th>
              <th className="py-2 px-4 text-xs">Task Generated</th>
              <th className="py-2 px-4 text-xs">Feedback Rating</th>
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
                  {review.name}
                </td>
                <td className="py-2 px-4 text-[11px] md:text-sm ">
                  {review.feedbackCount}
                </td>
                <td className="py-2 px-4 text-[11px] md:text-sm ">
                  {review.taskGenerated}
                </td>
                <td className="py-2 px-4 text-[11px] md:text-sm ">
                  {review.feedbackRating}/5
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
