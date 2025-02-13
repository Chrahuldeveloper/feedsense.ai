"use client";

import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import React, { useEffect, useState, Suspense } from "react";
import { CiMenuFries } from "react-icons/ci";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "@/components/Loader";
import { FaRegCircleStop } from "react-icons/fa6";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Page = () => {
  interface User {
    uid: string;
  }

  const searchParams = useSearchParams();

  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };

  interface Feedback {
    // name: string;
    // email: string;
    emotion: string;
    Rating: number;
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
  const TotalFeedback = searchParams?.get("TotalFeedback")!;

  console.log(TotalFeedback);

  const db = new dbService();

  const [isloading, setisloading] = useState<boolean>(false);

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
      {isloading ? <Loader message="Deleting..." /> : null}
      {/* Navigation Bar */}
      <nav className="md:hidden bg-[#0e0f11] p-7 w-screen border-b-[1px] border-[#272b2f] flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-300">FeedSense.Ai</h1>
        <CiMenuFries
          onClick={() => setToggle(true)}
          size={26}
          color="#9ca3af"
          className="cursor-pointer"
        />
      </nav>

      {/* Main Content */}
      <div className="bg-[#0e0f12] w-full flex overflow-x-clip">
        <SideBar page="Home" />
        <div className="md:w-[100vw] mx-auto md:ml-44 space-y-16 rounded-xl">
          {/* User Info */}
          <div className="overflow-x-auto rounded-xl my-12">
            <div className="flex mx-auto items-center justify-between w-full md:w-[60vw] bg-[#111115] px-4 py-2 border-[1px] border-[#0e1012]">
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

            <table className="border border-[#15171b] md:mx-auto w-[98vw] md:w-[60vw] mt-7 divide-y divide-[#15171b] overflow-hidden">
              <thead className="bg-[#111115]">
                <tr>
                  <th
                    className={`py-4 px-4 text-center text-xs font-medium text-gray-400 uppercase ${
                      getPlan === "Basic" ? "blur-md cursor-not-allowed" : ""
                    }`}
                  >
                    S.No
                  </th>
                  <th
                    className={`py-4 px-4 text-center text-xs font-medium text-gray-400 uppercase ${
                      getPlan === "Basic" ? "blur-md cursor-not-allowed" : ""
                    }`}
                  >
                    Analysis
                  </th>
                  <th
                    className={`py-4 px-4 text-center text-xs font-medium text-gray-400 uppercase ${
                      getPlan === "Basic" ? "blur-md cursor-not-allowed" : ""
                    }`}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody
                className={`bg-[#111115] ${
                  getPlan === "Basic" ? "blur-md cursor-not-allowed" : ""
                }`}
              >
                {websites.length > 0 ? (
                  websites.map((site, idx) =>
                    site?.parsedFeedback?.response ? (
                      <tr
                        key={idx}
                        className={`transition-colors duration-300 ease-in-out font-semibold ${
                          getPlan === "Basic"
                            ? "cursor-not-allowed"
                            : "hover:bg-[#0c0d12]"
                        }`}
                      >
                        <td
                          className={`py-4 px-4 text-center text-xs text-gray-300 ${
                            getPlan === "Basic" ? "blur-md" : ""
                          }`}
                        >
                          {idx + 1}
                        </td>
                        <td
                          className={`py-4 px-10 lg:pl-48 text-left text-xs text-gray-300 ${
                            getPlan === "Basic" ? "blur-md" : ""
                          }`}
                        >
                          {site?.parsedFeedback?.response?.replace(/"/g, "") ||
                            "No analysis available"}
                        </td>
                        <td className="py-4 px-4 text-center text-xs text-gray-300">
                          <select
                            className={`bg-[#111115] border-[1px] border-[#222529] text-gray-300 text-xs rounded px-4 py-2 outline-none ${
                              getPlan === "Basic"
                                ? "blur-md cursor-not-allowed"
                                : ""
                            }`}
                            defaultValue="Pending"
                            disabled={getPlan === "Basic"}
                            onChange={async (e) => {
                              const status = e.target.value;
                              if (status === "Completed") {
                                try {
                                  setisloading(true);
                                  await db.handleStatusChange(
                                    user!,
                                    idx,
                                    status,
                                    site?.parsedFeedback?.response
                                  );

                                  setWebsites((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error updating status:",
                                    error
                                  );
                                } finally {
                                  setisloading(false);
                                }
                              }
                            }}
                          >
                            <option
                              value="Completed"
                              className="hover:bg-[#222529] text-gray-300 px-4 py-2 cursor-pointer"
                            >
                              Completed
                            </option>
                            <option
                              value="Pending"
                              className="hover:bg-[#222529] text-gray-300 px-4 py-2 cursor-pointer"
                            >
                              Pending
                            </option>
                          </select>
                        </td>
                      </tr>
                    ) : null
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-10 text-center text-slate-300"
                    >
                      <div className="flex flex-col items-center gap-5">
                        <FaRegCircleStop size={25} color="#9ca3af" />
                        <p className="font-semibold">No Analysis Yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Bar Chart */}
            <div className="w-[90vw] md:w-[60vw] mx-auto mb-5 bg-[#111115] p-4 my-10">
              <h2 className="text-gray-300 text-lg font-semibold mb-4">
                Feedback Analytics
              </h2>
              <Bar data={analytics} />
            </div>

            {/* Feedback Table */}
            <table className="border-[1px] border-[#15171b] md:mx-auto w-[80vw] md:w-[60vw] mt-7 divide-y divide-[#15171b] overflow-scroll">
              <thead className="bg-[#111115] border-[1px] border-[#15171b]">
                <tr>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase">
                    S.NO
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase">
                    Rating
                  </th>
                  <th className="py-3 px-3 md:px-9 text-left text-xs font-medium text-gray-400 uppercase">
                    Emotion
                  </th>
                  <th className="py-3 px-3 md:px-9 text-left text-xs font-medium text-gray-400 uppercase">
                    User Feedback
                  </th>
                  {/* <th className="py-3 px-3 md:px-9 text-left text-xs font-medium text-gray-400 uppercase">
                    Analysis
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-[#111115] border-[1px] border-[#15171b] overflow-scroll">
                {websites.length > 0 ? (
                  websites.map((site, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#0c0d12] transition-colors duration-300 ease-in-out cursor-pointer font-semibold"
                    >
                      <td className="py-5 px-12 text-xs text-gray-300">
                        {idx + 1}
                      </td>
                      <td className="py-5 px-12 text-xs text-gray-300">
                        {site.Rating}
                      </td>
                      <td className="py-5 px-9 text-xs text-gray-300">
                        {site.emotion}
                      </td>
                      <td className="py-5 px-9 w-72 text-xs text-gray-300">
                        {site.feedback}
                      </td>
                      {/* <td
                        className={`py-5 px-3 text-xs text-gray-300 w-60 ${
                          getPlan === "Basic" ? "blur-sm" : ""
                        }`}
                      >
                        {site?.parsedFeedback?.response?.replace(/"/g, "") ||
                          "No analysis available"}
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-5 text-center text-slate-300">
                      <div className="flex flex-col items-center gap-5">
                        <FaRegCircleStop size={25} color="#9ca3af" />
                        <p className="font-semibold">No Feedbacks Yet</p>
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
