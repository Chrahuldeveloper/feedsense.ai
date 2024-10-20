"use client";
import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();

  interface Feedback {
    name: string;
    email: string;
    feedback: string;
  }

  const [websites, setWebsites] = useState<Feedback[]>([]);
  const getdata = searchParams!.get("feedback")!;

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
      <nav className="md:hidden bg-[#0e0f11] p-7 w-screen border-b-[1px] border-[#272b2f] flex justify-between items-center">
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

      <div className="bg-[#0e0f11] w-full h-screen flex overflow-x-clip">
        <SideBar page="Home" />
        <div className="md:w-[100vw] mx-auto  md:ml-44 space-y-16 rounded-xl">
          <div className="overflow-x-auto rounded-xl mt-16">
            <table className="mx-auto w-[40vw] md:w-[64vw] divide-y divide-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-[#1a1a1a] rounded-lg">
                <tr>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Task</th>
                  <th className="py-3 px-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-[#121212] divide-y divide-gray-800">
                {websites?.map((site, idx) => (
                  <tr key={idx} className="hover:bg-[#1a1a1a] transition-colors duration-200">
                    <td className="py-4 px-5 md:px-9 text-xs  text-slate-300 ">{site.name}</td>
                    <td className="py-4 px-5 md:px-9 text-xs  text-slate-300 ">{site.email}</td>
                    <td className="py-4 px-5 md:px-9 text-xs  text-slate-300 ">{site.feedback}</td>
                    <td className="py-4 px-4 md:px-3">
                      <select
                        className="bg-[#272c2e] text-xs text-white  px-2 py-1 border-[1px] border-stone-800 rounded-md outline-none"
                        defaultValue="Select Action"
                        onChange={(e) => handleAction(idx, e.target.value)}
                      >
                        <option value="Select Action" disabled>Select Action</option>
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

export default Page;
