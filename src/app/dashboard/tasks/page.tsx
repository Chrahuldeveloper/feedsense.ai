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
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Page = () => {
  const searchParams = useSearchParams();

  interface Feedback {
    name: string;
    email: string;
    emotion: string;
    feedback: string;
    parsedFeedback?: { response: string };
  }

  const [websites, setWebsites] = useState<Feedback[]>([]);
  const [HappyCount, setHappyCount] = useState<number>(0);
  const [NeutralCount, setNeutralCount] = useState<number>(0);
  const [SadCount, setSadCount] = useState<number>(0);
  const [toggle, setToggle] = useState(false);

  const getdata = searchParams?.get("feedback")!;
  const getImage = searchParams?.get("image")!;
  const getName = searchParams?.get("name")!;
  const getPlan = searchParams?.get("Plan")!;

  useEffect(() => {
    if (getdata) {
      const data: Feedback[] = JSON.parse(getdata);
      setWebsites(data);

      const happy = data.filter(
        (item) => item.emotion.toLowerCase() === "happy"
      ).length;
      const neutral = data.filter(
        (item) => item.emotion.toLowerCase() === "neutral"
      ).length;
      const sad = data.filter(
        (item) => item.emotion.toLowerCase() === "sad"
      ).length;

      setHappyCount(happy);
      setNeutralCount(neutral);
      setSadCount(sad);
    }
  }, [getdata]);

  const analytics = {
    labels: ["Happy", "Neutral", "Sad"],
    datasets: [
      {
        label: "Feedback Analytics",
        data: [HappyCount, NeutralCount, SadCount],
        backgroundColor: ["#1990ff"],
        borderColor: ["#0096FF	"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="md:hidden bg-[#0e0f11] p-7 w-screen border-b-[1px] border-[#272b2f] flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
        <CiMenuFries
          onClick={() => setToggle(true)}
          size={26}
          color="#9ca3af"
          className="cursor-pointer"
        />
      </nav>

      {/* Main Content */}
      <div className="bg-[#111115] w-full flex overflow-x-clip">
        <SideBar page="Home" />
        <div className="md:w-[100vw] mx-auto md:ml-44 space-y-16 rounded-xl">
          {/* User Info */}
          <div className="overflow-x-auto rounded-xl my-12">
            <div className="flex mx-auto items-center justify-between w-[90vw] md:w-[60vw] bg-[#0e0f12] px-4 py-2 border-[1px] border-[#0e1012]">
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

            {/* Bar Chart */}
            <div className="w-[90vw] md:w-[60vw] mx-auto mb-5 bg-[#0e0f12] p-4 my-10">
              <h2 className="text-gray-300 text-lg font-semibold mb-4">
                Feedback Analytics
              </h2>
              <Bar data={analytics} />
            </div>

            {/* Feedback Table */}
            <table className="border-[1px] border-[#15171b] md:mx-auto w-[98vw] md:w-[60vw] mt-7 divide-y divide-[#15171b] overflow-hidden">
              <thead className="bg-[#0e0f12] border-[1px] border-[#15171b]">
                <tr>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase">
                    Email
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase">
                    Emotion
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase">
                    Feedback
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase">
                    Analysis
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#0e0f12] border-[1px] border-[#15171b]">
                {websites.length > 0 ? (
                  websites.map((site, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#0c0d12] transition-colors duration-300 ease-in-out cursor-pointer"
                    >
                      <td className="py-5 px-6 text-xs text-gray-300">
                        {site.email}
                      </td>
                      <td className="py-5 px-6 text-xs text-gray-300">
                        {site.emotion}
                      </td>
                      <td className="py-5 px-6 w-72 text-xs text-gray-300">
                        {site.feedback}
                      </td>
                      <td
                        className={`py-5 px-6 text-xs text-gray-300 w-60 ${
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

      {/* Mobile Sidebar */}
      {toggle && <MobileSideBar setToggle={setToggle} />}
    </>
  );
};

const PageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Page />
  </Suspense>
);

export default PageWithSuspense;
