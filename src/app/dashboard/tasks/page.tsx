"use client";
import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();

  interface Feedback {
    name: string;
    email: string;
    feedback: string;
  }

  const [websites, setWebsites] = useState<Feedback[]>([]);
  const getdata = searchParams.get("feedback");

  useEffect(() => {
    const data: Feedback[] = JSON.parse(getdata);

    console.log(data);
    setWebsites(data);
  }, [getdata]);

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
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">email</th>
                  <th className="py-2 px-4">Task</th>
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
                      {site.name}
                    </td>
                    <td className="py-2 px-4 cursor-pointer text-[11px] md:text-sm">
                      {site.email}
                    </td>
                    <td className="py-2 px-4 cursor-pointer text-[11px] md:text-sm">
                      {site.feedback}
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
