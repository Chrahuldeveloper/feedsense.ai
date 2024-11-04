"use client";
import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BiConfused } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

const Page = () => {
  const searchParams = useSearchParams();

  interface Feedback {
    name: string;
    email: string;
    feedback: string;
    parsedFeedback?: { response: string };
  }

  const [websites, setWebsites] = useState<Feedback[]>([]);
  const getdata = searchParams!.get("feedback")!;
  const getImage = searchParams!.get("image")!;
  const getName = searchParams!.get("name")!;
  const getPlan = searchParams!.get("Plan")!;

  useEffect(() => {
    const data: Feedback[] = JSON.parse(getdata);
    console.log(data);
    setWebsites(data);
  }, [getdata]);

  const [toggle, setToggle] = useState(false);

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
        <div className="md:w-[100vw] mx-auto md:ml-44 space-y-16 rounded-xl">
          <div className="overflow-x-auto rounded-xl mt-12">
            <div className="flex mx-auto items-center justify-between w-[90vw] md:w-[60vw]">
              <div className="flex items-center gap-5">
                <img src={getImage} className="w-12 h-12 rounded-full" alt="" />
                <h1 className="text-xl text-slate-300 font-semibold">
                  {getName}
                </h1>
              </div>
              <Link href="/dashboard">
                <RxCross2 size={25} color="white" />
              </Link>
            </div>
            <table className="mx-auto w-[90vw] md:w-[60vw] mt-7 divide-y divide-stone-900 rounded-lg overflow-hidden">
              <thead className="bg-[#201d24] rounded-lg cursor-pointer">
                <tr>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    SNo
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Analysis
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#161419]">
                {websites.length > 0 ? (
                  websites.map((site, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#141316] transition-colors duration-200 cursor-pointer"
                    >
                      <td className="py-5 px-6 md:px-9 text-xs md:text-sm text-slate-300">
                        {idx + 1}
                      </td>
                      <td className="py-5 px-6 md:px-9 text-xs md:text-sm text-slate-300">
                        {site.name}
                      </td>
                      <td className="py-5 px-6 md:px-9 text-xs md:text-sm text-slate-300">
                        {site.feedback}
                      </td>
                      <td
                        className={`py-5 px-6 md:px-9 text-xs md:text-sm text-slate-300 w-60 ${
                          getPlan === "Basic" ? "blur-sm" : ""
                        }`}
                      >
                        {site?.parsedFeedback?.response?.replace(/"/g, "") ||
                          "No analysis available"}
                      
                          {getPlan}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-5 text-center text-slate-300">
                      <div className="flex flex-col items-center gap-5">
                        <BiConfused size={35} color="white" />
                        <p>No Feedbacks Yet</p>
                      </div>
                    </td>
                  </tr>
                )}
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
