"use client";

import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import React, { useEffect, useState, Suspense } from "react";
import { CiMenuFries } from "react-icons/ci";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BiConfused } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

const Page = () => {
  const searchParams = useSearchParams();

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
  );

  interface Feedback {
    name: string;
    email: string;
    emotion: string;
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

  const analytics = {
    labels: ["Happy", "Neutral", "Sad"],
    datasets: [
      {
        label: "Dashboard Data",
        data: [10, 20, 30],
        borderColor: "#2967ec",
        pointBackgroundColor: "#2967ec",
        pointBorderColor: "#2967ec",
        borderWidth: 1,
      },
    ],
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
          color="#9ca3af"
          className="cursor-pointer"
        />
      </nav>

      <div className="bg-[black] w-full  flex overflow-x-clip">
        <SideBar page="Home" />
        <div className="md:w-[100vw] mx-auto md:ml-44 space-y-16 rounded-xl ">
          <div className="overflow-x-auto rounded-xl my-12">
            <div className="flex mx-auto items-center justify-between w-[90vw] md:w-[60vw] bg-[#07070b] px-4 py-2 border-[1px] border-[#0e1012]">
              <div className="flex items-center gap-5">
                <Image
                  src={getImage}
                  alt={getName}
                  className="w-12 h-12 rounded-full"
                  width={48}
                  height={48}
                />
                <h1 className="text-xl text-gray-300 font-semibold">
                  {getName}
                </h1>
              </div>
              <Link href="/dashboard">
                <RxCross2 size={25} color="#9ca3af" />
              </Link>
            </div>
            <table className=" border-[1px] border-[#15171b] md:mx-auto w-[98vw] md:w-[60vw] mt-7 divide-y divide-[#15171b]  overflow-hidden ">
              <thead className="bg-[#04050a]  cursor-pointer border-[1px] border-[#15171b]">
                <tr>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Emotion
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Analysis
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#04050a] border-[1px] border-[#15171b]">
                {websites.length > 0 ? (
                  websites.map((site, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#0c0d12] transition-colors duration-300 ease-in-out cursor-pointer"
                    >
                      <td className="py-5 px-6 md:px-9 text-xs md:text-sm text-gray-300">
                        {site.email}
                      </td>
                      <td className="py-5 px-6 md:px-9 text-xs md:text-sm text-gray-300">
                        {site.emotion}
                      </td>
                      <td className="py-5 px-6 w-72 md:px-9 text-xs md:text-sm text-gray-300">
                        {site.feedback}
                      </td>
                      <td
                        className={`py-5 px-6 md:px-9 text-xs md:text-sm text-gray-300 w-60 ${
                          getPlan === "Basic" ? "blur-sm" : ""
                        }`}
                      >
                        {site?.parsedFeedback?.response?.replace(/"/g, "") ||
                          "No analysis available"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-5 text-center text-slate-300">
                      <div className="flex flex-col items-center gap-5">
                        <BiConfused size={40} color="#9ca3af" />
                        <p className=" text-slate-300">No Feedbacks Yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="w-[90vw] md:w-[50vw] mx-auto mb-5">
            <h2 className="text-gray-300 text-lg font-semibold mb-4">
              Bar Graph
            </h2>
            <Line data={analytics} />
          </div>
        </div>
      </div>

      {toggle ? <MobileSideBar setToggle={setToggle} /> : null}
    </>
  );
};

const PageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Page />
  </Suspense>
);

export default PageWithSuspense;
